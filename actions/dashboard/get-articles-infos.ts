"use server";

import { getAllArticles } from "@/controllers/ArticlesController";

const getArticlesInfos = async () => {
  try {
    return getAllArticles();
  } catch (error) {
    console.error("Erreur lors de la récupération des articles :", error);
    return {
      success: false,
      message: "Erreur lors de la récupération des articles.",
    };
  }
};

export default getArticlesInfos;
