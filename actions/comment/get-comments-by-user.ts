"use server";

import { getUserLikedArticles } from "@/controllers/ArticlesController";
import { getCommentsByUser } from "@/controllers/CommentController";

export default async function getUserComments(userId: string) {
  if (!userId) return [];
  const comments = await getCommentsByUser(userId);
  
  // On retourne des données sérialisables pour le client
  return comments;
}