"use server";

import { deleteLike } from "@/controllers/LikedArticlesController";

const removeLike = async (
  userId: string,
  articleId: string
) => {
  try {
    await deleteLike(userId, articleId);
    return {
      success: true,
      message: "Like removed successfully",
    };
  } catch (err) {
    console.error(err);
    return {
      success: false,
      message: "Erreur lors de la suppression du like de l'article",
    };
  }
};

export default removeLike;
