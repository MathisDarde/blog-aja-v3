import {
  boolean,
  integer,
  json,
  pgEnum,
  pgTable,
  text,
  timestamp,
  unique,
  varchar,
} from "drizzle-orm/pg-core";

export const statesEnum = pgEnum("states", [
  "pending",
  "published",
  "archived",
]);

export const composEnum = pgEnum("compos", [
  "4-3-3 Offensif",
  "4-3-3 Défensif",
  "4-2-3-1",
  "4-4-2",
  "5-4-1",
  "3-5-2",
  "4-1-4-1",
  "4-5-1",
  "4-4-1-1",
  "5-3-2",
  "3-4-3",
  "4-2-4",
  "4-3-1-2",
]);

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull().unique(),
  image: text("image"),
  birthday: timestamp("birthday"),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").notNull().default(false),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt")
    .notNull()
    .$onUpdate(() => new Date()),
  admin: boolean("admin").default(false),
  mailArticle: boolean("mailArticle").default(false),
});

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("userId")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("userId")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at"),
  updatedAt: timestamp("updated_at"),
});

export const articlesTable = pgTable("articles_table", {
  id_article: text("id_article").primaryKey(),
  slug: text("slug").notNull().unique(),
  imageUrl: text("imageUrl").notNull(),
  title: text("title").notNull(),
  teaser: text("teaser").notNull(),
  content: text("content").notNull(),
  author: text("author").notNull(),
  tags: varchar("tags", { length: 255 }).array().notNull(),
  state: statesEnum().notNull().default("pending"),
  userId: text("userId")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt")
    .notNull()
    .$onUpdate(() => new Date()),
});

export const draftTable = pgTable("draft_table", {
  id_draft: text("id_draft").primaryKey(),
  slug: text("slug").unique(),
  imageUrl: text("imageUrl"),
  title: text("title"),
  teaser: text("teaser"),
  content: text("content"),
  author: text("author"),
  tags: varchar("tags", { length: 255 }).array(),
  state: statesEnum().default("pending").notNull(),
  userId: text("userId")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt")
    .notNull()
    .$onUpdate(() => new Date()),
});

