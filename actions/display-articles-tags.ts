"use server";

import ArticleController from "@/controllers/ArticleController";

const fetchArticlesByTag = async (tag: string) => {
  try {
    return await ArticleController.filter(tag);
  } catch (error) {
    console.error("Erreur lors de la récupération des articles :", error);
    return [];
  }
};

export default fetchArticlesByTag;
