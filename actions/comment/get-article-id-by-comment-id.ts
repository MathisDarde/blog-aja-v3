"use server";

import { getArticleIdByCommentId } from "@/controllers/CommentController";

const getArticleIdByComment = async (id_comment: string) => {
  try {
    if (!id_comment) throw new Error("ID du commentaire manquant.");

    return await getArticleIdByCommentId(id_comment);
  } catch (error) {
    console.error("Erreur lors de la récupération de l'article ID:", error);
    return null;
  }
};

export default getArticleIdByComment;
