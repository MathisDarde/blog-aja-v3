"use server";

import { reportComment } from "@/controllers/CommentController";
import type { CommentReportReason } from "@/db/schema";

const reportCommentAction = async (id_comment: string, reason: CommentReportReason) => {
  try {
    const refusal = await reportComment(id_comment, reason);
    if (refusal) return { success: false, message: refusal };
    return { success: true, message: "Merci, le commentaire a été signalé à la modération." };
  } catch (error) {
    console.error("Erreur lors du signalement du commentaire :", error);
    return { success: false, message: "Erreur lors du signalement du commentaire." };
  }
};

export default reportCommentAction;