export const commentsTable = pgTable("comments_table", {
  id_comment: text("id_comment").primaryKey(),
  stars: integer("stars").notNull(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  userId: text("userId")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  articleId: text("articleId")
    .notNull()
    .references(() => articlesTable.id_article, { onDelete: "cascade" }),
  // Masqué par un admin, ou automatiquement après COMMENT_REPORTS_AUTO_HIDE signalements
  hidden: boolean("hidden").notNull().default(false),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt")
    .notNull()
    .$onUpdate(() => new Date()),
});

export const commentReportReasonEnum = pgEnum("comment_report_reason", [
  "spam",
  "insulte",
  "hors-sujet",
  "autre",
]);

// Un signalement par utilisateur et par commentaire ; supprimés quand un admin tranche
export const commentReportsTable = pgTable(
  "comment_reports_table",
  {
    id_report: text("id_report").primaryKey(),
    commentId: text("commentId")
      .notNull()
      .references(() => commentsTable.id_comment, { onDelete: "cascade" }),
    userId: text("userId")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    reason: commentReportReasonEnum("reason").notNull(),
    createdAt: timestamp("createdAt").notNull().defaultNow(),
  },
  (table) => [unique("comment_report_unique").on(table.commentId, table.userId)],
);

export const methodeExpertSaisonTable = pgTable("methode_expert_saison_table", {
  id_methode: text("id_methode").primaryKey(),
  typemethode: text("typemethode").notNull().default("saison"),
  saison: text("saison").notNull(),
  coach: text("coach").notNull(),
  systeme: composEnum().notNull().default("4-2-3-1"),
  titulaires: json("titulaires").notNull(),
  remplacants: json("remplacants").notNull(),
  userId: text("userId")
    .notNull()
    .references(() => user.id),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt")
    .notNull()
    .$onUpdate(() => new Date()),
});

export const methodeExpertMatchTable = pgTable("methode_expert_match_table", {
  id_methode: text("id_methode").primaryKey(),
  typemethode: text("typemethode").notNull().default("match"),
  // Construit à l'enregistrement depuis les champs ci-dessous (lib/methode-match-form)
  titrematch: text("titrematch").notNull(),
  abreviationequipe1: text("abreviationequipe1").notNull().default(""),
  abreviationequipe2: text("abreviationequipe2").notNull().default(""),
  scoreequipe1: integer("scoreequipe1").notNull().default(0),
  scoreequipe2: integer("scoreequipe2").notNull().default(0),
  // Tirs au but : null quand le match ne s'est pas joué aux tirs au but
  tabequipe1: integer("tabequipe1"),
  tabequipe2: integer("tabequipe2"),
  prolongation: boolean("prolongation").notNull().default(false),
  // Vide : logo d'époque calculé à l'affichage (lib/team-logos)
  logoequipe1: text("logoequipe1").notNull().default(""),
  logoequipe2: text("logoequipe2").notNull().default(""),
  couleur1equipe1: text("couleur1equipe1").notNull(),
  couleur2equipe1: text("couleur2equipe1").notNull(),
  nomequipe1: text("nomequipe1").notNull(),
  systemeequipe1: composEnum().notNull().default("4-2-3-1"),
  couleur1equipe2: text("couleur1equipe2").notNull(),
  couleur2equipe2: text("couleur2equipe2").notNull(),
  nomequipe2: text("nomequipe2").notNull(),
  systemeequipe2: composEnum().notNull().default("4-2-3-1"),
  titulairesequipe1: json("titulairesequipe1").notNull(),
  titulairesequipe2: json("titulairesequipe2").notNull(),
  remplacantsequipe1: json("remplacantsequipe1").notNull(),
  remplacantsequipe2: json("remplacantsequipe2").notNull(),
  stade: text("stade").notNull(),
  date: text("date").notNull(),
  userId: text("userId")
    .notNull()
    .references(() => user.id),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt")
    .notNull()
    .$onUpdate(() => new Date()),
});

export const methodeExpertJoueurTable = pgTable("methode_expert_joueur_table", {
  id_methode: text("id_methode").primaryKey(),
  typemethode: text("typemethode").notNull().default("joueur"),
  imagejoueur: text("imagejoueur").notNull(),
  joueurnom: text("joueurnom").notNull(),
  poste: text("poste").notNull(),
  taille: text("taille").notNull(),
  piedfort: text("piedfort").notNull(),
  clubs: json("clubs").notNull(),
  matchs: text("matchs").notNull(),
  buts: text("buts").notNull(),
  passesd: text("passesd").notNull(),
  userId: text("userId")
    .notNull()
    .references(() => user.id),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt")
    .notNull()
    .$onUpdate(() => new Date()),
});

export const methodeExpertCoachTable = pgTable("methode_expert_coach_table", {
  id_methode: text("id_methode").primaryKey(),
  typemethode: text("typemethode").notNull().default("coach"),
  imagecoach: text("imagecoach").notNull(),
  nomcoach: text("nomcoach").notNull(),
  clubscoach: json("clubscoach").notNull(),
  palmares: json("palmares").notNull(),
  statistiques: text("statistiques").notNull(),
  userId: text("userId")
    .notNull()
    .references(() => user.id),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt")
    .notNull()
    .$onUpdate(() => new Date()),
});

// Questions du quiz : la bonne réponse ne quitte jamais le serveur avant que le joueur ait répondu
export const quizQuestionsTable = pgTable("quiz_questions_table", {
  id_question: text("id_question").primaryKey(),
  question: text("question").notNull(),
  answers: text("answers").array().notNull(),
  correctIndex: integer("correctIndex").notNull(),
  // Affichée après la réponse
  explanation: text("explanation"),
  // Une question désactivée n'est plus tirée au sort
  active: boolean("active").notNull().default(true),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

// Une partie : questions tirées au sort, réponses données dans l'ordre, score calculé côté serveur.
// userId est vide pour un visiteur non connecté (partie jouable, mais hors classement).
export const quizAttemptsTable = pgTable("quiz_attempts_table", {
  id_attempt: text("id_attempt").primaryKey(),
  userId: text("userId").references(() => user.id, { onDelete: "cascade" }),
  questionIds: text("questionIds").array().notNull(),
  answers: integer("answers").array().notNull().default([]),
  score: integer("score").notNull().default(0),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  finishedAt: timestamp("finishedAt"),
});

export const likedArticles = pgTable("likedArticles", {
  id: text("id").primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => user.id),
  articleId: text("articleId")
    .notNull()
    .references(() => articlesTable.id_article, { onDelete: "cascade" }),
  likedAt: timestamp("likedAt").notNull().defaultNow(),
});

// Bibliothèque de logos : un club → son logo (local ou Cloudinary).
// Alimentée à l'import Wikidata et à l'enregistrement des méthodes.
export const clubsTable = pgTable("clubs_table", {
  // Identifiant Wikidata du club, ou « nom:<nom-normalisé> » pour un club qui n'en a pas
  wikidataId: text("wikidataId").primaryKey(),
  nom: text("nom").notNull(),
  logoUrl: text("logoUrl").notNull(),
  // Autres noms du club (graphies des méthodes : « Zenit St. Pétersbourg »…)
  noms: text("noms").array().notNull().default([]),
  // Identifiant Transfermarkt (Wikidata P7223) : le même club que celui du registre des scrapers
  transfermarktId: text("transfermarktId"),
  // Logos d'époque cherchés sur Wikipédia (lib/club-logo-sync), même sans résultat
  logosVerifiesAt: timestamp("logosVerifiesAt"),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

// Logos d'époque des clubs gérés par le blog (/admin/logos) : saisis à la main, ou lus sur
// Wikipédia pour les clubs absents du registre des scrapers. Pour un club du registre, ils
// remplacent ceux des scrapers. Clé : identifiant Transfermarkt (registre), sinon celle de la
// bibliothèque (clubs_table : Wikidata ou « nom:<nom-normalisé> »).
export const clubLogoVersionsTable = pgTable("club_logo_versions_table", {
  // Identifiant Transfermarkt du club (registre des scrapers), ou « nom:<nom-normalisé> »
  clubKey: text("clubKey").primaryKey(),
  nom: text("nom").notNull(),
  // Autres noms sous lesquels le club est reconnu (méthodes, classements…)
  noms: text("noms").array().notNull().default([]),
  // [{ legende, de, a, logo }] : de / a = années de début de saison incluses, null = sans limite
  periodes: json("periodes").notNull().default([]),
  // « wikipedia » : lus automatiquement (relus si besoin) ; « manuel » : saisis dans l'admin, jamais écrasés
  origine: text("origine").notNull().default("manuel"),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const schema = {
  user,
  session,
  account,
  verification,
  articlesTable,
  draftTable,
  commentsTable,
  commentReportsTable,
  methodeExpertSaisonTable,
  methodeExpertMatchTable,
  methodeExpertJoueurTable,
  methodeExpertCoachTable,
  clubsTable,
  clubLogoVersionsTable,
  quizQuestionsTable,
  quizAttemptsTable,
};

export type SelectUser = typeof user.$inferSelect;

export type SelectPost = typeof articlesTable.$inferSelect;

export type SelectComment = typeof commentsTable.$inferSelect;

export type CommentReportReason = (typeof commentReportReasonEnum.enumValues)[number];

export type SelectArticle = typeof articlesTable.$inferSelect;

export type SelectDraft = typeof draftTable.$inferSelect;

export type SelectCoachMethode = typeof methodeExpertCoachTable.$inferSelect;

export type SelectJoueurMethode = typeof methodeExpertJoueurTable.$inferSelect;

export type SelectSaisonMethode = typeof methodeExpertSaisonTable.$inferSelect;

export type SelectMatchMethode = typeof methodeExpertMatchTable.$inferSelect;

export type SelectLikedArticles = typeof likedArticles.$inferSelect;
export type SelectClub = typeof clubsTable.$inferSelect;
export type SelectQuizQuestion = typeof quizQuestionsTable.$inferSelect;
