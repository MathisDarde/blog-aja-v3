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

// Mots trop génériques pour identifier un club à partir de son nom
const GENERIC_WORDS = new Set([
  "fc", "ac", "as", "aj", "sc", "rc", "us", "ss", "cf", "afc", "cd", "sd",
  "fk", "sk", "sv", "club", "football", "futbol", "calcio", "sports", "sport",
  "sportiva", "societa", "sportive", "association", "olympique", "real",
  "sporting", "united", "city", "de", "du", "des", "la", "le", "les", "di",
  "del", "of", "the",
]);

const normalize = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

/** Cherche un logo déjà présent dans public/_assets/teamlogos à partir du nom du club. */
export function findLocalLogo(clubName: string): string | null {
  const words = normalize(clubName).split(" ").filter(Boolean);
  const significant = words.filter((w) => !GENERIC_WORDS.has(w));
  // Nom complet uniquement : un seul mot confondrait Kouban Krasnodar et FK Krasnodar
  const candidates = new Set([words.join(""), significant.join("")]);

  const file = logosList.find((f) =>
    candidates.has(f.replace(/^logo/, "").replace(/\.[a-z]+$/, "")),
  );
  return file ? `${LOCAL_LOGOS_PATH}${file}` : null;
}

/**
 * Logo de chaque club de la carrière, par ordre de préférence :
 * bibliothèque (clubs_table) → logo local du même nom → logo Wikidata copié sur Cloudinary.
 * Renvoie une map clubId → logo (absente si aucun logo trouvé), avec le nom
 * mémorisé dans la bibliothèque s'il a été corrigé lors d'un enregistrement.
 */
export async function resolveClubLogos(
  career: WikidataCareerEntry[],
): Promise<Map<string, { logoUrl: string; nom?: string }>> {
  const clubs = new Map(career.map((entry) => [entry.clubId, entry]));
  const logos = new Map<string, { logoUrl: string; nom?: string }>();
  if (clubs.size === 0) return logos;

  try {
    const known = await db
      .select()
      .from(clubsTable)
      .where(inArray(clubsTable.wikidataId, [...clubs.keys()]));
    for (const club of known) {
      logos.set(club.wikidataId, { logoUrl: club.logoUrl, nom: club.nom });
    }
  } catch (error) {
    // Bibliothèque inaccessible (ex. table pas encore créée) : on continue sans
    console.error("Bibliothèque de logos inaccessible", error);
  }

  await Promise.all(
    [...clubs.values()]
      .filter((club) => !logos.has(club.clubId))
      .map(async (club) => {
        const local = findLocalLogo(club.clubName);
        if (local) {
          logos.set(club.clubId, { logoUrl: local });
          return;
        }
        if (!club.logoFile) return;

        try {
          const image = await downloadCommonsImage(club.logoFile);
          const { secure_url } = await uploadBufferToCloudinary(image, {
            folder: "clubs",
            resource_type: "image",
          });
          logos.set(club.clubId, { logoUrl: secure_url });
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
