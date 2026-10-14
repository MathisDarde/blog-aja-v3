import { inArray, sql } from "drizzle-orm";
import { db } from "@/db/db";
import { clubsTable } from "@/db/schema";
import logosList from "@/lib/image-assets/clubs-list.json";
import { uploadBufferToCloudinary } from "@/lib/cloudinary";
import {
  downloadCommonsImage,
  isWikidataId,
  WikidataCareerEntry,
} from "@/lib/wikidata";

const LOCAL_LOGOS_PATH = "/_assets/teamlogos/";

// Sigles et mots désignant le type de club, sans valeur pour l'identifier
const CLUB_TYPE_WORDS = new Set([
  "fc", "ac", "as", "aj", "sc", "rc", "us", "ss", "cf", "afc", "cd", "sd",
  "fk", "sk", "sv", "ogc", "hsc", "osc", "es", "sm", "club", "football", "futbol", "calcio",
  "sports", "sport", "sportiva", "societa", "sportive", "association",
  "olympique", "real", "sporting", "united", "city", "stade",
]);
const ARTICLES = new Set(["de", "du", "des", "la", "le", "les", "di", "del", "of", "the"]);

// Adjectifs ou graphies françaises → nom utilisé pour le fichier du logo
const ALIASES: Record<string, string> = {
  lyonnais: "lyon",
  brestois: "brest",
  rennais: "rennes",
  kouban: "kuban",
  saint: "st",
};

// Noms complets dont le fichier ne suit pas le nom du club
const FULL_NAME_ALIASES: Record<string, string> = {
  parisstgermain: "parissg",
  qprangers: "qpr",
  queensparkrangers: "qpr",
};

const normalize = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

const localLogoStems = new Map(
  logosList.map((file) => [file.replace(/^logo/, "").replace(/\.[a-z]+$/, ""), file]),
);

/** Cherche un logo déjà présent dans public/_assets/teamlogos à partir du nom du club. */
export function findLocalLogo(clubName: string): string | null {
  const words = normalize(clubName)
    .split(" ")
    .filter((w) => w && !/^\d+$/.test(w)) // « Stade brestois 29 », « -19 ans »
    .map((w) => ALIASES[w] ?? w);
  const withoutType = words.filter((w) => !CLUB_TYPE_WORDS.has(w));
  const significant = withoutType.filter((w) => !ARTICLES.has(w));

  const candidates = [
    FULL_NAME_ALIASES[significant.join("")] ?? "",
    words.join(""), // « Stade de Reims » → stadedereims
    withoutType.join(""), // « Le Havre AC » → lehavre
    significant.join(""), // « AS Saint-Étienne » → stetienne
    // Premier mot seulement (« Lille OSC » → lille) : jamais le dernier, pour ne pas
    // confondre « Kouban Krasnodar » avec le FK Krasnodar
    significant[0] ?? "",
  ];

  const stem = candidates.find((candidate) => candidate.length >= 3 && localLogoStems.has(candidate));
  return stem ? `${LOCAL_LOGOS_PATH}${localLogoStems.get(stem)}` : null;
}

/** Clé d'un club dans la map des logos : son identifiant Wikidata, à défaut son nom. */
export const clubLogoKey = (entry: WikidataCareerEntry) =>
  entry.clubId ?? `nom:${entry.clubName}`;

/**
 * Logo de chaque club de la carrière, par ordre de préférence :
 * bibliothèque (clubs_table) → logo local du même nom → logo Wikidata copié sur Cloudinary.
 * Renvoie une map clubLogoKey → logo (absente si aucun logo trouvé), avec le nom
 * mémorisé dans la bibliothèque s'il a été corrigé lors d'un enregistrement.
 */
export async function resolveClubLogos(
  career: WikidataCareerEntry[],
): Promise<Map<string, { logoUrl: string; nom?: string }>> {
  const clubs = new Map(career.map((entry) => [clubLogoKey(entry), entry]));
  const logos = new Map<string, { logoUrl: string; nom?: string }>();
  if (clubs.size === 0) return logos;

  const wikidataIds = career.map((entry) => entry.clubId).filter((id): id is string => Boolean(id));

  try {
    const known = wikidataIds.length === 0 ? [] : await db
      .select()
      .from(clubsTable)
      .where(inArray(clubsTable.wikidataId, wikidataIds));
    for (const club of known) {
      logos.set(club.wikidataId, { logoUrl: club.logoUrl, nom: club.nom });
    }
  } catch (error) {
    // Bibliothèque inaccessible (ex. table pas encore créée) : on continue sans
    console.error("Bibliothèque de logos inaccessible", error);
  }

  await Promise.all(
    [...clubs.entries()]
      .filter(([key]) => !logos.has(key))
      .map(async ([key, club]) => {
        // « RC Lens (adjoint) » → « RC Lens »
        const local = findLocalLogo(club.clubName.replace(/\s*\([^)]*\)$/, ""));
        if (local) {
          logos.set(key, { logoUrl: local });
          return;
        }
        if (!club.logoFile || !club.clubId) return;

        try {
          const image = await downloadCommonsImage(club.logoFile);
          const { secure_url } = await uploadBufferToCloudinary(image, {
            folder: "clubs",
            resource_type: "image",
          });
          logos.set(key, { logoUrl: secure_url });
          await rememberClubLogos([[secure_url, club.clubName, "", club.clubId]]);
        } catch (error) {
          // Un logo manquant ne doit pas bloquer l'import
          console.error(`Logo Wikidata indisponible pour ${club.clubName}`, error);
        }
      }),
  );

  return logos;
}

/**
 * Enregistre dans la bibliothèque les logos des lignes de clubs issues de Wikidata
 * ([logo, nom, années, wikidataId]), pour ne plus avoir à les chercher.
 */
export async function rememberClubLogos(clubs: string[][]) {
  const rows = new Map(
    clubs
      .filter(([logo, nom, , id]) => logo && nom && id && isWikidataId(id))
      .map(([logoUrl, nom, , wikidataId]) => [
        wikidataId,
        { wikidataId, nom, logoUrl },
      ]),
  );
  if (rows.size === 0) return;

  await db
    .insert(clubsTable)
    .values([...rows.values()])
    .onConflictDoUpdate({
      target: clubsTable.wikidataId,
      set: {
        nom: sql`excluded."nom"`,
        logoUrl: sql`excluded."logoUrl"`,
        updatedAt: new Date(),
      },
    });
}

/** Variante pour l'enregistrement d'une méthode, qui ne doit pas échouer à cause des logos. */
export async function rememberClubLogosSafely(clubs: string[][]) {
  try {
    await rememberClubLogos(clubs);
  } catch (err) {
    console.error("Impossible de mémoriser les logos des clubs", err);
  }
}
