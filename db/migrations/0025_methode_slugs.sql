ALTER TABLE "methode_expert_coach_table" ADD COLUMN "slug" text;--> statement-breakpoint
ALTER TABLE "methode_expert_joueur_table" ADD COLUMN "slug" text;--> statement-breakpoint
ALTER TABLE "methode_expert_match_table" ADD COLUMN "slug" text;--> statement-breakpoint
ALTER TABLE "methode_expert_saison_table" ADD COLUMN "slug" text;--> statement-breakpoint
ALTER TABLE "methode_expert_coach_table" ADD CONSTRAINT "methode_expert_coach_table_slug_unique" UNIQUE("slug");--> statement-breakpoint
ALTER TABLE "methode_expert_joueur_table" ADD CONSTRAINT "methode_expert_joueur_table_slug_unique" UNIQUE("slug");--> statement-breakpoint
ALTER TABLE "methode_expert_match_table" ADD CONSTRAINT "methode_expert_match_table_slug_unique" UNIQUE("slug");--> statement-breakpoint
ALTER TABLE "methode_expert_saison_table" ADD CONSTRAINT "methode_expert_saison_table_slug_unique" UNIQUE("slug");