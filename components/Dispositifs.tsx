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
        demiTerrain: "50%,90%",
      },
      // Défense en arc de cercle pour éviter la ligne droite
      {
        name: "Défenseur Gauche",
        positionDom: "88%,15%",
        positionExt: "12%,80%",
        demiTerrain: "12%,80%",
      },
      {
        name: "Défenseur Central Gauche",
        positionDom: "62%,13%", // Légèrement plus haut/bas que les latéraux
        positionExt: "38%,82%",
        demiTerrain: "38%,82%",
      },
      {
        name: "Défenseur Central Droit",
        positionDom: "38%,13%",
        positionExt: "62%,82%",
        demiTerrain: "62%,82%",
      },
      {
        name: "Défenseur Droit",
        positionDom: "12%,15%",
        positionExt: "88%,80%",
        demiTerrain: "88%,80%",
      },
      // Milieu
      {
        name: "Milieu Défensif",
        positionDom: "50%,24%",
        positionExt: "50%,71%",
        demiTerrain: "50%,71%",
      },
      {
        name: "Milieu Gauche",
        positionDom: "75%,32%", // Écarté pour laisser place au MDC
        positionExt: "25%,63%",
        demiTerrain: "25%,63%",
      },
      {
        name: "Milieu Droit",
        positionDom: "25%,32%",
        positionExt: "75%,63%",
        demiTerrain: "75%,63%",
      },
      // Attaque (Reculée pour ne pas toucher le rond central)
      {
        name: "Ailier Gauche",
        positionDom: "85%,41%",
        positionExt: "15%,54%",
        demiTerrain: "15%,54%",
      },
      {
        name: "Buteur",
        positionDom: "50%,40%",
        positionExt: "50%,55%",
        demiTerrain: "50%,55%",
      },
      {
        name: "Ailier Droit",
        positionDom: "15%,41%",
        positionExt: "85%,54%",
        demiTerrain: "85%,54%",
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
        demiTerrain: "50%,5%",
      },
      // Pistons très écartés
      {
        name: "Piston Gauche",
        positionDom: "92%,18%",
        positionExt: "8%,77%",
        demiTerrain: "92%,18%",
      },
      {
        name: "Défenseur Central Gauche",
        positionDom: "70%,14%",
        positionExt: "30%,81%",
        demiTerrain: "70%,14%",
      },
      {
        name: "Défenseur Central Axial",
        positionDom: "50%,12%", // Le libéro couvre un peu derrière
        positionExt: "50%,83%",
        demiTerrain: "50%,12%",
      },
      {
        name: "Défenseur Central Droit",
        positionDom: "30%,14%",
        positionExt: "70%,81%",
        demiTerrain: "30%,14%",
      },
      {
        name: "Piston Droit",
        positionDom: "8%,18%",
        positionExt: "92%,77%",
        demiTerrain: "8%,18%",
      },
      // Milieu compact mais en arc
      {
        name: "Milieu Gauche",
        positionDom: "82%,30%",
        positionExt: "18%,65%",
        demiTerrain: "82%,30%",
      },
      {
        name: "Milieu Central Gauche",
        positionDom: "60%,28%",
        positionExt: "40%,67%",
        demiTerrain: "60%,28%",
      },
      {
        name: "Milieu Central Droit",
        positionDom: "40%,28%",
        positionExt: "60%,67%",
        demiTerrain: "40%,28%",
      },
      {
        name: "Milieu Droit",
        positionDom: "18%,30%",
        positionExt: "82%,65%",
        demiTerrain: "18%,30%",
      },
      {
        name: "Buteur",
        positionDom: "50%,40%",
        positionExt: "50%,55%",
        demiTerrain: "50%,40%",
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
        demiTerrain: "50%,7%",
      },
      {
        name: "Défenseur Gauche",
        positionDom: "88%,19%",
        positionExt: "12%,81%",
        demiTerrain: "88%,19%",
      },
      {
        name: "Défenseur Central Gauche",
        positionDom: "62%,17%",
        positionExt: "38%,83%",
        demiTerrain: "62%,17%",
      },
      {
        name: "Défenseur Central Droit",
        positionDom: "38%,17%",
        positionExt: "62%,83%",
        demiTerrain: "38%,17%",
      },
      {
        name: "Défenseur Droit",
        positionDom: "12%,19%",
        positionExt: "88%,81%",
        demiTerrain: "12%,19%",
      },
      // Milieu Triangle inversé
      {
        name: "Milieu Relayeur Gauche",
        positionDom: "68%,28%",
        positionExt: "33%,71%",
        demiTerrain: "68%,28%",
      },
      {
        name: "Milieu Relayeur Droite",
        positionDom: "32%,28%",
        positionExt: "67%,71%",
        demiTerrain: "32%,28%",
      },
      {
        name: "Milieu Offensif Central",
        positionDom: "50%,35%",
        positionExt: "50%,65%",
        demiTerrain: "50%,35%",
      },
      // Attaque
      {
        name: "Ailier Gauche",
        positionDom: "88%,43%",
        positionExt: "12%,57%",
        demiTerrain: "88%,43%",
      },
      {
        name: "Buteur",
        positionDom: "50%,45%",
        positionExt: "50%,55%",
        demiTerrain: "50%,45%",
      },
      {
        name: "Ailier Droit",
        positionDom: "12%,43%",
        positionExt: "88%,57%",
        demiTerrain: "12%,43%",
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
        demiTerrain: "50%,6%",
      },
      {
        name: "Défenseur Gauche",
        positionDom: "88%,16%",
        positionExt: "12%,84%",
        demiTerrain: "88%,16%",
      },
      {
        name: "Défenseur Central Gauche",
        positionDom: "64%,15%",
        positionExt: "36%,85%",
        demiTerrain: "64%,15%",
      },
      {
        name: "Défenseur Central Droit",
        positionDom: "36%,15%",
        positionExt: "64%,85%",
        demiTerrain: "36%,15%",
      },
      {
        name: "Défenseur Droit",
        positionDom: "12%,16%",
        positionExt: "88%,84%",
        demiTerrain: "12%,16%",
      },
      // Double Pivot
      {
        name: "Milieu Défensif Gauche",
        positionDom: "67%,26%",
        positionExt: "33%,74%",
        demiTerrain: "67%,26%",
      },
      {
        name: "Milieu Défensif Droit",
        positionDom: "33%,26%",
        positionExt: "67%,74%",
        demiTerrain: "33%,26%",
      },
      // Ligne de 3 offensive (Le coeur du problème habituellement)
      {
        name: "Milieu Offensif Gauche",
        positionDom: "88%,34%",
        positionExt: "12%,66%",
        demiTerrain: "88%,34%",
      },
      {
        name: "Meneur de Jeu",
        positionDom: "50%,34%",
        positionExt: "50%,66%",
        demiTerrain: "50%,34%",
      },
      {
        name: "Milieu Offensif Droit",
        positionDom: "12%,34%",
        positionExt: "88%,66%",
        demiTerrain: "12%,34%",
      },
      {
        name: "Buteur",
        positionDom: "50%,44%",
        positionExt: "50%,56%",
        demiTerrain: "50%,44%",
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
        positionExt: "50%,94%",
        demiTerrain: "50%,6%",
      },
      {
        name: "Défenseur Gauche",
        positionDom: "88%,18%",
        positionExt: "12%,81%",
        demiTerrain: "88%,18%",
      },
      {
        name: "Défenseur Central Gauche",
        positionDom: "62%,17%",
        positionExt: "38%,83%",
        demiTerrain: "62%,17%",
      },
      {
        name: "Défenseur Central Droit",
        positionDom: "38%,17%",
        positionExt: "62%,83%",
        demiTerrain: "38%,17%",
      },
      {
        name: "Défenseur Droit",
        positionDom: "12%,18%",
        positionExt: "88%,81%",
        demiTerrain: "12%,18%",
      },
      // Milieu à plat (en forme de U léger)
      {
        name: "Milieu Gauche",
        positionDom: "88%,32%",
        positionExt: "12%,68%",
        demiTerrain: "88%,32%",
      },
      {
        name: "Milieu Central Gauche",
        positionDom: "62%,30%",
        positionExt: "38%,70%",
        demiTerrain: "62%,30%",
      },
      {
        name: "Milieu Central Droit",
        positionDom: "38%,30%",
        positionExt: "62%,70%",
        demiTerrain: "38%,30%",
      },
      {
        name: "Milieu Droit",
        positionDom: "12%,32%",
        positionExt: "88%,68%",
        demiTerrain: "12%,32%",
      },
      // Duo d'attaque (Rapprochés mais pas trop)
      {
        name: "Buteur Gauche",
        positionDom: "63%,43%",
        positionExt: "38%,58%",
        demiTerrain: "63%,43%",
      },
      {
        name: "Buteur Droit",
        positionDom: "37%,43%",
        positionExt: "62%,58%",
        demiTerrain: "37%,43%",
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
        positionExt: "50%,94%",
        demiTerrain: "50%,12%",
      },
      {
        name: "Défenseur Gauche",
        positionDom: "88%,15%",
        positionExt: "12%,83%",
        demiTerrain: "88%,32%",
      },
      {
        name: "Défenseur Central Gauche",
        positionDom: "62%,13%",
        positionExt: "35%,85%",
        demiTerrain: "65%,30%",
      },
      {
        name: "Défenseur Central Droit",
        positionDom: "38%,13%",
        positionExt: "65%,85%",
        demiTerrain: "35%,30%",
      },
      {
        name: "Défenseur Droit",
        positionDom: "12%,15%",
        positionExt: "88%,83%",
        demiTerrain: "12%,32%",
      },
      // La sentinelle
      {
        name: "Milieu Défensif",
        positionDom: "50%,24%",
        positionExt: "50%,76%",
        demiTerrain: "50%,50%",
      },
      // La ligne de 4 milieux (Arc pour éviter superposition avec MDC)
      {
        name: "Milieu Gauche",
        positionDom: "90%,33%",
        positionExt: "12%,65%",
        demiTerrain: "90%,65%",
      },
      {
        name: "Milieu Relayeur Gauche",
        positionDom: "65%,31%",
        positionExt: "35%,66%",
        demiTerrain: "65%,66%",
      },
      {
        name: "Milieu Relayeur Droit",
        positionDom: "35%,31%",
        positionExt: "65%,66%",
        demiTerrain: "35%,66%",
      },
      {
        name: "Milieu Droit",
        positionDom: "10%,33%",
        positionExt: "90%,65%",
        demiTerrain: "10%,65%",
      },
      {
        name: "Buteur",
        positionDom: "50%,42%",
        positionExt: "50%,56%",
        demiTerrain: "50%,85%",
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
        demiTerrain: "50%,5%",
      },
      // 3 Défenseurs Centraux
      {
        name: "Défenseur Central Gauche",
        positionDom: "75%,14%",
        positionExt: "25%,81%",
        demiTerrain: "75%,14%",
      },
      {
        name: "Défenseur Central Axial",
        positionDom: "50%,12%",
        positionExt: "50%,83%",
        demiTerrain: "50%,12%",
      },
      {
        name: "Défenseur Central Droit",
        positionDom: "25%,14%",
        positionExt: "75%,81%",
        demiTerrain: "25%,14%",
      },
      // Milieu à 5
      {
        name: "Piston Gauche",
        positionDom: "92%,25%",
        positionExt: "8%,70%",
        demiTerrain: "92%,25%",
      },
      {
        name: "Milieu Relayeur Gauche",
        positionDom: "65%,30%",
        positionExt: "35%,65%",
        demiTerrain: "65%,30%",
      },
      {
        name: "Milieu Sentinelle",
        positionDom: "50%,22%",
        positionExt: "50%,73%",
        demiTerrain: "50%,22%",
      },
      {
        name: "Milieu Relayeur Droit",
        positionDom: "35%,30%",
        positionExt: "65%,65%",
        demiTerrain: "35%,30%",
      },
      {
        name: "Piston Droit",
        positionDom: "8%,25%",
        positionExt: "92%,70%",
        demiTerrain: "8%,25%",
      },
      // 2 Attaquants
      {
        name: "Buteur Gauche",
        positionDom: "60%,40%",
        positionExt: "40%,55%",
        demiTerrain: "60%,40%",
      },
      {
        name: "Buteur Droit",
        positionDom: "40%,40%",
        positionExt: "60%,55%",
        demiTerrain: "40%,40%",
      },
    ],
  },
  // 9. 4-5-1 (Bloc dense au milieu)
  {
    id: 9,
    name: "4-5-1",
    postes: [
      {
        name: "Gardien",
        positionDom: "50%,6%",
        positionExt: "50%,90%",
        demiTerrain: "50%,6%",
      },
      // 4 Défenseurs
      {
        name: "Latéral Gauche",
        positionDom: "90%,17%",
        positionExt: "10%,80%",
        demiTerrain: "90%,17%",
      },
      {
        name: "Défenseur Central Gauche",
        positionDom: "65%,16%",
        positionExt: "35%,81%",
        demiTerrain: "65%,16%",
      },
      {
        name: "Défenseur Central Droit",
        positionDom: "35%,16%",
        positionExt: "65%,81%",
        demiTerrain: "35%,16%",
      },
      {
        name: "Latéral Droit",
        positionDom: "10%,17%",
        positionExt: "90%,80%",
        demiTerrain: "10%,17%",
      },
      // 5 Milieux (V à l'envers ou à plat, ici config milieu à 3 axiaux + ailiers bas)
      {
        name: "Milieu Gauche",
        positionDom: "90%,30%",
        positionExt: "10%,65%",
        demiTerrain: "90%,30%",
      },
      {
        name: "Milieu Relayeur Gauche",
        positionDom: "65%,34%",
        positionExt: "40%,70%",
        demiTerrain: "65%,34%",
      },
      {
        name: "Milieu Sentinelle", // Axial
        positionDom: "50%,25%",
        positionExt: "50%,73%",
        demiTerrain: "50%,25%",
      },
      {
        name: "Milieu Relayeur Droit",
        positionDom: "35%,34%",
        positionExt: "60%,70%",
        demiTerrain: "35%,34%",
      },
      {
        name: "Milieu Droit",
        positionDom: "10%,30%",
        positionExt: "90%,65%",
        demiTerrain: "10%,30%",
      },
      // 1 Attaquant
      {
        name: "Buteur",
        positionDom: "50%,44%",
        positionExt: "50%,55%",
        demiTerrain: "50%,44%",
      },
    ],
  },

  // 10. 4-4-1-1 (Avec un 9 et demi)
  {
    id: 10,
    name: "4-4-1-1",
    postes: [
      {
        name: "Gardien",
        positionDom: "50%,5%",
        positionExt: "50%,94%",
        demiTerrain: "50%,5%",
      },
      // 4 Défenseurs
      {
        name: "Latéral Gauche",
        positionDom: "90%,15%",
        positionExt: "10%,82%",
        demiTerrain: "90%,15%",
      },
      {
        name: "Défenseur Central Gauche",
        positionDom: "65%,14%",
        positionExt: "35%,84%",
        demiTerrain: "65%,14%",
      },
      {
        name: "Défenseur Central Droit",
        positionDom: "35%,14%",
        positionExt: "65%,84%",
        demiTerrain: "35%,14%",
      },
      {
        name: "Latéral Droit",
        positionDom: "10%,15%",
        positionExt: "90%,82%",
        demiTerrain: "10%,15%",
      },
      // 4 Milieux à plat
      {
        name: "Milieu Gauche",
        positionDom: "90%,28%",
        positionExt: "10%,71%",
        demiTerrain: "90%,28%",
      },
      {
        name: "Milieu Central Gauche",
        positionDom: "60%,25%",
        positionExt: "35%,73%",
        demiTerrain: "60%,25%",
      },
      {
        name: "Milieu Central Droit",
        positionDom: "40%,25%",
        positionExt: "65%,73%",
        demiTerrain: "40%,25%",
      },
      {
        name: "Milieu Droit",
        positionDom: "10%,28%",
        positionExt: "90%,71%",
        demiTerrain: "10%,28%",
      },
      // 1 Attaquant de soutien (Meneur ou 9.5)
      {
        name: "Attaquant de Soutien",
        positionDom: "50%,34%",
        positionExt: "50%,65%",
        demiTerrain: "50%,34%",
      },
      // 1 Buteur
      {
        name: "Buteur",
        positionDom: "50%,42%",
        positionExt: "50%,55%",
        demiTerrain: "50%,42%",
      },
    ],
  },
];
