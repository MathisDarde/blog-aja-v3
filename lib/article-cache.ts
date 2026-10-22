// Les pages d'articles sont servies en cache (app/articles/[slug]) : à régénérer quand
// leurs commentaires ou leurs likes changent.

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { db } from "@/db/db";
import { articlesTable, commentsTable } from "@/db/schema";

export async function revalidateArticle(articleId: string) {
  const [article] = await db
    .select({ slug: articlesTable.slug })
    .from(articlesTable)
    .where(eq(articlesTable.id_article, articleId))
    .limit(1);
  if (article) revalidatePath(`/articles/${article.slug}`);
}

/** Article d'un commentaire, à appeler avant de supprimer le commentaire. */
export async function articleOfComment(commentId: string): Promise<string | null> {
  const [comment] = await db
    .select({ articleId: commentsTable.articleId })
    .from(commentsTable)
    .where(eq(commentsTable.id_comment, commentId))
    .limit(1);
  return comment?.articleId ?? null;
}

export async function revalidateArticleOfComment(commentId: string) {
  const articleId = await articleOfComment(commentId);
  if (articleId) await revalidateArticle(articleId);
}
