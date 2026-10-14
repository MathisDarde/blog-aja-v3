// Recherche d'un joueur dans un effectif par son nom, utilisable côté client comme serveur.

export interface SquadPlayer {
  nom: string;
  numero: string;
}

const normalize = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

/** Joueur de l'effectif correspondant à un nom tapé ou lu (« Jubal » → « Jubal Jr »). */
export function findSquadPlayer(effectif: SquadPlayer[], name: string): SquadPlayer | null {
  const wanted = normalize(name);
  if (!wanted) return null;
  return (
    effectif.find((p) => normalize(p.nom) === wanted) ??
    effectif.find((p) => normalize(p.nom).split(" ").slice(-1)[0] === wanted) ??
    effectif.find((p) => ` ${normalize(p.nom)} `.includes(` ${wanted} `)) ??
    effectif.find((p) => normalize(p.nom).includes(wanted)) ??
    null
  );
}
