"use server";

import { deleteArticle } from "@/controllers/ArticlesController";

const deleteArticleSA = async (id_article: string) => {
  try {
    await deleteArticle(id_article);
    return { success: true, message: "Article supprimé avec succès." };
  } catch (error) {
    console.error("Erreur lors de la suppression de l'article :", error);
    return {
      success: false,
      message: "Erreur lors de la suppression de l'article.",
    };
  }
};

export default deleteArticleSA;
