"use server";

import { updateStatus } from "@/controllers/ArticlesController";

const updateArticleStatus = async (
  articleId: string,
  state: "pending" | "published" | "archived"
) => {
  try {
    await updateStatus(articleId, state);
    return {
      success: true,
      message: "Article status updated successfully",
    };
  } catch (err) {
    console.error(err);
    return {
      success: false,
      message: "Erreur lors de la modification de l'article",
    };
  }
};

export default updateArticleStatus;
