import { db } from "@/app/db/db";
import { commentsTable, SelectComment, user } from "@/app/db/schema";
import { CommentSchemaType } from "@/types/forms";
import { and, eq } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";

export async function getComments(): Promise<
  Array<{
    id_comment: string;
    stars: string;
    title: string;
    content: string;
    userId: string;
    pseudo: string;
    photodeprofil: string | null;
    createdAt: Date;
    updatedAt: Date;
  }>
> {
  return db
    .select({
      id_comment: commentsTable.id_comment,
      stars: commentsTable.stars,
      title: commentsTable.title,
      content: commentsTable.content,
      userId: commentsTable.userId,
      pseudo: user.name,
      photodeprofil: user.photodeprofil,
      createdAt: commentsTable.createdAt,
      updatedAt: commentsTable.updatedAt,
    })
    .from(commentsTable)
    .innerJoin(user, eq(commentsTable.userId, user.id));
}

export async function createComment(
  data: CommentSchemaType,
  userId: string,
  articleId: string
) {
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
    stars: string;
    title: string;
    content: string;
    userId: string;
    pseudo: string;
    photodeprofil: string | null;
    createdAt: Date;
    updatedAt: Date;
  }>
> {
  return db
    .select({
      id_comment: commentsTable.id_comment,
      stars: commentsTable.stars,
      title: commentsTable.title,
      content: commentsTable.content,
      userId: commentsTable.userId,
      pseudo: user.name,
      photodeprofil: user.photodeprofil,
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

export async function updateArticle(
  commentId: SelectComment["id_comment"],
  data: Partial<Omit<SelectComment, "id_comment">>
) {
  await db
    .update(commentsTable)
    .set(data)
    .where(eq(commentsTable.id_comment, commentId));
}

export async function deleteArticle(commentId: SelectComment["id_comment"]) {
  await db.delete(commentsTable).where(eq(commentsTable.id_comment, commentId));
}

export async function getCommentsbyArticle(
  id_article: SelectComment["articleId"]
): Promise<
  Array<{
    id_comment: string;
    stars: string;
    title: string;
    content: string;
    userId: string;
    pseudo: string;
    photodeprofil: string | null;
    createdAt: Date;
    updatedAt: Date;
  }>
> {
  return db
    .select({
      id_comment: commentsTable.id_comment,
      stars: commentsTable.stars,
      title: commentsTable.title,
      content: commentsTable.content,
      userId: commentsTable.userId,
      pseudo: user.name,
      photodeprofil: user.photodeprofil,
      createdAt: commentsTable.createdAt,
      updatedAt: commentsTable.updatedAt,
    })
    .from(commentsTable)
    .innerJoin(user, eq(commentsTable.userId, user.id))
    .where(eq(commentsTable.articleId, id_article));
}
