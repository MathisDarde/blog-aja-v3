// Correspondance nom de club → logo de public/_assets/teamlogos, sans dépendance serveur :
// utilisable côté client (getTeamInfo) comme côté serveur (lib/club-logos).

import logosList from "@/lib/image-assets/clubs-list.json";
import { normalizeText } from "@/lib/normalize-text";

export const LOCAL_LOGOS_PATH = "/_assets/teamlogos/";

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
