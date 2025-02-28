"use server";

import ArticleController from "@/controllers/ArticleController";

const displayUniqueArticle = async (id_article: number | string) => {
  try {
    if (!id_article) throw new Error("ID article manquant.");

    const id = Number(id_article);
    if (isNaN(id)) throw new Error("L'ID de l'article n'est pas valide.");

    return await ArticleController.show(id);
  } catch (error) {
    console.error("Erreur lors de la récupération de l'article :", error);
    return null;
  }
};

export default displayUniqueArticle;
