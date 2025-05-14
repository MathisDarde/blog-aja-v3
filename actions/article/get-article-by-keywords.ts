"use server";

import { db } from "@/app/db/db";
import { articlesTable } from "@/app/db/schema";
import { and, or, like, ilike, sql, eq } from "drizzle-orm";

interface Article {
  id_article: string;
  imageUrl: string;
  title: string;
  teaser: string;
  content: string;
  author: string;
}

interface GetDonsParams {
  query?: string;
  year?: string;
  player?: string;
  league?: string;
}

export async function getArticlesbyKeywords({
  query,
  year,
  player,
  league,
}: GetDonsParams = {}): Promise<Article[]> {
  try {
    const searchTerms = query?.trim().split(" ") || [];

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
