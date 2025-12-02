import {
  boolean,
  integer,
  json,
  pgEnum,
  pgTable,
  text,
  timestamp,
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
])

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
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt")
    .notNull()
    .$onUpdate(() => new Date()),
});

export const methodeExpertSaisonTable = pgTable("methode_expert_saison_table", {
  id_methode: text("id_methode").primaryKey(),
  typemethode: text("typemethode").notNull().default("saison"),
  keywords: varchar("keywords", { length: 255 }).array().notNull(),
  saison: text("saison").notNull(),
  imgterrain: text("imgterrain").notNull(),
  coach: text("coach").notNull(),
  systeme: text("systeme").notNull(),
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
  keywords: varchar("keywords", { length: 255 }).array().notNull(),
  titrematch: text("titrematch").notNull(),
  couleur1equipe1: text("couleur1equipe1").notNull(),
  couleur2equipe1: text("couleur2equipe1").notNull(),
  nomequipe1: text("nomequipe1").notNull(),
  systemeequipe1: composEnum().notNull().default("4-3-3 Offensif"),
  couleur1equipe2: text("couleur1equipe2").notNull(),
  couleur2equipe2: text("couleur2equipe2").notNull(),
  nomequipe2: text("nomequipe2").notNull(),
  systemeequipe2: composEnum().notNull().default("4-3-3 Offensif"),
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
  keywords: varchar("keywords", { length: 255 }).array().notNull(),
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
  keywords: varchar("keywords", { length: 255 }).array().notNull(),
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

export const likedArticles = pgTable("likedArticles", {
  id: text("id").primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => user.id),
  articleId: text("articleId")
    .notNull()
    .references(() => articlesTable.id_article),
  likedAt: timestamp("likedAt").notNull().defaultNow(),
});

export const schema = {
  user,
  session,
  account,
  verification,
  articlesTable,
  draftTable,
  commentsTable,
  methodeExpertSaisonTable,
  methodeExpertMatchTable,
  methodeExpertJoueurTable,
  methodeExpertCoachTable,
};

export type SelectUser = typeof user.$inferSelect;

export type SelectPost = typeof articlesTable.$inferSelect;

export type SelectComment = typeof commentsTable.$inferSelect;

export type SelectArticle = typeof articlesTable.$inferSelect;

export type SelectDraft = typeof draftTable.$inferSelect;

export type SelectCoachMethode = typeof methodeExpertCoachTable.$inferSelect;

export type SelectJoueurMethode = typeof methodeExpertJoueurTable.$inferSelect;

export type SelectSaisonMethode = typeof methodeExpertSaisonTable.$inferSelect;

export type SelectMatchMethode = typeof methodeExpertMatchTable.$inferSelect;

export type SelectLikedArticles = typeof likedArticles.$inferSelect;
