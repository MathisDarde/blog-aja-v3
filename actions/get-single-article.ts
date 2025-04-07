"use server";

import { getArticlebyId } from "@/controllers/ArticlesController";

const displayUniqueArticle = async (id_article: string) => {
  try {
    if (!id_article) throw new Error("ID article manquant.");

    return await getArticlebyId(id_article);
  } catch (error) {
    console.error("Erreur lors de la récupération de l'article :", error);
    return null;
  }
};

export default displayUniqueArticle;
