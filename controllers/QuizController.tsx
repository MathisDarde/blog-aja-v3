"use server";

import { db } from "@/db/db";
import { quizAttemptsTable, quizQuestionsTable, user } from "@/db/schema";
import { QuizQuestionSchema } from "@/app/schema";
import { QuizQuestionSchemaType } from "@/types/forms";
import { and, asc, eq, inArray, isNull, sql } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { getSessionUser, requireAdmin } from "@/lib/auth-guard";
import { getClientIp, isRateLimited } from "@/lib/rate-limit";

// Nombre de questions tirées au sort par partie
const QUIZ_LENGTH = 10;
const LEADERBOARD_SIZE = 10;

export interface QuizQuestionToPlay {
  id_question: string;
  question: string;
  answers: string[];
}

export interface QuizLeaderboardEntry {
  userId: string;
  pseudo: string;
  image: string | null;
  score: number;
  total: number;
  seconds: number;
  finishedAt: Date;
}

/** Nouvelle partie : questions tirées au sort, sans leurs bonnes réponses. */
export async function startQuiz(): Promise<
  { attemptId: string; questions: QuizQuestionToPlay[] } | { error: string }
> {
  const currentUser = await getSessionUser();
  const identifier = currentUser?.id ?? getClientIp(await headers());
  if (await isRateLimited("quiz", identifier)) {
    return { error: "Trop de parties lancées, réessayez dans quelques minutes." };
  }

  const questions = await db
    .select({
      id_question: quizQuestionsTable.id_question,
      question: quizQuestionsTable.question,
      answers: quizQuestionsTable.answers,
    })
    .from(quizQuestionsTable)
    .where(eq(quizQuestionsTable.active, true))
    .orderBy(sql`random()`)
    .limit(QUIZ_LENGTH);

  if (questions.length === 0) return { error: "Aucune question n'est disponible pour le moment." };

  const attemptId = uuidv4();
  await db.insert(quizAttemptsTable).values({
    id_attempt: attemptId,
    userId: currentUser?.id ?? null,
    questionIds: questions.map((q) => q.id_question),
  });

  return { attemptId, questions };
}

/**
 * Enregistre la réponse à la question n° `position` de la partie et renvoie la correction.
 * Les réponses se donnent dans l'ordre, une seule fois chacune.
 */
export async function answerQuizQuestion(
  attemptId: string,
  position: number,
  answerIndex: number,
): Promise<
  | { correctIndex: number; explanation: string | null; score: number; finished: boolean }
  | { error: string }
> {
  const [attempt] = await db
    .select()
    .from(quizAttemptsTable)
    .where(eq(quizAttemptsTable.id_attempt, attemptId))
    .limit(1);
  if (!attempt) return { error: "Partie introuvable." };

  if (attempt.userId) {
    const currentUser = await getSessionUser();
    if (currentUser?.id !== attempt.userId) return { error: "Cette partie ne vous appartient pas." };
  }
  if (attempt.finishedAt || position !== attempt.answers.length) {
    return { error: "Cette question a déjà reçu une réponse." };
  }

  const [question] = await db
    .select()
    .from(quizQuestionsTable)
    .where(eq(quizQuestionsTable.id_question, attempt.questionIds[position]))
    .limit(1);
  if (!question) return { error: "Cette question a été supprimée entre-temps." };
  if (!Number.isInteger(answerIndex) || answerIndex < 0 || answerIndex >= question.answers.length) {
    return { error: "Réponse invalide." };
  }

  const correct = answerIndex === question.correctIndex;
  const finished = position + 1 === attempt.questionIds.length;

  // Mise à jour conditionnelle : un double envoi de la même réponse n'est compté qu'une fois
  const [updated] = await db
    .update(quizAttemptsTable)
    .set({
      answers: sql`array_append(${quizAttemptsTable.answers}, ${answerIndex})`,
      score: sql`${quizAttemptsTable.score} + ${correct ? 1 : 0}`,
      finishedAt: finished ? new Date() : null,
    })
    .where(
      and(
        eq(quizAttemptsTable.id_attempt, attemptId),
        isNull(quizAttemptsTable.finishedAt),
        sql`cardinality(${quizAttemptsTable.answers}) = ${position}`,
      ),
    )
    .returning({ score: quizAttemptsTable.score });
  if (!updated) return { error: "Cette question a déjà reçu une réponse." };

  if (finished && attempt.userId) revalidatePath("/quiz");

  return {
    correctIndex: question.correctIndex,
    explanation: question.explanation,
    score: updated.score,
    finished,
  };
}

