"use server";

import { ArticleSchema } from "@/app/schema";
import { getArticleBySlug } from "@/controllers/ArticlesController";
import {
  scheduleBrouillon,
  storeBrouillon,
  updateBrouillon,
} from "@/controllers/DraftController";
import { requireAdmin } from "@/lib/auth-guard";
import { ArticleSchemaType, FormResponse } from "@/types/forms";

const scheduleDraftArticle = async (
  data: ArticleSchemaType,
  // Date ISO choisie dans le formulaire
  scheduledAt: string,
  // Brouillon existant, sinon un nouveau est créé
  draftId?: string
): Promise<FormResponse> => {
  try {
    const { id: userId } = await requireAdmin();

    const parsedData = ArticleSchema.safeParse(data);
    if (!parsedData.success) {
      return { success: false, errors: parsedData.error.errors };
    }

    const date = new Date(scheduledAt);
    if (Number.isNaN(date.getTime())) {
      return { success: false, message: "Date de publication invalide" };
    }
    if (date.getTime() <= Date.now()) {
      return {
        success: false,
        message: "La date de publication doit être dans le futur",
      };
    }

    if (await getArticleBySlug(parsedData.data.slug)) {
      return {
        success: false,
        message: "Un article publié utilise déjà ce slug",
      };
    }

    let id = draftId;
    if (id) {
      await updateBrouillon(id, parsedData.data);
    } else {
      id = await storeBrouillon(parsedData.data, userId);
    }

    const scheduled = await scheduleBrouillon(id, date);
    if (scheduled.length === 0) {
      return { success: false, message: "Brouillon introuvable" };
    }

    return { success: true, message: "Publication programmée" };
  } catch (err) {
    console.error(err);
    return {
      success: false,
      message: "Erreur lors de la programmation de l'article",
    };
  }
};

export default scheduleDraftArticle;
