CREATE TYPE "public"."compos" AS ENUM('4-3-3 (Défensif)', '4-3-3 (Offensif)', '4-2-3-1', '4-4-2', '5-4-1', '4-1-4-1', '4-5-1');--> statement-breakpoint
ALTER TABLE "methode_expert_match_table" ALTER COLUMN "systemeequipe1" SET DATA TYPE compos;--> statement-breakpoint
ALTER TABLE "methode_expert_match_table" ALTER COLUMN "systemeequipe1" SET DEFAULT '4-3-3 (Offensif)';--> statement-breakpoint
ALTER TABLE "methode_expert_match_table" ALTER COLUMN "systemeequipe2" SET DATA TYPE compos;--> statement-breakpoint
ALTER TABLE "methode_expert_match_table" ALTER COLUMN "systemeequipe2" SET DEFAULT '4-3-3 (Offensif)';--> statement-breakpoint
ALTER TABLE "methode_expert_match_table" ADD COLUMN "titulairesequipe1" json NOT NULL;--> statement-breakpoint
ALTER TABLE "methode_expert_match_table" ADD COLUMN "titulairesequipe2" json NOT NULL;--> statement-breakpoint
ALTER TABLE "methode_expert_match_table" DROP COLUMN "imgterrain";