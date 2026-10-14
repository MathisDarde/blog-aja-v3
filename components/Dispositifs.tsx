// Dispositifs tactiques : postes de chaque système et leur place sur les terrains.
//
// Chaque système est décrit par ses lignes, de la défense à l'attaque, chaque ligne
// listant ses postes de la gauche vers la droite de l'équipe. Les coordonnées sont
// calculées pour que les lignes soient régulièrement espacées et que les étiquettes
// des joueurs d'une même ligne ne se chevauchent pas.
//
// Coordonnées « x%,y% » :
// - positionDom : terrain complet, équipe à domicile en haut (gardien en haut) ;
// - positionExt : terrain complet, équipe à l'extérieur en bas (gardien en bas) ;
// - demiTerrain : demi-terrain de la méthode saison, but en haut.
// La gauche de l'équipe est à droite de l'image quand le gardien est en haut.
//
// L'ordre de `postes` est celui des titulaires dans les formulaires : il ne doit pas
// changer, pas plus que les noms des postes (enregistrés dans les méthodes).

interface Formation {
  id: number;
  name: string;
  postes: string[];
  lignes: string[][];
}

export interface Poste {
  name: string;
  positionDom: string;
  positionExt: string;
  demiTerrain: string;
  // Largeur maximale de l'étiquette du nom, en % de la largeur du terrain
  largeur: number;
}

const DEF4 = ["Défenseur Gauche", "Défenseur Central Gauche", "Défenseur Central Droit", "Défenseur Droit"];
const LAT4 = ["Latéral Gauche", "Défenseur Central Gauche", "Défenseur Central Droit", "Latéral Droit"];
const DEF3 = ["Défenseur Central Gauche", "Défenseur Central Axial", "Défenseur Central Droit"];
const DEF5 = ["Piston Gauche", ...DEF3, "Piston Droit"];

const FORMATIONS: Formation[] = [
  {
    id: 1,
    name: "4-3-3 Défensif",
    postes: ["Gardien", ...DEF4, "Milieu Défensif", "Milieu Gauche", "Milieu Droit", "Ailier Gauche", "Buteur", "Ailier Droit"],
    lignes: [DEF4, ["Milieu Défensif"], ["Milieu Gauche", "Milieu Droit"], ["Ailier Gauche", "Buteur", "Ailier Droit"]],
  },
  {
    id: 2,
    name: "5-4-1",
    postes: ["Gardien", ...DEF5, "Milieu Gauche", "Milieu Central Gauche", "Milieu Central Droit", "Milieu Droit", "Buteur"],
    lignes: [DEF5, ["Milieu Gauche", "Milieu Central Gauche", "Milieu Central Droit", "Milieu Droit"], ["Buteur"]],
  },
  {
    id: 3,
    name: "4-3-3 Offensif",
    postes: ["Gardien", ...DEF4, "Milieu Relayeur Gauche", "Milieu Relayeur Droite", "Milieu Offensif Central", "Ailier Gauche", "Buteur", "Ailier Droit"],
    lignes: [DEF4, ["Milieu Relayeur Gauche", "Milieu Relayeur Droite"], ["Milieu Offensif Central"], ["Ailier Gauche", "Buteur", "Ailier Droit"]],
  },
  {
    id: 4,
    name: "4-2-3-1",
    postes: ["Gardien", ...DEF4, "Milieu Défensif Gauche", "Milieu Défensif Droit", "Milieu Offensif Gauche", "Meneur de Jeu", "Milieu Offensif Droit", "Buteur"],
    lignes: [DEF4, ["Milieu Défensif Gauche", "Milieu Défensif Droit"], ["Milieu Offensif Gauche", "Meneur de Jeu", "Milieu Offensif Droit"], ["Buteur"]],
  },
  {
    id: 5,
    name: "4-4-2",
    postes: ["Gardien", ...DEF4, "Milieu Gauche", "Milieu Central Gauche", "Milieu Central Droit", "Milieu Droit", "Buteur Gauche", "Buteur Droit"],
    lignes: [DEF4, ["Milieu Gauche", "Milieu Central Gauche", "Milieu Central Droit", "Milieu Droit"], ["Buteur Gauche", "Buteur Droit"]],
  },
  {
    id: 7,
    name: "4-1-4-1",
    postes: ["Gardien", ...DEF4, "Milieu Défensif", "Milieu Gauche", "Milieu Relayeur Gauche", "Milieu Relayeur Droit", "Milieu Droit", "Buteur"],
    lignes: [DEF4, ["Milieu Défensif"], ["Milieu Gauche", "Milieu Relayeur Gauche", "Milieu Relayeur Droit", "Milieu Droit"], ["Buteur"]],
  },
  {
    id: 8,
    name: "3-5-2",
    postes: ["Gardien", ...DEF3, "Piston Gauche", "Milieu Relayeur Gauche", "Milieu Sentinelle", "Milieu Relayeur Droit", "Piston Droit", "Buteur Gauche", "Buteur Droit"],
    lignes: [DEF3, ["Milieu Sentinelle"], ["Piston Gauche", "Milieu Relayeur Gauche", "Milieu Relayeur Droit", "Piston Droit"], ["Buteur Gauche", "Buteur Droit"]],
  },
  {
    id: 9,
    name: "4-5-1",
    postes: ["Gardien", ...LAT4, "Milieu Gauche", "Milieu Relayeur Gauche", "Milieu Sentinelle", "Milieu Relayeur Droit", "Milieu Droit", "Buteur"],
    lignes: [LAT4, ["Milieu Sentinelle"], ["Milieu Gauche", "Milieu Relayeur Gauche", "Milieu Relayeur Droit", "Milieu Droit"], ["Buteur"]],
  },
  {
    id: 10,
    name: "4-4-1-1",
    postes: ["Gardien", ...LAT4, "Milieu Gauche", "Milieu Central Gauche", "Milieu Central Droit", "Milieu Droit", "Attaquant de Soutien", "Buteur"],
    lignes: [LAT4, ["Milieu Gauche", "Milieu Central Gauche", "Milieu Central Droit", "Milieu Droit"], ["Attaquant de Soutien"], ["Buteur"]],
  },
  {
    id: 11,
    name: "5-3-2",
    postes: ["Gardien", ...DEF5, "Milieu Relayeur Gauche", "Milieu Sentinelle", "Milieu Relayeur Droit", "Buteur Gauche", "Buteur Droit"],
    lignes: [DEF5, ["Milieu Relayeur Gauche", "Milieu Sentinelle", "Milieu Relayeur Droit"], ["Buteur Gauche", "Buteur Droit"]],
  },
  {
    id: 12,
    name: "3-4-3",
    postes: ["Gardien", ...DEF3, "Piston Gauche", "Milieu Central Gauche", "Milieu Central Droit", "Piston Droit", "Ailier Gauche", "Buteur", "Ailier Droit"],
    lignes: [DEF3, ["Piston Gauche", "Milieu Central Gauche", "Milieu Central Droit", "Piston Droit"], ["Ailier Gauche", "Buteur", "Ailier Droit"]],
  },
  {
    id: 13,
    name: "4-2-4",
    postes: ["Gardien", ...DEF4, "Milieu Central Gauche", "Milieu Central Droit", "Ailier Gauche", "Buteur Gauche", "Buteur Droit", "Ailier Droit"],
    lignes: [DEF4, ["Milieu Central Gauche", "Milieu Central Droit"], ["Ailier Gauche", "Buteur Gauche", "Buteur Droit", "Ailier Droit"]],
  },
];

