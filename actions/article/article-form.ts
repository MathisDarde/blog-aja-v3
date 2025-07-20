"use server";

import { ArticleSchema } from "@/app/schema";
import { createArticle } from "@/controllers/ArticlesController";
import { ArticleSchemaType, FormResponse } from "@/types/forms";

const submitArticleForm = async (
  data: ArticleSchemaType,
  file: File,
  userId: string
): Promise<FormResponse> => {
  try {
    const parsedData = ArticleSchema.safeParse(data);

    if (!parsedData.success) {
      return { success: false, errors: parsedData.error.errors };
    }

    const registerArticle = await createArticle(data, file, userId);

    if (!registerArticle) {
      return {
        success: false,
        message: "Erreur lors de la création de l'article",
      };
    }

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
