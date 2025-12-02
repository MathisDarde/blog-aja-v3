ALTER TABLE "methode_expert_match_table" ALTER COLUMN "systemeequipe1" SET DEFAULT '4-3-3 Offensif';--> statement-breakpoint
ALTER TABLE "methode_expert_match_table" ALTER COLUMN "systemeequipe2" SET DEFAULT '4-3-3 Offensif';--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "mailArticle" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "public"."methode_expert_match_table" ALTER COLUMN "systemeequipe1" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "public"."methode_expert_match_table" ALTER COLUMN "systemeequipe2" SET DATA TYPE text;--> statement-breakpoint
DROP TYPE "public"."compos";--> statement-breakpoint
CREATE TYPE "public"."compos" AS ENUM('4-3-3 Offensif', '4-3-3 Défensif', '4-2-3-1', '4-4-2', '5-4-1', '3-5-2', '4-1-4-1', '4-5-1');--> statement-breakpoint
ALTER TABLE "public"."methode_expert_match_table" ALTER COLUMN "systemeequipe1" SET DATA TYPE "public"."compos" USING "systemeequipe1"::"public"."compos";--> statement-breakpoint
ALTER TABLE "public"."methode_expert_match_table" ALTER COLUMN "systemeequipe2" SET DATA TYPE "public"."compos" USING "systemeequipe2"::"public"."compos";