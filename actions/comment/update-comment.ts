"use server";

import { CommentSchema } from "@/app/schema";
import { updateComment } from "@/controllers/CommentController";
import { CommentSchemaType, FormResponse } from "@/types/forms";

const updateCommentAction = async (
  commentId: string,
  data: CommentSchemaType
): Promise<FormResponse> => {
  try {
    const parsedData = CommentSchema.safeParse(data);

    if (!parsedData.success) {
      return { success: false, errors: parsedData.error.errors };
    }

    await updateComment(commentId, data);

    return { success: true, message: "Commentaire modifié avec succès" };
  } catch (err) {
    console.log(err);
    return {
      success: false,
      message: "Erreur lors de la modification du commentaire",
    };
  }
};

export default updateCommentAction;
