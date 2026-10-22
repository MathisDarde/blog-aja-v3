"use server";

import { db } from "@/db/db";
import {
  commentReportsTable,
  CommentReportReason,
  commentReportReasonEnum,
  commentsTable,
  SelectComment,
  user,
} from "@/db/schema";
import { CommentSchemaType } from "@/types/forms";
import { and, count, eq } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";
import { requireAdmin, requireUser } from "@/lib/auth-guard";
import { isRateLimited } from "@/lib/rate-limit";
import { articleOfComment, revalidateArticle, revalidateArticleOfComment } from "@/lib/article-cache";

// Au-delà, le commentaire est masqué en attendant qu'un admin tranche
const COMMENT_REPORTS_AUTO_HIDE = 3;

const commentFields = {
  id_comment: commentsTable.id_comment,
  articleId: commentsTable.articleId,
  stars: commentsTable.stars,
  title: commentsTable.title,
  content: commentsTable.content,
  userId: commentsTable.userId,
  pseudo: user.name,
  image: user.image,
  hidden: commentsTable.hidden,
  createdAt: commentsTable.createdAt,
  updatedAt: commentsTable.updatedAt,
};

async function requireCommentOwnerOrAdmin(commentId: string) {
  const currentUser = await requireUser();
  if (currentUser.admin === true) return;

  const [comment] = await db
    .select({ userId: commentsTable.userId })
    .from(commentsTable)
    .where(eq(commentsTable.id_comment, commentId))
    .limit(1);

  if (!comment || comment.userId !== currentUser.id) {
    throw new Error("Accès refusé");
  }
}

export async function createComment(
  data: CommentSchemaType,
  _userId: string,
  articleId: string
) {
  const { id: userId } = await requireUser();
  if (await isRateLimited("comment", userId)) {
    throw new Error("Trop de commentaires, réessayez dans une minute.");
  }

  const { title, stars, content } = data;

  const id_comment = uuidv4();
  const result = await db.insert(commentsTable).values({
    id_comment,
    title,
    stars,
    content,
    userId,
    articleId,
  });

  await revalidateArticle(articleId);
  return result;
}

export async function getCommentbyId(
  commentId: SelectComment["id_comment"]
) {
  return db
    .select(commentFields)
    .from(commentsTable)
    .innerJoin(
      user,
      and(
        eq(commentsTable.userId, user.id),
        eq(commentsTable.id_comment, commentId)
      )
    );
}

export async function updateComment(
  commentId: SelectComment["id_comment"],
  data: Partial<Omit<SelectComment, "id_comment">>
) {
  await requireCommentOwnerOrAdmin(commentId);

  const { title, stars, content } = data;
  await db
    .update(commentsTable)
    .set({ title, stars, content })
    .where(eq(commentsTable.id_comment, commentId));
  await revalidateArticleOfComment(commentId);
}

export async function deleteComment(commentId: SelectComment["id_comment"]) {
  await requireCommentOwnerOrAdmin(commentId);
  const articleId = await articleOfComment(commentId);
  await db.delete(commentsTable).where(eq(commentsTable.id_comment, commentId));
  if (articleId) await revalidateArticle(articleId);
}

export async function getCommentsbyArticle(
  id_article: SelectComment["articleId"]
) {
  return db
    .select(commentFields)
    .from(commentsTable)
    .innerJoin(user, eq(commentsTable.userId, user.id))
    .where(and(eq(commentsTable.articleId, id_article), eq(commentsTable.hidden, false)));
}

export async function getCommentsByUser(
  id_user: SelectComment["userId"]
) {
  return db
    .select(commentFields)
    .from(commentsTable)
    .innerJoin(user, eq(commentsTable.userId, user.id))
    .where(eq(commentsTable.userId, id_user));
}

/**
 * Signalement par un utilisateur connecté ; masque le commentaire au seuil atteint.
 * Renvoie le motif du refus à afficher, ou null si le signalement est enregistré.
 */
export async function reportComment(
  commentId: string,
  reason: CommentReportReason,
): Promise<string | null> {
  const { id: userId } = await requireUser();
  if (!commentReportReasonEnum.enumValues.includes(reason)) {
    return "Motif de signalement invalide.";
  }
  if (await isRateLimited("report", userId)) {
    return "Trop de signalements, réessayez plus tard.";
  }

  const [comment] = await db
    .select({ userId: commentsTable.userId })
    .from(commentsTable)
    .where(eq(commentsTable.id_comment, commentId))
    .limit(1);
  if (!comment) return "Ce commentaire n'existe plus.";
  if (comment.userId === userId) return "Vous ne pouvez pas signaler votre propre commentaire.";

  // Un second signalement du même utilisateur est ignoré (contrainte unique)
  await db
    .insert(commentReportsTable)
    .values({ id_report: uuidv4(), commentId, userId, reason })
    .onConflictDoNothing();

  const [{ total }] = await db
    .select({ total: count() })
    .from(commentReportsTable)
    .where(eq(commentReportsTable.commentId, commentId));

  const autoHidden = total >= COMMENT_REPORTS_AUTO_HIDE;
  if (autoHidden) {
    await db
      .update(commentsTable)
      .set({ hidden: true })
      .where(eq(commentsTable.id_comment, commentId));
    await revalidateArticleOfComment(commentId);
  }
  return null;
}

/** Masque ou réaffiche un commentaire ; réafficher vaut validation et efface les signalements. */
export async function setCommentHidden(commentId: string, hidden: boolean) {
  await requireAdmin();
  await db
    .update(commentsTable)
    .set({ hidden })
    .where(eq(commentsTable.id_comment, commentId));
  if (!hidden) await dismissReports(commentId);
  await revalidateArticleOfComment(commentId);
}

/** Efface les signalements d'un commentaire jugé acceptable, sans changer sa visibilité. */
export async function dismissCommentReports(commentId: string) {
  await requireAdmin();
  await dismissReports(commentId);
}

async function dismissReports(commentId: string) {
  await db.delete(commentReportsTable).where(eq(commentReportsTable.commentId, commentId));
}
