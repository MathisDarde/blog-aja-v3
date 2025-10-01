"use server";

import { db } from "@/db/db";
import { likedArticles, SelectLikedArticles } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";

export async function storeLike(userId: string, articleId: string) {
    const id_like = uuidv4();
  
    await db.insert(likedArticles).values({
      id: uuidv4(),
      userId,
      articleId,
      likedAt: new Date(),
    });
  
    return { id_like, userId, articleId };
  }

export async function updateLike(
  id_like: string,
  data: Partial<Omit<SelectLikedArticles, "id">>
) {
  // Met à jour un like (ex: un champ "rating" ou "active")
  await db.update(likedArticles).set(data).where(eq(likedArticles.id, id_like));
}

export async function deleteLike(userId: string, articleId: string) {
    await db
      .delete(likedArticles)
      .where(
        and(
          eq(likedArticles.userId, userId),
          eq(likedArticles.articleId, articleId)
        )
      );
  }

export async function getLikesByArticle(articleId: string): Promise<
  Array<{
    id: string;
    userId: string;
    likedAt: Date;
  }>
> {
  return db
    .select({
      id: likedArticles.id,
      userId: likedArticles.userId,
      likedAt: likedArticles.likedAt,
    })
    .from(likedArticles)
    .where(eq(likedArticles.articleId, articleId));
}

export async function getLikesByUser(userId: string): Promise<
  Array<{
    id_like: string;
    articleId: string;
    likedAt: Date;
  }>
> {
  return db
    .select({
      id_like: likedArticles.id,
      articleId: likedArticles.articleId,
      likedAt: likedArticles.likedAt,
    })
    .from(likedArticles)
    .where(eq(likedArticles.userId, userId));
}
