// Recherche d'un joueur dans un effectif par son nom, utilisable côté client comme serveur.

import { normalizeText } from "@/lib/normalize-text";

export interface SquadPlayer {
  nom: string;
  numero: string;
  // « Gardien », « Défenseur », « Milieu » ou « Attaquant » (effectifs Wikipédia)
  poste?: string;
  nationalite?: string;
}

/** Joueur de l'effectif correspondant à un nom tapé ou lu (« Jubal » → « Jubal Jr »). */
export function findSquadPlayer<P extends SquadPlayer>(effectif: P[], name: string): P | null {
  const wanted = normalizeText(name);
  if (!wanted) return null;
  return (
    effectif.find((p) => normalizeText(p.nom) === wanted) ??
    effectif.find((p) => normalizeText(p.nom).split(" ").slice(-1)[0] === wanted) ??
    effectif.find((p) => ` ${normalizeText(p.nom)} `.includes(` ${wanted} `)) ??
    effectif.find((p) => normalizeText(p.nom).includes(wanted)) ??
    null
  );
}
