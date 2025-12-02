export const Dispositifs = [
  // 1. 4-3-3 défensif
  {
    id: 1,
    name: "4-3-3 Défensif",
    postes: [
      {
        name: "Gardien",
        positionDom: "50%,6%",
        positionExt: "50%,88%",
      },
      {
        name: "Défenseur Gauche",
        positionDom: "15%,18%",
        positionExt: "85%,78%",
      },
      {
        name: "Défenseur Central Gauche",
        positionDom: "36%,18%",
        positionExt: "64%,78%",
      },
      {
        name: "Défenseur Central Droit",
        positionDom: "64%,18%",
        positionExt: "36%,78%",
      },
      {
        name: "Défenseur Droit",
        positionDom: "85%,18%",
        positionExt: "15%,78%",
      },
      {
        name: "Milieu Défensif",
        positionDom: "50%,28%",
        positionExt: "50%,68%",
      },
      {
        name: "Milieu Gauche",
        positionDom: "28%,36%",
        positionExt: "72%,60%",
      },
      {
        name: "Milieu Droit",
        positionDom: "72%,36%",
        positionExt: "28%,60%",
      },
      {
        name: "Ailier Gauche",
        positionDom: "15%,45%",
        positionExt: "85%,53%",
      },
      {
        name: "Buteur",
        positionDom: "50%,45%",
        positionExt: "50%,53%",
      },
      {
        name: "Ailier Droit",
        positionDom: "85%,45%",
        positionExt: "15%,53%",
      },
    ],
  },

  // 2. 5-4-1
  {
    id: 2,
    name: "5-4-1",
    postes: [
      {
        name: "Gardien",
        positionDom: "50%,6%",
        positionExt: "50%,88%",
      },
      {
        name: "Piston Gauche", // Un peu plus haut que les centraux
        positionDom: "10%,20%",
        positionExt: "90%,76%",
      },
      {
        name: "Défenseur Central Gauche",
        positionDom: "30%,18%",
        positionExt: "70%,78%",
      },
      {
        name: "Défenseur Central Axial", // Le Libéro au milieu
        positionDom: "50%,18%",
        positionExt: "50%,78%",
      },
      {
        name: "Défenseur Central Droit",
        positionDom: "70%,18%",
        positionExt: "30%,78%",
      },
      {
        name: "Piston Droit",
        positionDom: "90%,20%",
        positionExt: "10%,76%",
      },
      {
        name: "Milieu Gauche",
        positionDom: "20%,35%",
        positionExt: "80%,61%",
      },
      {
        name: "Milieu Central Gauche",
        positionDom: "40%,35%",
        positionExt: "60%,61%",
      },
      {
        name: "Milieu Central Droit",
        positionDom: "60%,35%",
        positionExt: "40%,61%",
      },
      {
        name: "Milieu Droit",
        positionDom: "80%,35%",
        positionExt: "20%,61%",
      },
      {
        name: "Buteur", // Seul en pointe
        positionDom: "50%,45%",
        positionExt: "50%,53%",
      },
    ],
  },

  // 3. 4-3-3 offensif
  {
    id: 3,
    name: "4-3-3 Offensif",
    postes: [
      {
        name: "Gardien",
        positionDom: "50%,6%",
        positionExt: "50%,88%",
      },
      {
        name: "Défenseur Gauche",
        positionDom: "15%,18%",
        positionExt: "85%,78%",
      },
      {
        name: "Défenseur Central Gauche",
        positionDom: "36%,18%",
        positionExt: "64%,78%",
      },
      {
        name: "Défenseur Central Droit",
        positionDom: "64%,18%",
        positionExt: "36%,78%",
      },
      {
        name: "Défenseur Droit",
        positionDom: "85%,18%",
        positionExt: "15%,78%",
      },
      // Le triangle du milieu est inversé par rapport au défensif
      {
        name: "Milieu Relayeur Gauche",
        positionDom: "35%,30%",
        positionExt: "65%,66%",
      },
      {
        name: "Milieu Relayeur Droite",
        positionDom: "65%,30%",
        positionExt: "35%,66%",
      },
      {
        name: "Milieu Offensif Central", // La pointe haute
        positionDom: "50%,38%",
        positionExt: "50%,58%",
      },
      {
        name: "Ailier Gauche",
        positionDom: "15%,45%",
        positionExt: "85%,53%",
      },
      {
        name: "Buteur",
        positionDom: "50%,45%",
        positionExt: "50%,53%",
      },
      {
        name: "Ailier Droit",
        positionDom: "85%,45%",
        positionExt: "15%,53%",
      },
    ],
  },

  // 4. 4-2-3-1
  {
    id: 4,
    name: "4-2-3-1",
    postes: [
      {
        name: "Gardien",
        positionDom: "50%,6%",
        positionExt: "50%,88%",
      },
      {
        name: "Défenseur Gauche",
        positionDom: "15%,18%",
        positionExt: "85%,78%",
      },
      {
        name: "Défenseur Central Gauche",
        positionDom: "36%,18%",
        positionExt: "64%,78%",
      },
      {
        name: "Défenseur Central Droit",
        positionDom: "64%,18%",
        positionExt: "36%,78%",
      },
      {
        name: "Défenseur Droit",
        positionDom: "85%,18%",
        positionExt: "15%,78%",
      },
      // Double Pivot
      {
        name: "Milieu Défensif Gauche",
        positionDom: "38%,28%",
        positionExt: "62%,68%",
      },
      {
        name: "Milieu Défensif Droit",
        positionDom: "62%,28%",
        positionExt: "38%,68%",
      },
      // Ligne de 3 offensive
      {
        name: "Milieu Offensif Gauche",
        positionDom: "15%,38%",
        positionExt: "85%,58%",
      },
      {
        name: "Meneur de Jeu",
        positionDom: "50%,38%",
        positionExt: "50%,58%",
      },
      {
        name: "Milieu Offensif Droit",
        positionDom: "85%,38%",
        positionExt: "15%,58%",
      },
      {
        name: "Buteur",
        positionDom: "50%,46%",
        positionExt: "50%,52%",
      },
    ],
  },

  // 5. 4-4-2
  {
    id: 5,
    name: "4-4-2",
    postes: [
      {
        name: "Gardien",
        positionDom: "50%,6%",
        positionExt: "50%,88%",
      },
      {
        name: "Défenseur Gauche",
        positionDom: "15%,18%",
        positionExt: "85%,78%",
      },
      {
        name: "Défenseur Central Gauche",
        positionDom: "36%,18%",
        positionExt: "64%,78%",
      },
      {
        name: "Défenseur Central Droit",
        positionDom: "64%,18%",
        positionExt: "36%,78%",
      },
      {
        name: "Défenseur Droit",
        positionDom: "85%,18%",
        positionExt: "15%,78%",
      },
      // Milieu à plat (légèrement en arc pour l'esthétique)
      {
        name: "Milieu Gauche",
        positionDom: "15%,35%",
        positionExt: "85%,61%",
      },
      {
        name: "Milieu Central Gauche",
        positionDom: "38%,35%",
        positionExt: "62%,61%",
      },
      {
        name: "Milieu Central Droit",
        positionDom: "62%,35%",
        positionExt: "38%,61%",
      },
      {
        name: "Milieu Droit",
        positionDom: "85%,35%",
        positionExt: "15%,61%",
      },
      // Duo d'attaque
      {
        name: "Buteur Gauche",
        positionDom: "35%,45%",
        positionExt: "65%,53%",
      },
      {
        name: "Buteur Droit",
        positionDom: "65%,45%",
        positionExt: "35%,53%",
      },
    ],
  },

  // 6. 4-5-1
  {
    id: 6,
    name: "4-5-1",
    postes: [
      {
        name: "Gardien",
        positionDom: "50%,6%",
        positionExt: "50%,88%",
      },
      {
        name: "Défenseur Gauche",
        positionDom: "15%,18%",
        positionExt: "85%,78%",
      },
      {
        name: "Défenseur Central Gauche",
        positionDom: "36%,18%",
        positionExt: "64%,78%",
      },
      {
        name: "Défenseur Central Droit",
        positionDom: "64%,18%",
        positionExt: "36%,78%",
      },
      {
        name: "Défenseur Droit",
        positionDom: "85%,18%",
        positionExt: "15%,78%",
      },
      // Milieu à 5 (Légère forme en V pour ne pas chevaucher les textes)
      {
        name: "Milieu Gauche",
        positionDom: "10%,32%", // Très écarté
        positionExt: "90%,64%",
      },
      {
        name: "Milieu Central Gauche",
        positionDom: "30%,32%",
        positionExt: "70%,64%",
      },
      {
        name: "Milieu Sentinelle", // Le pointe basse du 5
        positionDom: "50%,28%",
        positionExt: "50%,68%",
      },
      {
        name: "Milieu Central Droit",
        positionDom: "70%,32%",
        positionExt: "30%,64%",
      },
      {
        name: "Milieu Droit",
        positionDom: "90%,32%",
        positionExt: "10%,64%",
      },
      {
        name: "Buteur",
        positionDom: "50%,45%",
        positionExt: "50%,53%",
      },
    ],
  },
];
