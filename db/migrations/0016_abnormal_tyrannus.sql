ALTER TABLE "methode_expert_saison_table" ALTER COLUMN "systeme" SET DATA TYPE compos;--> statement-breakpoint
ALTER TABLE "methode_expert_saison_table" ALTER COLUMN "systeme" SET DEFAULT '4-2-3-1';--> statement-breakpoint
ALTER TABLE "methode_expert_saison_table" ADD COLUMN "titulaires" json NOT NULL;--> statement-breakpoint
ALTER TABLE "methode_expert_saison_table" DROP COLUMN "imgterrain";