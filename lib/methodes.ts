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
