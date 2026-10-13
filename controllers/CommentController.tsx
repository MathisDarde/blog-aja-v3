"use server";

import { db } from "@/db/db";
import { commentsTable, SelectComment, user } from "@/db/schema";
import { CommentSchemaType } from "@/types/forms";
import { and, eq } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";
import { requireAdmin, requireUser } from "@/lib/auth-guard";

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

export async function getComments(): Promise<
  Array<{
    id_comment: string;
    articleId: string;
    stars: number;
    title: string;
    content: string;
    userId: string;
    pseudo: string;
    image: string | null;
    createdAt: Date;
    updatedAt: Date;
  }>
> {
  await requireAdmin();
  return db
    .select({
      id_comment: commentsTable.id_comment,
      articleId: commentsTable.articleId,
      stars: commentsTable.stars,
      title: commentsTable.title,
      content: commentsTable.content,
      userId: commentsTable.userId,
      pseudo: user.name,
      image: user.image,
      createdAt: commentsTable.createdAt,
      updatedAt: commentsTable.updatedAt,
    })
    .from(commentsTable)
    .innerJoin(user, eq(commentsTable.userId, user.id));
}

export async function createComment(
  data: CommentSchemaType,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _userId: string,
  articleId: string
) {
  const { id: userId } = await requireUser();
  const { title, stars, content } = data;

  const result = await db.insert(commentsTable).values({
    id_comment: uuidv4(),
    title,
    stars,
    content,
    userId,
    articleId,
  });

  return result;
}

export async function getCommentbyId(
  commentId: SelectComment["id_comment"]
): Promise<
  Array<{
    id_comment: string;
    articleId: string;
    stars: number;
    title: string;
    content: string;
    userId: string;
    pseudo: string;
    image: string | null;
    createdAt: Date;
    updatedAt: Date;
  }>
> {
  return db
    .select({
      id_comment: commentsTable.id_comment,
      articleId: commentsTable.articleId,
      stars: commentsTable.stars,
      title: commentsTable.title,
      content: commentsTable.content,
      userId: commentsTable.userId,
      pseudo: user.name,
      image: user.image,
      createdAt: commentsTable.createdAt,
      updatedAt: commentsTable.updatedAt,
    })
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
}

export async function deleteComment(commentId: SelectComment["id_comment"]) {
  await requireCommentOwnerOrAdmin(commentId);
  await db.delete(commentsTable).where(eq(commentsTable.id_comment, commentId));
}

export async function getCommentsbyArticle(
  id_article: SelectComment["articleId"]
): Promise<
  Array<{
    id_comment: string;
    articleId: string;
    stars: number;
    title: string;
    content: string;
    userId: string;
    pseudo: string;
    image: string | null;
    createdAt: Date;
    updatedAt: Date;
  }>
> {
  return db
    .select({
      id_comment: commentsTable.id_comment,
      articleId: commentsTable.articleId,
      stars: commentsTable.stars,
      title: commentsTable.title,
      content: commentsTable.content,
      userId: commentsTable.userId,
      pseudo: user.name,
      image: user.image,
      createdAt: commentsTable.createdAt,
      updatedAt: commentsTable.updatedAt,
    })
    .from(commentsTable)
    .innerJoin(user, eq(commentsTable.userId, user.id))
    .where(eq(commentsTable.articleId, id_article));
}

export async function getCommentsByUser(
  id_user: SelectComment["userId"]
): Promise<
  Array<{
    id_comment: string;
    articleId: string;
    stars: number;
    title: string;
    content: string;
    userId: string;
    pseudo: string;
    image: string | null;
    createdAt: Date;
    updatedAt: Date;
  }>
> {
  return db
    .select({
      id_comment: commentsTable.id_comment,
      articleId: commentsTable.articleId,
      stars: commentsTable.stars,
      title: commentsTable.title,
      content: commentsTable.content,
      userId: commentsTable.userId,
      pseudo: user.name,
      image: user.image,
      createdAt: commentsTable.createdAt,
      updatedAt: commentsTable.updatedAt,
    })
    .from(commentsTable)
    .innerJoin(user, eq(commentsTable.userId, user.id))
    .where(eq(commentsTable.userId, id_user));
}

export async function getArticleIdByCommentId(
  commentId: SelectComment["id_comment"]
): Promise<string | null> {
  const result = await db
    .select({ articleId: commentsTable.articleId })
    .from(commentsTable)
    .where(eq(commentsTable.id_comment, commentId))
    .limit(1);

  return result.length > 0 ? result[0].articleId : null;
}
