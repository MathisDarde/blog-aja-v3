"use server";

import { getArticleSlugByCommentId } from "@/controllers/CommentController";

const getArticleSlugByComment = async (id_comment: string) => {
  try {
    if (!id_comment) throw new Error("ID du commentaire manquant.");

    return await getArticleSlugByCommentId(id_comment);
  } catch (error) {
    console.error("Erreur lors de la récupération de l'article du commentaire:", error);
    return null;
  }
};

export default getArticleSlugByComment;