/** Meilleure partie de chaque joueur connecté : score, puis temps le plus court. */
export async function getQuizLeaderboard(): Promise<QuizLeaderboardEntry[]> {
  const best = db
    .selectDistinctOn([quizAttemptsTable.userId], {
      userId: sql<string>`${quizAttemptsTable.userId}`.as("userId"),
      pseudo: sql<string>`${user.name}`.as("pseudo"),
      image: sql<string | null>`${user.image}`.as("image"),
      score: sql<number>`${quizAttemptsTable.score}`.as("score"),
      total: sql<number>`cardinality(${quizAttemptsTable.questionIds})`.as("total"),
      seconds: sql<number>`extract(epoch from ${quizAttemptsTable.finishedAt} - ${quizAttemptsTable.createdAt})::float`.as(
        "seconds",
      ),
      finishedAt: sql<Date>`${quizAttemptsTable.finishedAt}`.as("finishedAt"),
    })
    .from(quizAttemptsTable)
    .innerJoin(user, eq(quizAttemptsTable.userId, user.id))
    .where(sql`${quizAttemptsTable.finishedAt} is not null`)
    .orderBy(
      quizAttemptsTable.userId,
      sql`${quizAttemptsTable.score} desc`,
      sql`${quizAttemptsTable.finishedAt} - ${quizAttemptsTable.createdAt}`,
    )
    .as("best");

  const rows = await db
    .select()
    .from(best)
    .orderBy(sql`${best.score} desc`, best.seconds, best.finishedAt)
    .limit(LEADERBOARD_SIZE);

  return rows.map((row) => ({ ...row, finishedAt: new Date(row.finishedAt) }));
}

// --- Administration ---

export async function getQuizQuestions() {
  await requireAdmin();
  return db.select().from(quizQuestionsTable).orderBy(asc(quizQuestionsTable.createdAt));
}

function parseQuestion(data: QuizQuestionSchemaType) {
  const parsed = QuizQuestionSchema.safeParse(data);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Question invalide." };
  const { explanation, ...rest } = parsed.data;
  return { values: { ...rest, explanation: explanation || null } };
}

export async function createQuizQuestion(data: QuizQuestionSchemaType) {
  await requireAdmin();
  const { values, error } = parseQuestion(data);
  if (!values) return { success: false, message: error };
  await db.insert(quizQuestionsTable).values({ id_question: uuidv4(), ...values });
  return { success: true, message: "Question ajoutée." };
}

export async function updateQuizQuestion(id: string, data: QuizQuestionSchemaType) {
  await requireAdmin();
  const { values, error } = parseQuestion(data);
  if (!values) return { success: false, message: error };
  await db.update(quizQuestionsTable).set(values).where(eq(quizQuestionsTable.id_question, id));
  return { success: true, message: "Question modifiée." };
}

export async function setQuizQuestionsActive(ids: string[], active: boolean) {
  await requireAdmin();
  if (ids.length === 0) return { success: true, message: "" };
  await db.update(quizQuestionsTable).set({ active }).where(inArray(quizQuestionsTable.id_question, ids));
  return { success: true, message: active ? "Question activée." : "Question désactivée." };
}

export async function deleteQuizQuestion(id: string) {
  await requireAdmin();
  await db.delete(quizQuestionsTable).where(eq(quizQuestionsTable.id_question, id));
  return { success: true, message: "Question supprimée." };
}
