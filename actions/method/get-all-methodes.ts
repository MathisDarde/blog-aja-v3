"use server";

import { getCoachMethodes } from "@/controllers/MethodeCoachController";
import { getJoueurMethodes } from "@/controllers/MethodeJoueurController";
import { getMatchMethodes } from "@/controllers/MethodeMatchController";
import { getSaisonMethodes } from "@/controllers/MethodeSaisonController";

const getAllMethodes = async () => {
  try {
    const [coach, joueur, match, saison] = await Promise.all([
      getCoachMethodes(),
      getJoueurMethodes(),
      getMatchMethodes(),
      getSaisonMethodes(),
    ]);

    return [...coach, ...joueur, ...match, ...saison];
  } catch (error) {
    console.error("Erreur lors de la récupération de la méthode :", error);
    return null;
  }
};

export default getAllMethodes;
