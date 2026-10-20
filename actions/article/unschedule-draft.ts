"use server";

import { scheduleBrouillon } from "@/controllers/DraftController";
import { FormResponse } from "@/types/forms";

const unscheduleDraftArticle = async (
  draftId: string
): Promise<FormResponse> => {
  try {
    const updated = await scheduleBrouillon(draftId, null);
    if (updated.length === 0) {
      return { success: false, message: "Brouillon introuvable" };
    }
    return { success: true, message: "Programmation annulée" };
  } catch (err) {
    console.error(err);
    return {
      success: false,
      message: "Erreur lors de l'annulation de la programmation",
    };
  }
};

export default unscheduleDraftArticle;
