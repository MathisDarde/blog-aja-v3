"use server";

import { getUserLikedArticles } from "@/controllers/ArticlesController";

export default async function getUserLikesAction(userId: string) {
  if (!userId) return [];
  const articles = await getUserLikedArticles(userId);
  
  // On retourne des données sérialisables pour le client
  return articles;
}