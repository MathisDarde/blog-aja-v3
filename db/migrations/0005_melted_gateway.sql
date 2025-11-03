ALTER TABLE "users_table" RENAME TO "user";--> statement-breakpoint
ALTER TABLE "user" DROP CONSTRAINT "users_table_name_unique";--> statement-breakpoint
ALTER TABLE "user" DROP CONSTRAINT "users_table_email_unique";--> statement-breakpoint
ALTER TABLE "account" DROP CONSTRAINT "account_userId_users_table_id_fk";
--> statement-breakpoint
ALTER TABLE "articles_table" DROP CONSTRAINT "articles_table_userId_users_table_id_fk";
--> statement-breakpoint
ALTER TABLE "comments_table" DROP CONSTRAINT "comments_table_userId_users_table_id_fk";
--> statement-breakpoint
ALTER TABLE "likedArticles" DROP CONSTRAINT "likedArticles_userId_users_table_id_fk";
--> statement-breakpoint
ALTER TABLE "methode_expert_coach_table" DROP CONSTRAINT "methode_expert_coach_table_userId_users_table_id_fk";
--> statement-breakpoint
ALTER TABLE "methode_expert_joueur_table" DROP CONSTRAINT "methode_expert_joueur_table_userId_users_table_id_fk";
--> statement-breakpoint
ALTER TABLE "methode_expert_match_table" DROP CONSTRAINT "methode_expert_match_table_userId_users_table_id_fk";
--> statement-breakpoint
ALTER TABLE "methode_expert_saison_table" DROP CONSTRAINT "methode_expert_saison_table_userId_users_table_id_fk";
--> statement-breakpoint
ALTER TABLE "session" DROP CONSTRAINT "session_userId_users_table_id_fk";
--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "articles_table" ADD CONSTRAINT "articles_table_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "comments_table" ADD CONSTRAINT "comments_table_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "likedArticles" ADD CONSTRAINT "likedArticles_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "methode_expert_coach_table" ADD CONSTRAINT "methode_expert_coach_table_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "methode_expert_joueur_table" ADD CONSTRAINT "methode_expert_joueur_table_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "methode_expert_match_table" ADD CONSTRAINT "methode_expert_match_table_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "methode_expert_saison_table" ADD CONSTRAINT "methode_expert_saison_table_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user" ADD CONSTRAINT "user_name_unique" UNIQUE("name");--> statement-breakpoint
ALTER TABLE "user" ADD CONSTRAINT "user_email_unique" UNIQUE("email");