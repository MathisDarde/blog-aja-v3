import { inArray, sql } from "drizzle-orm";
import { db } from "@/db/db";
import { clubsTable } from "@/db/schema";
import logosList from "@/lib/image-assets/clubs-list.json";
import { normalizeText } from "@/lib/normalize-text";
import { uploadBufferToCloudinary } from "@/lib/cloudinary";
import {
  downloadCommonsImage,
  getWikipediaLogoFile,
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

const normalize = normalizeText;

const localLogoStems = new Map(
  logosList.map((file) => [file.replace(/^logo/, "").replace(/\.[a-z]+$/, ""), file]),
);

/** Cherche un logo déjà présent dans public/_assets/teamlogos à partir du nom du club. */
export function findLocalLogo(clubName: string): string | null {
  const raw = normalize(clubName)
    .split(" ")
    .filter((w) => w && !/^\d+$/.test(w)); // « Stade brestois 29 », « -19 ans »

  // Avec et sans alias : « stetienne » mais « jssaintpierroise »
  const candidates = [raw.map((w) => ALIASES[w] ?? w), raw].flatMap((words) => {
    const withoutType = words.filter((w) => !CLUB_TYPE_WORDS.has(w));
    const significant = withoutType.filter((w) => !ARTICLES.has(w));
    return [
      FULL_NAME_ALIASES[significant.join("")] ?? "",
      words.join(""), // « Stade de Reims » → stadedereims
      withoutType.join(""), // « Le Havre AC » → lehavre
      significant.join(""), // « AS Saint-Étienne » → stetienne
      // Premier mot seulement (« Lille OSC » → lille) : jamais le dernier, pour ne pas
      // confondre « Kouban Krasnodar » avec le FK Krasnodar
      significant[0] ?? "",
    ];
  });

  const stem = candidates.find((candidate) => candidate.length >= 3 && localLogoStems.has(candidate));
  return stem ? `${LOCAL_LOGOS_PATH}${localLogoStems.get(stem)}` : null;
}

// « Olympique de Marseille (prêt) » → « Olympique de Marseille »
const withoutNote = (name: string) => name.replace(/\s*\([^)]*\)$/, "");

/**
 * Clé d'un club sans élément Wikidata dans la bibliothèque (ex. « nom:us-revel ») :
 * un logo importé à la main pour ce club est ainsi retrouvé aux imports suivants.
 */
const nameKey = (name: string) =>
  `nom:${normalize(withoutNote(name)).replace(/ /g, "-")}`;

/** Clé d'un club dans la map des logos : son identifiant Wikidata, à défaut son nom. */
/**
 * Recherche par nom dans la bibliothèque de logos (clubs_table) : nom exact, sinon le plus
 * long nom connu qui commence le nom cherché (« Real Madrid » pour « Real Madrid CF »).
 */
export async function clubLogoLibraryFinder(): Promise<(clubName: string) => string | null> {
  let library: { name: string; logoUrl: string }[] = [];
  try {
    library = (await db.select({ nom: clubsTable.nom, logoUrl: clubsTable.logoUrl }).from(clubsTable))
      .map((club) => ({ name: normalize(club.nom), logoUrl: club.logoUrl }))
      .sort((a, b) => b.name.length - a.name.length);
  } catch (error) {
    console.error("Bibliothèque de logos inaccessible", error);
  }

  return (clubName) => {
    const wanted = normalize(clubName);
    return (
      library.find((club) => club.name === wanted)?.logoUrl ??
      library.find((club) => wanted.startsWith(`${club.name} `))?.logoUrl ??
      null
    );
  };
}

export const clubLogoKey = (entry: WikidataCareerEntry) =>
  entry.clubId ?? nameKey(entry.clubName);

/**
 * Logo de chaque club de la carrière, par ordre de préférence :
 * bibliothèque (clubs_table) → logo local du même nom → logo Wikidata, à défaut celui
 * de l'infobox Wikipédia du club, copié sur Cloudinary.
 * Renvoie une map clubLogoKey → URL du logo (absente si aucun logo trouvé).
 */
export async function resolveClubLogos(
  career: WikidataCareerEntry[],
): Promise<Map<string, string>> {
  const clubs = new Map(career.map((entry) => [clubLogoKey(entry), entry]));
  const logos = new Map<string, string>();
  if (clubs.size === 0) return logos;

  // Bibliothèque : par identifiant Wikidata, à défaut par nom (logos importés à la main)
  const libraryKeys = career.flatMap((entry) => [
    ...(entry.clubId ? [entry.clubId] : []),
    nameKey(entry.clubName),
  ]);

  try {
    const known = new Map(
      (
        await db
          .select()
          .from(clubsTable)
          .where(inArray(clubsTable.wikidataId, [...new Set(libraryKeys)]))
      ).map((club) => [club.wikidataId, club.logoUrl]),
    );
    for (const [key, club] of clubs) {
      const logo =
        (club.clubId ? known.get(club.clubId) : undefined) ?? known.get(nameKey(club.clubName));
      if (logo) logos.set(key, logo);
    }
  } catch (error) {
    // Bibliothèque inaccessible (ex. table pas encore créée) : on continue sans
    console.error("Bibliothèque de logos inaccessible", error);
  }

  await Promise.all(
    [...clubs.entries()]
      .filter(([key]) => !logos.has(key))
      .map(async ([key, club]) => {
        const local = findLocalLogo(withoutNote(club.clubName));
        if (local) {
          logos.set(key, local);
          return;
        }
        try {
          const logoFile =
            club.logoFile ??
            (club.clubPage ? await getWikipediaLogoFile(club.clubPage) : null);
          if (!logoFile) return;

          const image = await downloadCommonsImage(logoFile);
          const { secure_url } = await uploadBufferToCloudinary(image, {
            folder: "clubs",
            resource_type: "image",
          });
          logos.set(key, secure_url);
          await rememberClubLogos([[secure_url, club.clubName, "", club.clubId ?? ""]]);
        } catch (error) {
          // Un logo manquant ne doit pas bloquer l'import
          console.error(`Logo indisponible pour ${club.clubName}`, error);
        }
      }),
  );

  return logos;
}

/**
 * Enregistre dans la bibliothèque les logos des lignes de clubs ([logo, nom, années,
 * wikidataId?]), pour ne plus avoir à les chercher. Un club sans élément Wikidata est
 * rangé sous son nom.
 */
export async function rememberClubLogos(clubs: string[][]) {
  const rows = new Map(
    clubs
      .filter(([logo, nom]) => logo && nom)
      .map(([logoUrl, nom, , id]) => {
        const wikidataId = id && isWikidataId(id) ? id : nameKey(nom);
        return [wikidataId, { wikidataId, nom: withoutNote(nom), logoUrl }];
      }),
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
