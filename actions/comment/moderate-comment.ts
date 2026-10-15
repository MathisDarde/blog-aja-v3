"use server";

import { dismissCommentReports, setCommentHidden } from "@/controllers/CommentController";

export async function setCommentHiddenAction(id_comment: string, hidden: boolean) {
  try {
    await setCommentHidden(id_comment, hidden);
    return { success: true, message: hidden ? "Commentaire masqué." : "Commentaire réaffiché." };
  } catch (error) {
    console.error("Erreur lors de la modération du commentaire :", error);
    return { success: false, message: "Erreur lors de la modération du commentaire." };
  }
}

export async function dismissCommentReportsAction(id_comment: string) {
  try {
    await dismissCommentReports(id_comment);
    return { success: true, message: "Signalements ignorés." };
  } catch (error) {
    console.error("Erreur lors de la suppression des signalements :", error);
    return { success: false, message: "Erreur lors de la suppression des signalements." };
  }
}
