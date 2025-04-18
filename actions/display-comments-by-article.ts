"use server";

import { getCommentsbyArticle } from "@/controllers/CommentController";

const displayCommentsbyId = async (id_article: string) => {
  try {
    if (!id_article) throw new Error("ID article manquant.");

    return await getCommentsbyArticle(id_article);
  } catch (error) {
    console.error("Erreur lors de la récupération des commentaires :", error);
    return null;
  }
};

export default displayCommentsbyId;
