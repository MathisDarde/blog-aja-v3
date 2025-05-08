"use server";

import { getComments } from "@/controllers/CommentController";

const getCommentsInfos = async () => {
  try {
    return getComments();
  } catch (error) {
    console.error("Erreur lors de la récupération des commentaires :", error);
    return {
      success: false,
      message: "Erreur lors de la récupération des commentaires.",
    };
  }
};

export default getCommentsInfos;
