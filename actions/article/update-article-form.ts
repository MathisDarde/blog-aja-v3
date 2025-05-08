"use server";

import { ArticleSchema } from "@/app/schema";
import { updateArticle } from "@/controllers/ArticlesController";
import { ArticleSchemaType, FormResponse } from "@/types/forms";

const updateArticleForm = async (
  articleId: string,
  data: ArticleSchemaType,
  file: File
): Promise<FormResponse> => {
  try {
    const parsedData = ArticleSchema.safeParse(data);

    if (!parsedData.success) {
      return { success: false, errors: parsedData.error.errors };
    }

    const registerArticle = await updateArticle(articleId, data, file);

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

export default updateArticleForm;
