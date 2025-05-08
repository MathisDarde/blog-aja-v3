"use server";

import { getArticles } from "@/controllers/ArticlesController";

const displayArticles = async () => {
  try {
    return await getArticles();
  } catch (error) {
    console.error("Erreur lors de la récupération des articles :", error);
    return [];
  }
};

export default displayArticles;
