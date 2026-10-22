// Messages Discord de l'activité du site (lib/discord) : contenus lus seulement si le salon
// concerné est configuré.

import { count, eq } from "drizzle-orm";
import { db } from "@/db/db";
import { articlesTable, commentsTable, CommentReportReason, likedArticles, user } from "@/db/schema";
import { DISCORD_COLORS, notifyDiscord } from "@/lib/discord";

const REASONS: Record<CommentReportReason, string> = {
  spam: "Spam",
  insulte: "Insultes",
  "hors-sujet": "Hors sujet",
  autre: "Autre",
};

async function userName(userId: string) {
  const [u] = await db.select({ name: user.name }).from(user).where(eq(user.id, userId)).limit(1);
  return u?.name ?? "Utilisateur supprimé";
}

async function article(articleId: string) {
  const [a] = await db
    .select({ title: articlesTable.title, slug: articlesTable.slug, imageUrl: articlesTable.imageUrl })
    .from(articlesTable)
    .where(eq(articlesTable.id_article, articleId))
    .limit(1);
  return a ?? null;
}

async function comment(commentId: string) {
  const [c] = await db
    .select({
      title: commentsTable.title,
      content: commentsTable.content,
      stars: commentsTable.stars,
      userId: commentsTable.userId,
      articleId: commentsTable.articleId,
    })
    .from(commentsTable)
    .where(eq(commentsTable.id_comment, commentId))
    .limit(1);
  return c ?? null;
}

/** Inscription (email ou Google). L'adresse email n'est pas envoyée à Discord. */
export function notifySignup(newUser: { name: string; image?: string | null }) {
  notifyDiscord("signups", async () => {
    const [{ total }] = await db.select({ total: count() }).from(user);
    return {
      title: "👋 Nouvelle inscription",
      description: `**${newUser.name}** vient de créer son compte.`,
      color: DISCORD_COLORS.green,
      fields: [{ name: "Inscrits", value: String(total), inline: true }],
      thumbnail: newUser.image,
    };
  });
}

export function notifyLike(userId: string, articleId: string) {
  notifyDiscord("likes", async () => {
    const [a, name, [{ total }]] = await Promise.all([
      article(articleId),
      userName(userId),
      db.select({ total: count() }).from(likedArticles).where(eq(likedArticles.articleId, articleId)),
    ]);
    if (!a) return null;
    return {
      title: `❤️ ${a.title}`,
      url: `/articles/${a.slug}`,
      description: `**${name}** a aimé cet article.`,
      color: DISCORD_COLORS.red,
      fields: [{ name: "Likes", value: String(total), inline: true }],
      thumbnail: a.imageUrl,
    };
  });
}

export function notifyComment(commentId: string) {
  notifyDiscord("comments", async () => {
    const c = await comment(commentId);
    if (!c) return null;
    const [a, name] = await Promise.all([article(c.articleId), userName(c.userId)]);
    if (!a) return null;
    return {
      title: `💬 Nouveau commentaire sur « ${a.title} »`,
      url: `/articles/${a.slug}#comment-${commentId}`,
      description: `**${c.title}**\n${c.content}`,
      color: DISCORD_COLORS.blue,
      fields: [
        { name: "Auteur", value: name, inline: true },
        { name: "Note", value: `${"★".repeat(c.stars)}${"☆".repeat(5 - c.stars)}`, inline: true },
      ],
    };
  });
}

export function notifyReport(
  commentId: string,
  reason: CommentReportReason,
  reporterId: string,
  total: number,
  autoHidden: boolean,
) {
  notifyDiscord("comments", async () => {
    const c = await comment(commentId);
    if (!c) return null;
    const [a, author, reporter] = await Promise.all([article(c.articleId), userName(c.userId), userName(reporterId)]);
    return {
      title: autoHidden ? "🚫 Commentaire masqué automatiquement" : "🚩 Commentaire signalé",
      url: "/admin/dashboard",
      description: `**${c.title}**\n${c.content}`,
      color: autoHidden ? DISCORD_COLORS.red : DISCORD_COLORS.orange,
      fields: [
        { name: "Motif", value: REASONS[reason], inline: true },
        { name: "Signalements", value: String(total), inline: true },
        { name: "Signalé par", value: reporter, inline: true },
        { name: "Auteur", value: author, inline: true },
        { name: "Article", value: a?.title ?? "—" },
      ],
    };
  });
}
