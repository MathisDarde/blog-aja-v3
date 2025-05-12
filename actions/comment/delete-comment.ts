"use server";

import { deleteComment } from "@/controllers/CommentController";

const deleteCommentAction = async (id_comment: string) => {
  try {
    await deleteComment(id_comment);
    return { success: true, message: "Commentaire supprimé avec succès." };
  } catch (error) {
    console.error("Erreur lors de la suppression du commentaire :", error);
    return {
      success: false,
      message: "Erreur lors de la suppression du commentaire.",
    };
  }
};

export default deleteCommentAction;
