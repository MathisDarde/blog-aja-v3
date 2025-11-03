ALTER TABLE "user" ALTER COLUMN "email_verified" SET DATA TYPE timestamp;--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "email_verified" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "email_verified" DROP NOT NULL;