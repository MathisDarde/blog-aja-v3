"use server";

import { getCommentsByUser } from "@/controllers/CommentController";

const displayCommentsbyUser = async (id_user: string) => {
  try {
    if (!id_user) throw new Error("ID user manquant.");

    return await getCommentsByUser(id_user);
  } catch (error) {
    console.error("Erreur lors de la récupération des commentaires :", error);
    return null;
  }
};

export default displayCommentsbyUser;
