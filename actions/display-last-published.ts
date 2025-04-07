"use server";

import { getLastPublished } from "@/controllers/ArticlesController";

const displayLastPublished = async () => {
  try {
    return await getLastPublished();
  } catch (error) {
    console.error("Erreur lors de la récupération des articles :", error);
    return [];
  }
};

export default displayLastPublished;
