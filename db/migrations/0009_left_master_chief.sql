CREATE TABLE "draft_table" (
	"id_article" text PRIMARY KEY NOT NULL,
	"slug" text,
	"imageUrl" text,
	"title" text,
	"teaser" text,
	"content" text,
	"author" text,
	"tags" varchar(255)[],
	"state" "states" DEFAULT 'pending',
	"userId" text NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp NOT NULL,
	CONSTRAINT "draft_table_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
ALTER TABLE "draft_table" ADD CONSTRAINT "draft_table_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;