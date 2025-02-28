"use server";

import ArticleController from "@/controllers/ArticleController";

const displayArticles = async () => {
  try {
    return await ArticleController.index();
  } catch (error) {
    console.error("Erreur lors de la récupération des articles :", error);
    return [];
  }
};

export default displayArticles;
