"use server";

import { db } from "@/db/db";
import { articlesTable } from "@/db/schema";
import { Article, GetURLParams } from "@/contexts/Interfaces";

import { and, or, like, ilike, sql, eq } from "drizzle-orm";

export async function getArticlesbyKeywords({
  q,
  year,
  player,
  league,
}: GetURLParams = {}): Promise<Article[]> {
  try {
    const searchTerms = q?.trim().split(" ") || [];

    const conditions = [];

    // Recherche textuelle
    if (searchTerms.length > 0) {
      const searchConditions = searchTerms.map((term) =>
        or(
          like(articlesTable.title, `%${term.toLowerCase()}%`),
          like(articlesTable.teaser, `%${term.toLowerCase()}%`),
          ilike(articlesTable.content, `%${term}%`)
        )
      );
      conditions.push(or(...searchConditions));
    }

    // Filtres de tags
    if (year) {
      conditions.push(sql`${year} = ANY(${articlesTable.tags})`);
    }
    if (league) {
      conditions.push(sql`${league} = ANY(${articlesTable.tags})`);
    }
    if (player) {
      conditions.push(sql`${player} = ANY(${articlesTable.tags})`);
    }

    // Toujours vérifier l'état publié
    conditions.push(eq(articlesTable.state, "published"));

    // Exécution de la requête
    const results = await db
      .select()
      .from(articlesTable)
      .where(and(...conditions));

    return results as Article[];
  } catch (error) {
    console.error("❌ Erreur Drizzle:", error);
    return [];
  }
}
