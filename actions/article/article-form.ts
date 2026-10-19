"use server";

import { ArticleSchema } from "@/app/schema";
import { createArticle } from "@/controllers/ArticlesController";
import { deleteBrouillon } from "@/controllers/DraftController";
import { ArticleSchemaType, FormResponse } from "@/types/forms";

const submitArticleForm = async (
  data: ArticleSchemaType,
  userId: string,
  // Brouillon d'origine, supprimé une fois l'article publié
  draftId?: string
): Promise<FormResponse> => {
  try {
    const parsedData = ArticleSchema.safeParse(data);

    if (!parsedData.success) {
      return { success: false, errors: parsedData.error.errors };
    }

    const registerArticle = await createArticle(data, userId);

    if (!registerArticle) {
      return {
        success: false,
        message: "Erreur lors de la création de l'article",
      };
    }

    if (draftId) await deleteBrouillon(draftId);

    return { success: true, message: "Article créé avec succès" };
  } catch (err) {
    console.error(err);
    return {
      success: false,
      message: "Erreur lors de la création de l'article",
    };
  }
};

export default submitArticleForm;
