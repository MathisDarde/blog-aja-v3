"use server";

import { DraftArticleSchema } from "@/app/schema";
import { updateBrouillon } from "@/controllers/ArticlesController";
import { DraftArticleSchemaType, FormResponse } from "@/types/forms";

const updateBrouillonForm = async (
  articleId: string,
  data: DraftArticleSchemaType,
  file?: File
): Promise<FormResponse> => {
  try {
    const parsedData = DraftArticleSchema.safeParse(data);

    if (!parsedData.success) {
      return { success: false, errors: parsedData.error.errors };
    }

    const registerArticle = await updateBrouillon(articleId, data, file);

    if (!registerArticle) {
      return {
        success: false,
        message: "Erreur lors de la modification de l'article",
      };
    }

    return { success: true, message: "Article modifié avec succès" };
  } catch (err) {
    console.log(err);
    return {
      success: false,
      message: "Erreur lors de la modification de l'article",
    };
  }
};

export default updateBrouillonForm;
