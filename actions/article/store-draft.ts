"use server";

import { DraftArticleSchema } from "@/app/schema";
import { storeBrouillon } from "@/controllers/ArticlesController";
import { DraftArticleSchemaType, FormResponse } from "@/types/forms";

const storeDraftArticle = async (
  data: DraftArticleSchemaType,
  userId: string,
  file?: File
): Promise<FormResponse> => {
  try {
    const parsedData = DraftArticleSchema.safeParse(data);

    if (!parsedData.success) {
      return { success: false, errors: parsedData.error.errors };
    }

    const registerArticle = await storeBrouillon(data, userId, file);

    if (!registerArticle) {
      return {
        success: false,
        message: "Erreur lors de la sauvegarde du brouillon",
      };
    }

    return { success: true, message: "Article sauvegardé avec succès" };
  } catch (err) {
    console.log(err);
    return {
      success: false,
      message: "Erreur lors de la la sauvegarde du brouillon",
    };
  }
};

export default storeDraftArticle;
