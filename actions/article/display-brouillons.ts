"use server";

import { getBrouillons } from "@/controllers/ArticlesController";

const displayBrouillons = async () => {
  try {
    return await getBrouillons();
  } catch (error) {
    console.error("Erreur lors de la récupération des articles :", error);
    return [];
  }
};

export default displayBrouillons;
