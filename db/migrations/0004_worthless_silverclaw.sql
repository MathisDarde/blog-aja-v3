CREATE TYPE "public"."states" AS ENUM('pending', 'published', 'archived');--> statement-breakpoint
CREATE TABLE "likedArticles" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"articleId" text NOT NULL,
	"likedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "methode_expert_coach_table" (
	"id_methode" text PRIMARY KEY NOT NULL,
	"typemethode" text DEFAULT 'coach' NOT NULL,
	"keywords" varchar(255)[] NOT NULL,
	"imagecoach" text NOT NULL,
	"nomcoach" text NOT NULL,
	"clubscoach" json NOT NULL,
	"palmares" json NOT NULL,
	"statistiques" text NOT NULL,
	"userId" text NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "methode_expert_joueur_table" (
	"id_methode" text PRIMARY KEY NOT NULL,
	"typemethode" text DEFAULT 'joueur' NOT NULL,
	"keywords" varchar(255)[] NOT NULL,
	"imagejoueur" text NOT NULL,
	"joueurnom" text NOT NULL,
	"poste" text NOT NULL,
	"taille" text NOT NULL,
	"piedfort" text NOT NULL,
	"clubs" json NOT NULL,
	"matchs" text NOT NULL,
	"buts" text NOT NULL,
	"passesd" text NOT NULL,
	"userId" text NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "methode_expert_match_table" (
	"id_methode" text PRIMARY KEY NOT NULL,
	"typemethode" text DEFAULT 'match' NOT NULL,
	"keywords" varchar(255)[] NOT NULL,
	"titrematch" text NOT NULL,
	"imgterrain" text NOT NULL,
	"couleur1equipe1" text NOT NULL,
	"couleur2equipe1" text NOT NULL,
	"nomequipe1" text NOT NULL,
	"systemeequipe1" text NOT NULL,
	"couleur1equipe2" text NOT NULL,
	"couleur2equipe2" text NOT NULL,
	"nomequipe2" text NOT NULL,
	"systemeequipe2" text NOT NULL,
	"remplacantsequipe1" json NOT NULL,
	"remplacantsequipe2" json NOT NULL,
	"stade" text NOT NULL,
	"date" text NOT NULL,
	"userId" text NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "methode_expert_saison_table" (
	"id_methode" text PRIMARY KEY NOT NULL,
	"typemethode" text DEFAULT 'saison' NOT NULL,
	"keywords" varchar(255)[] NOT NULL,
	"saison" text NOT NULL,
	"imgterrain" text NOT NULL,
	"coach" text NOT NULL,
	"systeme" text NOT NULL,
	"remplacants" json NOT NULL,
	"userId" text NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp NOT NULL
);
--> statement-breakpoint
ALTER TABLE "comments_table" DROP CONSTRAINT "comments_table_article_id_articles_table_id_article_fk";
--> statement-breakpoint
ALTER TABLE "articles_table" ADD COLUMN "imageUrl" text NOT NULL;--> statement-breakpoint
ALTER TABLE "articles_table" ADD COLUMN "state" "states" DEFAULT 'pending' NOT NULL;--> statement-breakpoint
ALTER TABLE "articles_table" ADD COLUMN "createdAt" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "articles_table" ADD COLUMN "updatedAt" timestamp NOT NULL;--> statement-breakpoint
ALTER TABLE "comments_table" ADD COLUMN "stars" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "comments_table" ADD COLUMN "articleId" text NOT NULL;--> statement-breakpoint
ALTER TABLE "comments_table" ADD COLUMN "createdAt" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "comments_table" ADD COLUMN "updatedAt" timestamp NOT NULL;--> statement-breakpoint
ALTER TABLE "users_table" ADD COLUMN "image" text;--> statement-breakpoint
ALTER TABLE "users_table" ADD COLUMN "createdAt" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "users_table" ADD COLUMN "updatedAt" timestamp NOT NULL;--> statement-breakpoint
ALTER TABLE "likedArticles" ADD CONSTRAINT "likedArticles_userId_users_table_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users_table"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "likedArticles" ADD CONSTRAINT "likedArticles_articleId_articles_table_id_article_fk" FOREIGN KEY ("articleId") REFERENCES "public"."articles_table"("id_article") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "methode_expert_coach_table" ADD CONSTRAINT "methode_expert_coach_table_userId_users_table_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users_table"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "methode_expert_joueur_table" ADD CONSTRAINT "methode_expert_joueur_table_userId_users_table_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users_table"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "methode_expert_match_table" ADD CONSTRAINT "methode_expert_match_table_userId_users_table_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users_table"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "methode_expert_saison_table" ADD CONSTRAINT "methode_expert_saison_table_userId_users_table_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users_table"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "comments_table" ADD CONSTRAINT "comments_table_articleId_articles_table_id_article_fk" FOREIGN KEY ("articleId") REFERENCES "public"."articles_table"("id_article") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "articles_table" DROP COLUMN "image_url";--> statement-breakpoint
ALTER TABLE "articles_table" DROP COLUMN "published_at";--> statement-breakpoint
ALTER TABLE "articles_table" DROP COLUMN "updated_at";--> statement-breakpoint
ALTER TABLE "comments_table" DROP COLUMN "article_id";--> statement-breakpoint
ALTER TABLE "comments_table" DROP COLUMN "created_at";--> statement-breakpoint
ALTER TABLE "comments_table" DROP COLUMN "updated_at";--> statement-breakpoint
ALTER TABLE "users_table" DROP COLUMN "photodeprofil";--> statement-breakpoint
ALTER TABLE "users_table" DROP COLUMN "password";--> statement-breakpoint
ALTER TABLE "users_table" DROP COLUMN "created_at";--> statement-breakpoint
ALTER TABLE "users_table" DROP COLUMN "updated_at";