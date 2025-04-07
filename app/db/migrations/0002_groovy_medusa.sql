ALTER TABLE "users_table" DROP CONSTRAINT "users_table_pseudo_unique";--> statement-breakpoint
ALTER TABLE "users_table" ADD COLUMN "name" text NOT NULL;--> statement-breakpoint
ALTER TABLE "users_table" DROP COLUMN "pseudo";--> statement-breakpoint
ALTER TABLE "users_table" ADD CONSTRAINT "users_table_name_unique" UNIQUE("name");