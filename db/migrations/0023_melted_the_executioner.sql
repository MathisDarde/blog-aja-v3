ALTER TABLE "club_logo_versions_table" ADD COLUMN "origine" text DEFAULT 'manuel' NOT NULL;--> statement-breakpoint
ALTER TABLE "clubs_table" ADD COLUMN "noms" text[] DEFAULT '{}' NOT NULL;--> statement-breakpoint
ALTER TABLE "clubs_table" ADD COLUMN "transfermarktId" text;--> statement-breakpoint
ALTER TABLE "clubs_table" ADD COLUMN "logosVerifiesAt" timestamp;