// Marge latérale selon le nombre de joueurs de la ligne (en %)
const MARGES: Record<number, number> = { 1: 50, 2: 32, 3: 20, 4: 12, 5: 10 };

// Hauteurs (en %) de la première et de la dernière ligne, gardien à part
const TERRAIN_COMPLET = { gardien: 5, defense: 15, attaque: 43 };
const DEMI_TERRAIN = { gardien: 7, defense: 27, attaque: 90 };

const round = (value: number) => Math.round(value * 10) / 10;
const coords = (x: number, y: number) => `${round(x)}%,${round(y)}%`;

function buildDispositif({ id, name, postes, lignes }: Formation) {
  const places = new Map<string, Poste>();
  places.set("Gardien", {
    name: "Gardien",
    positionDom: coords(50, TERRAIN_COMPLET.gardien),
    positionExt: coords(50, 100 - TERRAIN_COMPLET.gardien - 0.5),
    demiTerrain: coords(50, DEMI_TERRAIN.gardien),
    largeur: 26,
  });

  lignes.forEach((ligne, rang) => {
    const avancement = lignes.length === 1 ? 0.5 : rang / (lignes.length - 1);
    const marge = MARGES[ligne.length] ?? 8;
    const ecart = ligne.length > 1 ? (100 - 2 * marge) / (ligne.length - 1) : 100;

    ligne.forEach((poste, i) => {
      // x depuis la gauche de l'équipe ; les joueurs excentrés un peu plus haut
      const x = ligne.length === 1 ? 50 : marge + i * ecart;
      const excentre = ((x - 50) / 50) ** 2;
      const yComplet =
        TERRAIN_COMPLET.defense +
        avancement * (TERRAIN_COMPLET.attaque - TERRAIN_COMPLET.defense) +
        1.5 * excentre;
      const yDemi =
        DEMI_TERRAIN.defense + avancement * (DEMI_TERRAIN.attaque - DEMI_TERRAIN.defense) + 1.5 * excentre;

      places.set(poste, {
        name: poste,
        positionDom: coords(100 - x, yComplet),
        positionExt: coords(x, 100 - yComplet),
        demiTerrain: coords(100 - x, yDemi),
        largeur: round(Math.min(26, ecart - 1.5)),
      });
    });
  });

  return {
    id,
    name,
    postes: postes.map((poste) => {
      const place = places.get(poste);
      if (!place) throw new Error(`Poste ${poste} absent des lignes du ${name}`);
      return place;
    }),
  };
}

export const Dispositifs = FORMATIONS.map(buildDispositif);
