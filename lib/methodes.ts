// Utilitaires communs aux méthodes expert (popup des articles, page /methodes-expert).

import { BaseMethodeData, Methodes } from "@/contexts/Interfaces";

export type MethodeType = BaseMethodeData["typemethode"];

export const METHODE_TYPES: { type: MethodeType; label: string; plural: string }[] = [
  { type: "joueur", label: "Joueur", plural: "Joueurs" },
  { type: "coach", label: "Coach", plural: "Coachs" },
  { type: "match", label: "Match", plural: "Matchs" },
  { type: "saison", label: "Saison", plural: "Saisons" },
];

export function methodeName(methode: Methodes): string {
  switch (methode.typemethode) {
    case "joueur":
      return methode.joueurnom;
    case "coach":
      return methode.nomcoach;
    case "match":
      return methode.titrematch;
    case "saison":
      return methode.saison;
  }
}

/** Clés « type:id » des méthodes citées dans un article (spans insérés par l'éditeur). */
export function mentionedMethodes(content: string): Set<string> {
  const keys = new Set<string>();
  for (const [span] of content.matchAll(/<span\b[^>]*class="[^"]*\bmethode-expert\b[^"]*"[^>]*>/g)) {
    const id = span.match(/data-id="([^"]+)"/)?.[1];
    const type = span.match(/data-type="([^"]+)"/)?.[1];
    if (id && type) keys.add(`${type}:${id}`);
  }
  return keys;
}

export const methodeKey = (methode: Methodes) => `${methode.typemethode}:${methode.id_methode}`;

/** Méthode prête à afficher dans le catalogue /methodes-expert (préparée côté serveur). */
export interface MethodeEntry {
  methode: Methodes;
  name: string;
  subtitle: string;
  // Portrait (joueur, coach) ou logos des deux équipes (match) ou logo du club (saison)
  image: string | null;
  logos: [string, string] | null;
  // Année du match ou début de la saison, pour le tri chronologique
  year: number | null;
  search: string;
  articles: { slug: string; title: string }[];
}

// Éléments dont le texte n'est jamais surligné automatiquement
const SKIPPED_TAGS = new Set(["a", "h1", "h2", "h3", "h4", "h5", "h6", "script", "style"]);
const VOID_TAGS = new Set(["area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "source", "track", "wbr"]);
// Balise HTML complète, y compris avec des « > » dans les valeurs d'attributs
const TAG = /(<\/?[a-zA-Z][^\s/>]*(?:"[^"]*"|'[^']*'|[^'">])*>|<!--[\s\S]*?-->)/;
const SEASON = String.raw`\d{4}[-–/]\d{4}`;

const escapeRegExp = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const normalizeSeason = (value: string) => value.replace(/[–/]/, "-");

/**
 * Surligne dans le HTML d'un article les noms complets des joueurs et coachs et
 * les saisons « xxxx-xxxx » ayant une méthode expert, comme si l'auteur les avait
 * insérés dans l'éditeur. Les méthodes déjà insérées, les liens et les titres
 * sont laissés tels quels. Casse ignorée, accents respectés ; à nom égal, la
 * méthode joueur l'emporte sur la méthode coach.
 */
export function linkMethodes(content: string, methodes: Methodes[]): string {
  const byName = new Map<string, Methodes>();
  const bySeason = new Map<string, Methodes>();
  // Joueurs en dernier pour qu'ils écrasent un coach de même nom
  const ordered = [
    ...methodes.filter((m) => m.typemethode !== "joueur"),
    ...methodes.filter((m) => m.typemethode === "joueur"),
  ];
  for (const methode of ordered) {
    if (methode.typemethode === "joueur" || methode.typemethode === "coach") {
      const name = methodeName(methode).trim().replace(/\s+/g, " ");
      if (name) byName.set(name.toLocaleLowerCase("fr"), methode);
    } else if (methode.typemethode === "saison") {
      bySeason.set(normalizeSeason(methode.saison.trim()), methode);
    }
  }
  if (byName.size === 0 && bySeason.size === 0) return content;

  // Noms les plus longs d'abord : « Jean-Marc Ferreri » avant un éventuel « Marc Ferreri »
  const names = [...byName.keys()]
    .sort((a, b) => b.length - a.length)
    .map((name) => escapeRegExp(name).replace(/ /g, String.raw`\s+`));
  const pattern = new RegExp(
    String.raw`(?<![\p{L}\p{N}_-])(?:${[...names, SEASON].join("|")})(?![\p{L}\p{N}_-])`,
    "giu",
  );

  const link = (match: string) => {
    const methode = /^\d/.test(match)
      ? bySeason.get(normalizeSeason(match))
      : byName.get(match.replace(/\s+/g, " ").toLocaleLowerCase("fr"));
    if (!methode) return match;
    return `<span class="methode-expert" data-id="${methode.id_methode}" data-type="${methode.typemethode}">${match}</span>`;
  };

  // Pile des éléments ouverts : true si leur contenu ne doit pas être surligné
  const open: { tag: string; skip: boolean }[] = [];
  return content
    .split(TAG)
    .map((part, i) => {
      if (i % 2 === 0) {
        return open.some((el) => el.skip) ? part : part.replace(pattern, link);
      }
      const [, closing, name] = part.match(/^<(\/?)([a-zA-Z][^\s/>]*)/) ?? [];
      if (!name) return part;
      const tag = name.toLowerCase();
      if (closing) {
        const index = open.map((el) => el.tag).lastIndexOf(tag);
        if (index !== -1) open.length = index;
      } else if (!VOID_TAGS.has(tag) && !part.endsWith("/>")) {
        const skip = SKIPPED_TAGS.has(tag) || (tag === "span" && /\bmethode-expert\b/.test(part));
        open.push({ tag, skip });
      }
      return part;
    })
    .join("");
}
