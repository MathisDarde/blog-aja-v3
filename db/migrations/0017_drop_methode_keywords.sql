ALTER TABLE "likedArticles" DROP CONSTRAINT "likedArticles_articleId_articles_table_id_article_fk";
--> statement-breakpoint
ALTER TABLE "likedArticles" ADD CONSTRAINT "likedArticles_articleId_articles_table_id_article_fk" FOREIGN KEY ("articleId") REFERENCES "public"."articles_table"("id_article") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "methode_expert_coach_table" DROP COLUMN "keywords";--> statement-breakpoint
ALTER TABLE "methode_expert_joueur_table" DROP COLUMN "keywords";--> statement-breakpoint
ALTER TABLE "methode_expert_match_table" DROP COLUMN "keywords";--> statement-breakpoint
ALTER TABLE "methode_expert_saison_table" DROP COLUMN "keywords";