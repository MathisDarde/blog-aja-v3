ALTER TABLE "user" ALTER COLUMN "email_verified" SET DATA TYPE boolean;--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "email_verified" SET DEFAULT false;--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "email_verified" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "articles_table" ADD COLUMN "slug" text NOT NULL;--> statement-breakpoint
ALTER TABLE "articles_table" ADD CONSTRAINT "articles_table_slug_unique" UNIQUE("slug");