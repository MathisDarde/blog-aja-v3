"use server";

import { UpdateArticleSchema } from "@/app/schema";
import { Article } from "@/contexts/Interfaces";
import { updateArticle, updateStatus } from "@/controllers/ArticlesController";
import { FormResponse, UpdateArticleSchemaType } from "@/types/forms";

const updateArticleForm = async (
  articleId: string,
  data: UpdateArticleSchemaType
): Promise<FormResponse> => {
  try {
    const parsedData = UpdateArticleSchema.safeParse(data);

    if (!parsedData.success) {
      return { success: false, errors: parsedData.error.errors };
    }

    const validStates = ["pending", "published", "archived"] as const;
    const state = validStates.includes(
      data.state as "pending" | "published" | "archived"
    )
      ? (data.state as (typeof validStates)[number])
      : "pending";

    const registerArticle = await updateArticle(articleId, {
      ...(data as Article),
      state,
    });

    await updateStatus(articleId, "published");

    if (!registerArticle) {
      return {
        success: false,
        message: "Erreur lors de la modification de l'article",
      };
    }

    return { success: true, message: "Article modifié avec succès" };
  } catch (err) {
    console.error(err);
    return {
      success: false,
      message: "Erreur lors de la modification de l'article",
    };
  }
};

export default updateArticleForm;
