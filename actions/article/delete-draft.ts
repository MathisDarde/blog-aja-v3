"use server";

import { deleteBrouillon } from "@/controllers/DraftController";
import { FormResponse } from "@/types/forms";

const deleteDraftArticle = async (draftId: string): Promise<FormResponse> => {
  try {
    const deleted = await deleteBrouillon(draftId);
    if (deleted.length === 0) {
      return { success: false, message: "Brouillon introuvable" };
    }
    return { success: true, message: "Brouillon supprimé" };
  } catch (err) {
    console.error(err);
    return {
      success: false,
      message: "Erreur lors de la suppression du brouillon",
    };
  }
};

export default deleteDraftArticle;
