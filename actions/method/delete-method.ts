"use server";

import { deleteMethodeCoach } from "@/controllers/MethodeCoachController";
import { deleteMethodeJoueur } from "@/controllers/MethodeJoueurController";
import { deleteMethodeMatch } from "@/controllers/MethodeMatchController";
import { deleteMethodeSaison } from "@/controllers/MethodeSaisonController";

const deleteMethode = async (
  id: string
): Promise<{ success: boolean; message?: string }> => {
  try {
    const results: { success: boolean }[] = await Promise.all([
      deleteMethodeCoach(id),
      deleteMethodeJoueur(id),
      deleteMethodeMatch(id),
      deleteMethodeSaison(id),
    ]);

    const found = results.find((res) => res && res.success === true);

    if (found) {
      return { success: true };
    } else {
      return {
        success: false,
        message: "Méthode introuvable dans les 4 types.",
      };
    }
  } catch (error) {
    console.error("Erreur lors de la suppression de la méthode :", error);
    return {
      success: false,
      message: "Erreur interne lors de la suppression.",
    };
  }
};

export default deleteMethode;
