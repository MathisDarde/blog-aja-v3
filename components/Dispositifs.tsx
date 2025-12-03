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
        positionDom: "85%,18%", // Inversé (était 15)
        positionExt: "15%,78%", // Inversé (était 85)
      },
      {
        name: "Défenseur Central Gauche",
        positionDom: "64%,18%",
        positionExt: "36%,78%",
      },
      {
        name: "Défenseur Central Droit",
        positionDom: "36%,18%",
        positionExt: "64%,78%",
      },
      {
        name: "Défenseur Droit",
        positionDom: "15%,18%",
        positionExt: "85%,78%",
      },
      {
        name: "Milieu Défensif",
        positionDom: "50%,28%",
        positionExt: "50%,68%",
      },
      {
        name: "Milieu Gauche",
        positionDom: "72%,36%",
        positionExt: "28%,60%",
      },
      {
        name: "Milieu Droit",
        positionDom: "28%,36%",
        positionExt: "72%,60%",
      },
      {
        name: "Ailier Gauche",
        positionDom: "85%,45%",
        positionExt: "15%,53%",
      },
      {
        name: "Buteur",
        positionDom: "50%,45%",
        positionExt: "50%,53%",
      },
      {
        name: "Ailier Droit",
        positionDom: "15%,45%",
        positionExt: "85%,53%",
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
        name: "Piston Gauche",
        positionDom: "90%,20%",
        positionExt: "10%,76%",
      },
      {
        name: "Défenseur Central Gauche",
        positionDom: "70%,18%",
        positionExt: "30%,78%",
      },
      {
        name: "Défenseur Central Axial",
        positionDom: "50%,18%",
        positionExt: "50%,78%",
      },
      {
        name: "Défenseur Central Droit",
        positionDom: "30%,18%",
        positionExt: "70%,78%",
      },
      {
        name: "Piston Droit",
        positionDom: "10%,20%",
        positionExt: "90%,76%",
      },
      {
        name: "Milieu Gauche",
        positionDom: "80%,35%",
        positionExt: "20%,61%",
      },
      {
        name: "Milieu Central Gauche",
        positionDom: "60%,35%",
        positionExt: "40%,61%",
      },
      {
        name: "Milieu Central Droit",
        positionDom: "40%,35%",
        positionExt: "60%,61%",
      },
      {
        name: "Milieu Droit",
        positionDom: "20%,35%",
        positionExt: "80%,61%",
      },
      {
        name: "Buteur",
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
        positionDom: "85%,18%",
        positionExt: "15%,78%",
      },
      {
        name: "Défenseur Central Gauche",
        positionDom: "64%,18%",
        positionExt: "36%,78%",
      },
      {
        name: "Défenseur Central Droit",
        positionDom: "36%,18%",
        positionExt: "64%,78%",
      },
      {
        name: "Défenseur Droit",
        positionDom: "15%,18%",
        positionExt: "85%,78%",
      },
      // Le triangle du milieu est inversé par rapport au défensif
      {
        name: "Milieu Relayeur Gauche",
        positionDom: "65%,30%",
        positionExt: "35%,66%",
      },
      {
        name: "Milieu Relayeur Droite",
        positionDom: "35%,30%",
        positionExt: "65%,66%",
      },
      {
        name: "Milieu Offensif Central",
        positionDom: "50%,38%",
        positionExt: "50%,58%",
      },
      {
        name: "Ailier Gauche",
        positionDom: "85%,45%",
        positionExt: "15%,53%",
      },
      {
        name: "Buteur",
        positionDom: "50%,45%",
        positionExt: "50%,53%",
      },
      {
        name: "Ailier Droit",
        positionDom: "15%,45%",
        positionExt: "85%,53%",
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
        positionDom: "85%,18%",
        positionExt: "15%,78%",
      },
      {
        name: "Défenseur Central Gauche",
        positionDom: "64%,18%",
        positionExt: "36%,78%",
      },
      {
        name: "Défenseur Central Droit",
        positionDom: "36%,18%",
        positionExt: "64%,78%",
      },
      {
        name: "Défenseur Droit",
        positionDom: "15%,18%",
        positionExt: "85%,78%",
      },
      // Double Pivot
      {
        name: "Milieu Défensif Gauche",
        positionDom: "62%,28%",
        positionExt: "38%,68%",
      },
      {
        name: "Milieu Défensif Droit",
        positionDom: "38%,28%",
        positionExt: "62%,68%",
      },
      // Ligne de 3 offensive
      {
        name: "Milieu Offensif Gauche",
        positionDom: "85%,38%",
        positionExt: "15%,58%",
      },
      {
        name: "Meneur de Jeu",
        positionDom: "50%,38%",
        positionExt: "50%,58%",
      },
      {
        name: "Milieu Offensif Droit",
        positionDom: "15%,38%",
        positionExt: "85%,58%",
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
        positionDom: "85%,18%",
        positionExt: "15%,78%",
      },
      {
        name: "Défenseur Central Gauche",
        positionDom: "64%,18%",
        positionExt: "36%,78%",
      },
      {
        name: "Défenseur Central Droit",
        positionDom: "36%,18%",
        positionExt: "64%,78%",
      },
      {
        name: "Défenseur Droit",
        positionDom: "15%,18%",
        positionExt: "85%,78%",
      },
      // Milieu à plat
      {
        name: "Milieu Gauche",
        positionDom: "85%,35%",
        positionExt: "15%,61%",
      },
      {
        name: "Milieu Central Gauche",
        positionDom: "62%,35%",
        positionExt: "38%,61%",
      },
      {
        name: "Milieu Central Droit",
        positionDom: "38%,35%",
        positionExt: "62%,61%",
      },
      {
        name: "Milieu Droit",
        positionDom: "15%,35%",
        positionExt: "85%,61%",
      },
      // Duo d'attaque
      {
        name: "Buteur Gauche",
        positionDom: "65%,45%",
        positionExt: "35%,53%",
      },
      {
        name: "Buteur Droit",
        positionDom: "35%,45%",
        positionExt: "65%,53%",
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
        positionDom: "85%,18%",
        positionExt: "15%,78%",
      },
      {
        name: "Défenseur Central Gauche",
        positionDom: "64%,18%",
        positionExt: "36%,78%",
      },
      {
        name: "Défenseur Central Droit",
        positionDom: "36%,18%",
        positionExt: "64%,78%",
      },
      {
        name: "Défenseur Droit",
        positionDom: "15%,18%",
        positionExt: "85%,78%",
      },
      // Milieu à 5
      {
        name: "Milieu Gauche",
        positionDom: "90%,32%",
        positionExt: "10%,64%",
      },
      {
        name: "Milieu Central Gauche",
        positionDom: "70%,32%",
        positionExt: "30%,64%",
      },
      {
        name: "Milieu Sentinelle",
        positionDom: "50%,28%",
        positionExt: "50%,68%",
      },
      {
        name: "Milieu Central Droit",
        positionDom: "30%,32%",
        positionExt: "70%,64%",
      },
      {
        name: "Milieu Droit",
        positionDom: "10%,32%",
        positionExt: "90%,64%",
      },
      {
        name: "Buteur",
        positionDom: "50%,45%",
        positionExt: "50%,53%",
      },
    ],
  },

  // 7. 4-1-4-1
  {
    id: 7,
    name: "4-1-4-1",
    postes: [
      {
        name: "Gardien",
        positionDom: "50%,6%",
        positionExt: "50%,88%",
      },
      {
        name: "Défenseur Gauche",
        positionDom: "85%,18%",
        positionExt: "15%,78%",
      },
      {
        name: "Défenseur Central Gauche",
        positionDom: "64%,18%",
        positionExt: "36%,78%",
      },
      {
        name: "Défenseur Central Droit",
        positionDom: "36%,18%",
        positionExt: "64%,78%",
      },
      {
        name: "Défenseur Droit",
        positionDom: "15%,18%",
        positionExt: "85%,78%",
      },
      // La sentinelle
      {
        name: "Milieu Défensif",
        positionDom: "50%,27%",
        positionExt: "50%,69%",
      },
      // La ligne de 4 milieux
      {
        name: "Milieu Gauche",
        positionDom: "85%,36%",
        positionExt: "15%,60%",
      },
      {
        name: "Milieu Relayeur Gauche",
        positionDom: "62%,36%",
        positionExt: "38%,60%",
      },
      {
        name: "Milieu Relayeur Droit",
        positionDom: "38%,36%",
        positionExt: "62%,60%",
      },
      {
        name: "Milieu Droit",
        positionDom: "15%,36%",
        positionExt: "85%,60%",
      },
      {
        name: "Buteur",
        positionDom: "50%,45%",
        positionExt: "50%,53%",
      },
    ],
  },

  // 8. 3-5-2
  {
    id: 8,
    name: "3-5-2",
    postes: [
      {
        name: "Gardien",
        positionDom: "50%,6%",
        positionExt: "50%,88%",
      },
      // 3 Défenseurs Centraux
      {
        name: "Défenseur Central Gauche",
        positionDom: "70%,18%",
        positionExt: "30%,78%",
      },
      {
        name: "Défenseur Central Axial",
        positionDom: "50%,18%",
        positionExt: "50%,78%",
      },
      {
        name: "Défenseur Central Droit",
        positionDom: "30%,18%",
        positionExt: "70%,78%",
      },
      // Milieu à 5
      {
        name: "Piston Gauche",
        positionDom: "90%,30%",
        positionExt: "10%,66%",
      },
      {
        name: "Milieu Relayeur Gauche",
        positionDom: "65%,32%",
        positionExt: "35%,64%",
      },
      {
        name: "Milieu Sentinelle",
        positionDom: "50%,26%",
        positionExt: "50%,70%",
      },
      {
        name: "Milieu Relayeur Droit",
        positionDom: "35%,32%",
        positionExt: "65%,64%",
      },
      {
        name: "Piston Droit",
        positionDom: "10%,30%",
        positionExt: "90%,66%",
      },
      // 2 Attaquants
      {
        name: "Buteur Gauche",
        positionDom: "60%,44%",
        positionExt: "40%,54%",
      },
      {
        name: "Buteur Droit",
        positionDom: "40%,44%",
        positionExt: "60%,54%",
      },
    ],
  },
];