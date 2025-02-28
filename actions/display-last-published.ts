"use server";

import ArticleController from "@/controllers/ArticleController";

const displayLastPublished = async () => {
  try {
    return await ArticleController.lastpublished();
  } catch (error) {
    console.error("Erreur lors de la récupération des articles :", error);
    return [];
  }
};

export default displayLastPublished;
