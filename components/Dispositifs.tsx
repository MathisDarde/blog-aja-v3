export const Dispositifs = [
  // 1. 4-3-3 défensif
  {
    id: 1,
    name: "4-3-3 Défensif",
    postes: [
      {
        name: "Gardien",
        positionDom: "50%,5%",
        positionExt: "50%,90%",
      },
      // Défense en arc de cercle pour éviter la ligne droite
      {
        name: "Défenseur Gauche",
        positionDom: "88%,15%",
        positionExt: "12%,80%",
      },
      {
        name: "Défenseur Central Gauche",
        positionDom: "62%,13%", // Légèrement plus haut/bas que les latéraux
        positionExt: "38%,82%",
      },
      {
        name: "Défenseur Central Droit",
        positionDom: "38%,13%",
        positionExt: "62%,82%",
      },
      {
        name: "Défenseur Droit",
        positionDom: "12%,15%",
        positionExt: "88%,80%",
      },
      // Milieu
      {
        name: "Milieu Défensif",
        positionDom: "50%,24%",
        positionExt: "50%,71%",
      },
      {
        name: "Milieu Gauche",
        positionDom: "75%,32%", // Écarté pour laisser place au MDC
        positionExt: "25%,63%",
      },
      {
        name: "Milieu Droit",
        positionDom: "25%,32%",
        positionExt: "75%,63%",
      },
      // Attaque (Reculée pour ne pas toucher le rond central)
      {
        name: "Ailier Gauche",
        positionDom: "85%,41%",
        positionExt: "15%,54%",
      },
      {
        name: "Buteur",
        positionDom: "50%,40%",
        positionExt: "50%,55%",
      },
      {
        name: "Ailier Droit",
        positionDom: "15%,41%",
        positionExt: "85%,54%",
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
        positionDom: "50%,5%",
        positionExt: "50%,90%",
      },
      // Pistons très écartés
      {
        name: "Piston Gauche",
        positionDom: "92%,18%",
        positionExt: "8%,77%",
      },
      {
        name: "Défenseur Central Gauche",
        positionDom: "70%,14%",
        positionExt: "30%,81%",
      },
      {
        name: "Défenseur Central Axial",
        positionDom: "50%,12%", // Le libéro couvre un peu derrière
        positionExt: "50%,83%",
      },
      {
        name: "Défenseur Central Droit",
        positionDom: "30%,14%",
        positionExt: "70%,81%",
      },
      {
        name: "Piston Droit",
        positionDom: "8%,18%",
        positionExt: "92%,77%",
      },
      // Milieu compact mais en arc
      {
        name: "Milieu Gauche",
        positionDom: "82%,30%",
        positionExt: "18%,65%",
      },
      {
        name: "Milieu Central Gauche",
        positionDom: "60%,28%",
        positionExt: "40%,67%",
      },
      {
        name: "Milieu Central Droit",
        positionDom: "40%,28%",
        positionExt: "60%,67%",
      },
      {
        name: "Milieu Droit",
        positionDom: "18%,30%",
        positionExt: "82%,65%",
      },
      {
        name: "Buteur",
        positionDom: "50%,40%",
        positionExt: "50%,55%",
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
        positionDom: "50%,7%",
        positionExt: "50%,93%",
      },
      {
        name: "Défenseur Gauche",
        positionDom: "88%,19%",
        positionExt: "12%,81%",
      },
      {
        name: "Défenseur Central Gauche",
        positionDom: "62%,17%",
        positionExt: "38%,83%",
      },
      {
        name: "Défenseur Central Droit",
        positionDom: "38%,17%",
        positionExt: "62%,83%",
      },
      {
        name: "Défenseur Droit",
        positionDom: "12%,19%",
        positionExt: "88%,81%",
      },
      // Milieu Triangle inversé
      {
        name: "Milieu Relayeur Gauche",
        positionDom: "68%,28%",
        positionExt: "33%,71%",
      },
      {
        name: "Milieu Relayeur Droite",
        positionDom: "32%,28%",
        positionExt: "67%,71%",
      },
      {
        name: "Milieu Offensif Central",
        positionDom: "50%,35%", // Le 10
        positionExt: "50%,65%",
      },
      // Attaque
      {
        name: "Ailier Gauche",
        positionDom: "88%,43%",
        positionExt: "12%,57%",
      },
      {
        name: "Buteur",
        positionDom: "50%,45%",
        positionExt: "50%,55%",
      },
      {
        name: "Ailier Droit",
        positionDom: "12%,43%",
        positionExt: "88%,57%",
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
        positionExt: "50%,94%",
      },
      {
        name: "Défenseur Gauche",
        positionDom: "88%,16%",
        positionExt: "12%,84%",
      },
      {
        name: "Défenseur Central Gauche",
        positionDom: "64%,15%",
        positionExt: "36%,85%",
      },
      {
        name: "Défenseur Central Droit",
        positionDom: "36%,15%",
        positionExt: "64%,85%",
      },
      {
        name: "Défenseur Droit",
        positionDom: "12%,16%",
        positionExt: "88%,84%",
      },
      // Double Pivot
      {
        name: "Milieu Défensif Gauche",
        positionDom: "67%,26%",
        positionExt: "33%,74%",
      },
      {
        name: "Milieu Défensif Droit",
        positionDom: "33%,26%",
        positionExt: "67%,74%",
      },
      // Ligne de 3 offensive (Le coeur du problème habituellement)
      {
        name: "Milieu Offensif Gauche",
        positionDom: "88%,34%", // Très écarté
        positionExt: "12%,66%",
      },
      {
        name: "Meneur de Jeu",
        positionDom: "50%,34%", // Un peu plus bas que les ailiers pour faire un V
        positionExt: "50%,66%",
      },
      {
        name: "Milieu Offensif Droit",
        positionDom: "12%,34%", // Très écarté
        positionExt: "88%,66%",
      },
      {
        name: "Buteur",
        positionDom: "50%,44%",
        positionExt: "50%,56%",
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
        positionDom: "50%,5%",
        positionExt: "50%,90%",
      },
      {
        name: "Défenseur Gauche",
        positionDom: "88%,15%",
        positionExt: "12%,80%",
      },
      {
        name: "Défenseur Central Gauche",
        positionDom: "62%,13%",
        positionExt: "38%,82%",
      },
      {
        name: "Défenseur Central Droit",
        positionDom: "38%,13%",
        positionExt: "62%,82%",
      },
      {
        name: "Défenseur Droit",
        positionDom: "12%,15%",
        positionExt: "88%,80%",
      },
      // Milieu à plat (en forme de U léger)
      {
        name: "Milieu Gauche",
        positionDom: "90%,30%",
        positionExt: "10%,65%",
      },
      {
        name: "Milieu Central Gauche",
        positionDom: "60%,28%",
        positionExt: "40%,67%",
      },
      {
        name: "Milieu Central Droit",
        positionDom: "40%,28%",
        positionExt: "60%,67%",
      },
      {
        name: "Milieu Droit",
        positionDom: "10%,30%",
        positionExt: "90%,65%",
      },
      // Duo d'attaque (Rapprochés mais pas trop)
      {
        name: "Buteur Gauche",
        positionDom: "60%,40%",
        positionExt: "40%,55%",
      },
      {
        name: "Buteur Droit",
        positionDom: "40%,40%",
        positionExt: "60%,55%",
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
        positionDom: "50%,5%",
        positionExt: "50%,90%",
      },
      {
        name: "Défenseur Gauche",
        positionDom: "88%,15%",
        positionExt: "12%,80%",
      },
      {
        name: "Défenseur Central Gauche",
        positionDom: "62%,13%",
        positionExt: "38%,82%",
      },
      {
        name: "Défenseur Central Droit",
        positionDom: "38%,13%",
        positionExt: "62%,82%",
      },
      {
        name: "Défenseur Droit",
        positionDom: "12%,15%",
        positionExt: "88%,80%",
      },
      // Milieu à 5 très dense -> il faut utiliser toute la largeur
      {
        name: "Milieu Gauche",
        positionDom: "92%,28%",
        positionExt: "8%,67%",
      },
      {
        name: "Milieu Central Gauche",
        positionDom: "70%,30%",
        positionExt: "30%,65%",
      },
      {
        name: "Milieu Sentinelle",
        positionDom: "50%,25%", // En retrait
        positionExt: "50%,70%",
      },
      {
        name: "Milieu Central Droit",
        positionDom: "30%,30%",
        positionExt: "70%,65%",
      },
      {
        name: "Milieu Droit",
        positionDom: "8%,28%",
        positionExt: "92%,67%",
      },
      {
        name: "Buteur",
        positionDom: "50%,41%",
        positionExt: "50%,54%",
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
        positionDom: "50%,5%",
        positionExt: "50%,90%",
      },
      {
        name: "Défenseur Gauche",
        positionDom: "88%,15%",
        positionExt: "12%,80%",
      },
      {
        name: "Défenseur Central Gauche",
        positionDom: "62%,13%",
        positionExt: "38%,82%",
      },
      {
        name: "Défenseur Central Droit",
        positionDom: "38%,13%",
        positionExt: "62%,82%",
      },
      {
        name: "Défenseur Droit",
        positionDom: "12%,15%",
        positionExt: "88%,80%",
      },
      // La sentinelle
      {
        name: "Milieu Défensif",
        positionDom: "50%,24%",
        positionExt: "50%,71%",
      },
      // La ligne de 4 milieux (Arc pour éviter superposition avec MDC)
      {
        name: "Milieu Gauche",
        positionDom: "90%,33%",
        positionExt: "10%,62%",
      },
      {
        name: "Milieu Relayeur Gauche",
        positionDom: "65%,31%",
        positionExt: "35%,64%",
      },
      {
        name: "Milieu Relayeur Droit",
        positionDom: "35%,31%",
        positionExt: "65%,64%",
      },
      {
        name: "Milieu Droit",
        positionDom: "10%,33%",
        positionExt: "90%,62%",
      },
      {
        name: "Buteur",
        positionDom: "50%,42%",
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
        positionDom: "50%,5%",
        positionExt: "50%,90%",
      },
      // 3 Défenseurs Centraux
      {
        name: "Défenseur Central Gauche",
        positionDom: "75%,14%",
        positionExt: "25%,81%",
      },
      {
        name: "Défenseur Central Axial",
        positionDom: "50%,12%",
        positionExt: "50%,83%",
      },
      {
        name: "Défenseur Central Droit",
        positionDom: "25%,14%",
        positionExt: "75%,81%",
      },
      // Milieu à 5
      {
        name: "Piston Gauche",
        positionDom: "92%,25%",
        positionExt: "8%,70%",
      },
      {
        name: "Milieu Relayeur Gauche",
        positionDom: "65%,30%",
        positionExt: "35%,65%",
      },
      {
        name: "Milieu Sentinelle",
        positionDom: "50%,22%", // Très bas
        positionExt: "50%,73%",
      },
      {
        name: "Milieu Relayeur Droit",
        positionDom: "35%,30%",
        positionExt: "65%,65%",
      },
      {
        name: "Piston Droit",
        positionDom: "8%,25%",
        positionExt: "92%,70%",
      },
      // 2 Attaquants
      {
        name: "Buteur Gauche",
        positionDom: "60%,40%",
        positionExt: "40%,55%",
      },
      {
        name: "Buteur Droit",
        positionDom: "40%,40%",
        positionExt: "60%,55%",
      },
    ],
  },
];
