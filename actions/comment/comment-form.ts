"use server";

import { CommentSchema } from "@/app/schema";
import { createComment } from "@/controllers/CommentController";
import { CommentSchemaType, FormResponse } from "@/types/forms";

const submitCommentForm = async (
  data: CommentSchemaType,
  userId: string,
  articleId: string
): Promise<FormResponse> => {
  try {
    const parsedData = CommentSchema.safeParse(data);

    if (!parsedData.success) {
      return { success: false, errors: parsedData.error.errors };
    }

    try {
      await createComment(parsedData.data, userId, articleId);
      return { success: true, message: "Commentaire publié avec succès" };
    } catch (error) {
      console.error(error);
      return {
        success: false,
        message: "Erreur lors de la publication du commentaire",
      };
    }
  } catch (err) {
    console.log(err);
    return {
      success: false,
      message: "Erreur lors de la publication du commentaire",
    };
  }
};

export default submitCommentForm;
