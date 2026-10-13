"use server";

import { db } from "@/db/db";
import {
  articlesTable,
  likedArticles,
  SelectArticle,
  SelectPost,
} from "@/db/schema";
import { ArticleSchemaType } from "@/types/forms";
import { and, desc, eq, ilike, like, or, sql } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";
import { Article, GetURLParams } from "@/contexts/Interfaces";
import { ensureCloudinaryUrl } from "@/lib/store-cloudinary-image";
import { sendNewsletter } from "@/actions/article/send-new-article-mail";
import {
  getSessionUser,
  requireAdmin,
  requireSelfOrAdmin,
} from "@/lib/auth-guard";
import { revalidatePath } from "next/cache";

// Pages listant les articles publiés : à invalider après chaque modification
function revalidateArticlePages() {
  revalidatePath("/");
  revalidatePath("/articles");
  revalidatePath("/sitemap.xml");
}

export async function getAllArticles(): Promise<SelectArticle[]> {
  await requireAdmin();
  return db
    .select()
    .from(articlesTable)
    .then((articles) =>
      articles.map((article) => ({
        ...article,
        state: (article.state ?? "pending") as
          | "pending"
          | "published"
          | "archived",
      })),
    );
}

export async function getArticles(): Promise<SelectArticle[]> {
  return db
    .select()
    .from(articlesTable)
    .where(eq(articlesTable.state, "published"))
    .then((articles) =>
      articles.map((article) => ({
        ...article,
        state: (article.state ?? "pending") as
          | "pending"
          | "published"
          | "archived",
      })),
    );
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function createArticle(data: ArticleSchemaType, _userId: string) {
  const { id: userId } = await requireAdmin();

  try {
    const imageUrl = ensureCloudinaryUrl(data.imageUrl);

    const { slug, title, teaser, content, author, tags } = data;
    const parsedTags = typeof tags === "string" ? JSON.parse(tags) : tags;

    const result = await db.insert(articlesTable).values({
      id_article: uuidv4(),
      slug,
      imageUrl,
      title,
      teaser,
      content,
      author,
      tags: parsedTags,
      state: "published",
      userId,
    });

    revalidateArticlePages();

    if (process.env.NODE_ENV === "production") {
      console.log("📨 Déclenchement de la newsletter en arrière-plan...");
      sendNewsletter({ title, teaser, slug, imageUrl }).catch((err) => {
        console.error(
          "❌ Erreur lors de l'envoi de la newsletter (Background):",
          err,
        );
      });
    } else {
      console.log("📭 Newsletter ignorée (environnement de développement).");
    }

    return result;
  } catch (err) {
    console.error(err);
    throw new Error(
      `Erreur lors de la création de l'article: ${
        err instanceof Error ? err.message : "Erreur inconnue"
      }`,
    );
  }
}

export async function getArticlebyId(
  articleId: SelectPost["id_article"],
): Promise<SelectArticle | null> {
  await requireAdmin();
  const articles = await db
    .select()
    .from(articlesTable)
    .where(eq(articlesTable.id_article, articleId));

  if (articles.length === 0) return null;

  return {
    ...articles[0],
    state: (articles[0].state ?? "pending") as
      | "pending"
      | "published"
      | "archived",
  };
}

export async function getArticleBySlug(
  slug: SelectPost["slug"],
): Promise<SelectArticle | null> {
  const articles = await db
    .select()
    .from(articlesTable)
    .where(eq(articlesTable.slug, slug));

  if (articles.length === 0) return null;

  // Brouillons / archives : réservés aux admins
  if (articles[0].state !== "published") {
    const currentUser = await getSessionUser();
    if (currentUser?.admin !== true) return null;
  }

  return {
    ...articles[0],
    state: (articles[0].state ?? "pending") as
      | "pending"
      | "published"
      | "archived",
  };
}

export async function updateArticle(
  articleId: SelectPost["id_article"],
  data: Partial<Omit<SelectPost, "id_article">>,
) {
  await requireAdmin();

  try {
    if (!data.imageUrl) {
      throw new Error("L'image est requise pour modifier l'article.");
    }

    const imageUrl = ensureCloudinaryUrl(data.imageUrl);

    if (typeof data.tags === "string") {
      data.tags = JSON.parse(data.tags);
    }

    const updateData = {
      ...data,
      imageUrl,
    };

    const result = await db
      .update(articlesTable)
      .set(updateData)
      .where(eq(articlesTable.id_article, articleId));

    revalidateArticlePages();
    return result;
  } catch (err) {
    console.error(err);
    throw new Error("Erreur lors de la modification de l'article");
  }
}

export async function updateStatus(
  articleId: SelectPost["id_article"],
  state: "pending" | "published" | "archived",
) {
  await requireAdmin();
  await db
    .update(articlesTable)
    .set({ state })
    .where(eq(articlesTable.id_article, articleId));

  revalidateArticlePages();
}

export async function deleteArticle(articleId: SelectPost["id_article"]) {
  await requireAdmin();
  // Delete related likes first (in case cascade delete hasn't been applied yet)
  await db.delete(likedArticles).where(eq(likedArticles.articleId, articleId));
  // Then delete the article
  await db.delete(articlesTable).where(eq(articlesTable.id_article, articleId));

  revalidateArticlePages();
}

export async function getLastPublished() {
  return db
    .select()
    .from(articlesTable)
    .where(eq(articlesTable.state, "published"))
    .orderBy(desc(articlesTable.createdAt))
    .then((results) => results[0]);
}

export async function getArticlesbyKeywords({
  q,
  year,
  player,
  league,
}: GetURLParams = {}): Promise<SelectArticle[]> {
  try {
    const searchTerms =
      q
        ?.trim()
        .split(/\s+/)
        .filter((s) => s.length > 0) ?? [];

    const conditions = [];

    if (searchTerms.length > 0) {
      const searchConditions = searchTerms.map((term) =>
        or(
          like(articlesTable.title, `%${term.toLowerCase()}%`),
          like(articlesTable.teaser, `%${term.toLowerCase()}%`),
          ilike(articlesTable.content, `%${term}%`),
        ),
      );
      conditions.push(or(...searchConditions));
    }

    if (year) conditions.push(sql`${year} = ANY(${articlesTable.tags})`);
    if (league) conditions.push(sql`${league} = ANY(${articlesTable.tags})`);
    if (player) conditions.push(sql`${player} = ANY(${articlesTable.tags})`);

    conditions.push(eq(articlesTable.state, "published"));

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

export async function getUserLikedArticles(userId: string) {
  await requireSelfOrAdmin(userId);

  try {
    const result = await db
      .select({
        id_article: articlesTable.id_article,
        title: articlesTable.title,
        slug: articlesTable.slug,
        imageUrl: articlesTable.imageUrl,
        teaser: articlesTable.teaser,
        content: articlesTable.content,
        state: articlesTable.state,
        userId: articlesTable.userId,
        createdAt: articlesTable.createdAt,
        updatedAt: articlesTable.updatedAt,
        tags: articlesTable.tags,
        author: articlesTable.author,
        likedAt: likedArticles.likedAt,
      })
      .from(articlesTable)
      .innerJoin(
        likedArticles,
        eq(articlesTable.id_article, likedArticles.articleId),
      )
      .where(eq(likedArticles.userId, userId))
      .orderBy(desc(likedArticles.likedAt));

    return result;
  } catch (error) {
    console.error("Erreur lors de la récupération des articles likés:", error);
    return [];
  }
}
