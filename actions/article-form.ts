"use server";

import { ArticleSchema } from "@/app/schema";
import ArticleController from "@/controllers/ArticleController";
import { ArticleSchemaType, FormResponse } from "@/types/forms";

const submitArticleForm = async (
  data: ArticleSchemaType,
  file: File
): Promise<FormResponse> => {
  try {
    const parsedData = ArticleSchema.safeParse(data);

    if (!parsedData.success) {
      return { success: false, errors: parsedData.error.errors };
    }

    const registerArticle = await ArticleController.store(data, file);
    if (!registerArticle) {
      return {
        success: false,
        message: "Erreur lors de la création de l'article",
      };
    }

    return { success: true, message: "Article créé avec succès" };
  } catch (err) {
    console.log(err);
    return {
      success: false,
      message: "Erreur lors de la création de l'article",
    };
  }
};

export default submitArticleForm;
