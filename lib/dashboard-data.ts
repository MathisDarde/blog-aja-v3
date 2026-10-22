// Données du dashboard admin, lues côté serveur en une fois et en parallèle : seulement les
// colonnes affichées (ni le contenu des articles, ni les compositions des méthodes).

import { count, desc, eq, sql } from "drizzle-orm";
import { db } from "@/db/db";
import {
  articlesTable,
  commentReportsTable,
  CommentReportReason,
  commentsTable,
  draftTable,
  methodeExpertCoachTable,
  methodeExpertJoueurTable,
  methodeExpertMatchTable,
  methodeExpertSaisonTable,
  user,
} from "@/db/schema";
import { requireAdmin } from "@/lib/auth-guard";
import { methodeUrl, MethodeType, shortDate } from "@/lib/methodes";

export interface DashboardUser {
  id: string;
  name: string;
  email: string;
  image: string | null;
  admin: boolean;
  createdAt: Date;
}

export interface DashboardArticle {
  id_article: string;
  slug: string;
  title: string;
  teaser: string;
  author: string;
  imageUrl: string;
  tags: string[];
  state: "pending" | "published" | "archived";
  createdAt: Date;
  updatedAt: Date;
}

export interface DashboardDraft {
  id_draft: string;
  title: string;
  teaser: string;
  author: string;
  imageUrl: string | null;
  tags: string[];
  scheduledAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface DashboardMethode {
  id_methode: string;
  typemethode: MethodeType;
  name: string;
  // Poste d'un joueur, date d'un match, coach d'une saison
  details: string;
  image: string | null;
  url: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface DashboardComment {
  id_comment: string;
  title: string;
  content: string;
  stars: number;
  pseudo: string;
  hidden: boolean;
  reportsCount: number;
  reportReasons: CommentReportReason[];
  articleTitle: string;
  articleSlug: string;
  createdAt: Date;
}

export interface DashboardData {
  users: DashboardUser[];
  articles: DashboardArticle[];
  drafts: DashboardDraft[];
  methodes: DashboardMethode[];
  comments: DashboardComment[];
}

const methode = (
  m: { id_methode: string; slug: string | null; createdAt: Date; updatedAt: Date },
  typemethode: MethodeType,
  name: string,
  details: string,
  image: string | null = null,
): DashboardMethode => ({
  id_methode: m.id_methode,
  typemethode,
  name,
  details,
  image: image || null,
  url: methodeUrl({ typemethode, slug: m.slug }),
  createdAt: m.createdAt,
  updatedAt: m.updatedAt,
});

const base = <T extends typeof methodeExpertCoachTable | typeof methodeExpertJoueurTable | typeof methodeExpertMatchTable | typeof methodeExpertSaisonTable>(
  table: T,
) => ({
  id_methode: table.id_methode,
  slug: table.slug,
  createdAt: table.createdAt,
  updatedAt: table.updatedAt,
});

export async function getDashboardData(): Promise<DashboardData> {
  await requireAdmin();

  const [users, articles, drafts, joueurs, coachs, matchs, saisons, comments, reports] = await Promise.all([
    db
      .select({
        id: user.id,
        name: user.name,
        email: user.email,
        image: user.image,
        admin: user.admin,
        createdAt: user.createdAt,
      })
      .from(user)
      .orderBy(desc(user.createdAt)),
    db
      .select({
        id_article: articlesTable.id_article,
        slug: articlesTable.slug,
        title: articlesTable.title,
        teaser: articlesTable.teaser,
        author: articlesTable.author,
        imageUrl: articlesTable.imageUrl,
        tags: articlesTable.tags,
        state: articlesTable.state,
        createdAt: articlesTable.createdAt,
        updatedAt: articlesTable.updatedAt,
      })
      .from(articlesTable)
      .orderBy(desc(articlesTable.createdAt)),
    db
      .select({
        id_draft: draftTable.id_draft,
        title: draftTable.title,
        teaser: draftTable.teaser,
        author: draftTable.author,
        imageUrl: draftTable.imageUrl,
        tags: draftTable.tags,
        scheduledAt: draftTable.scheduledAt,
        createdAt: draftTable.createdAt,
        updatedAt: draftTable.updatedAt,
      })
      .from(draftTable)
      .where(eq(draftTable.state, "pending"))
      .orderBy(desc(draftTable.updatedAt)),
    db
      .select({
        ...base(methodeExpertJoueurTable),
        name: methodeExpertJoueurTable.joueurnom,
        poste: methodeExpertJoueurTable.poste,
        image: methodeExpertJoueurTable.imagejoueur,
      })
      .from(methodeExpertJoueurTable),
    db
      .select({
        ...base(methodeExpertCoachTable),
        name: methodeExpertCoachTable.nomcoach,
        image: methodeExpertCoachTable.imagecoach,
      })
      .from(methodeExpertCoachTable),
    db
      .select({
        ...base(methodeExpertMatchTable),
        name: methodeExpertMatchTable.titrematch,
        date: methodeExpertMatchTable.date,
      })
      .from(methodeExpertMatchTable),
    db
      .select({
        ...base(methodeExpertSaisonTable),
        name: methodeExpertSaisonTable.saison,
        coach: methodeExpertSaisonTable.coach,
      })
      .from(methodeExpertSaisonTable),
    db
      .select({
        id_comment: commentsTable.id_comment,
        title: commentsTable.title,
        content: commentsTable.content,
        stars: commentsTable.stars,
        pseudo: user.name,
        hidden: commentsTable.hidden,
        articleTitle: articlesTable.title,
        articleSlug: articlesTable.slug,
        createdAt: commentsTable.createdAt,
      })
      .from(commentsTable)
      .innerJoin(user, eq(commentsTable.userId, user.id))
      .innerJoin(articlesTable, eq(commentsTable.articleId, articlesTable.id_article))
      .orderBy(desc(commentsTable.createdAt)),
    db
      .select({
        commentId: commentReportsTable.commentId,
        count: count(),
        reasons: sql<CommentReportReason[]>`array_agg(distinct ${commentReportsTable.reason})::text[]`,
      })
      .from(commentReportsTable)
      .groupBy(commentReportsTable.commentId),
  ]);

  const reportsByComment = new Map(reports.map((r) => [r.commentId, r]));

  return {
    users: users.map((u) => ({ ...u, admin: u.admin === true })),
    articles: articles.map((a) => ({ ...a, tags: a.tags ?? [], state: a.state ?? "pending" })),
    drafts: drafts.map((d) => ({
      ...d,
      title: d.title ?? "",
      teaser: d.teaser ?? "",
      author: d.author ?? "",
      tags: d.tags ?? [],
    })),
    methodes: [
      ...joueurs.map((m) => methode(m, "joueur", m.name, m.poste, m.image)),
      ...coachs.map((m) => methode(m, "coach", m.name, "Entraîneur", m.image)),
      ...matchs.map((m) => methode(m, "match", m.name, shortDate(m.date))),
      ...saisons.map((m) => methode(m, "saison", `Saison ${m.name}`, m.coach)),
    ].sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime()),
    comments: comments.map((c) => ({
      ...c,
      reportsCount: reportsByComment.get(c.id_comment)?.count ?? 0,
      reportReasons: reportsByComment.get(c.id_comment)?.reasons ?? [],
    })),
  };
}
