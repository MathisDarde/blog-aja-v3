// Adresses des pages des méthodes (/joueurs/djibril-cisse, /matchs/auxerre-borussia-dortmund-1993…).
// Sans import : aussi utilisé par le script db/scripts/backfill-methode-slugs.mjs.

/** « Stéphane Guivarc'h » → « stephane-guivarch » */
export function slugify(value: string): string {
  return value
    .replace(/['’]/g, "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// Formes juridiques et sigles retirés des noms de clubs : « AJ Auxerre » → « auxerre »
const CLUB_AFFIXES = /^(aj|ac|as|fc|sc|cf|afc|ssc|rc|us|ogc|losc|sco|cs|ca|cd|sv|vfb|vfl|fk|sk|kv|krc|rsc|bsc)\s+|\s+(fc|cf|sc|ac|afc|hsc)$/gi;

export function clubSlug(name: string): string {
  return slugify(name.trim().replace(CLUB_AFFIXES, "").replace(CLUB_AFFIXES, "")) || slugify(name);
}

const firstYear = (text: string) => text.match(/\b(19|20)\d{2}\b/)?.[0] ?? "";

interface SlugSource {
  typemethode: string;
  joueurnom?: string;
  nomcoach?: string;
  saison?: string;
  nomequipe1?: string;
  nomequipe2?: string;
  date?: string;
}

/** Adresse proposée pour une méthode, avant dédoublonnage. */
export function baseMethodeSlug(methode: SlugSource): string {
  switch (methode.typemethode) {
    case "joueur":
      return slugify(methode.joueurnom ?? "");
    case "coach":
      return slugify(methode.nomcoach ?? "");
    case "saison":
      return slugify(methode.saison ?? "");
    case "match":
      return [clubSlug(methode.nomequipe1 ?? ""), clubSlug(methode.nomequipe2 ?? ""), firstYear(methode.date ?? "")]
        .filter(Boolean)
        .join("-");
    default:
      return "";
  }
}

/** Première adresse libre : « auxerre-ajax-1993 », sinon « auxerre-ajax-1993-2 »… */
export function uniqueSlug(base: string, taken: Set<string>): string {
  const root = base || "methode";
  if (!taken.has(root)) return root;
  for (let i = 2; ; i++) {
    const candidate = `${root}-${i}`;
    if (!taken.has(candidate)) return candidate;
  }
}
