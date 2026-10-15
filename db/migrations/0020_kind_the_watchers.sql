CREATE TYPE "public"."comment_report_reason" AS ENUM('spam', 'insulte', 'hors-sujet', 'autre');--> statement-breakpoint
CREATE TABLE "comment_reports_table" (
	"id_report" text PRIMARY KEY NOT NULL,
	"commentId" text NOT NULL,
	"userId" text NOT NULL,
	"reason" "comment_report_reason" NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "comment_report_unique" UNIQUE("commentId","userId")
);
--> statement-breakpoint
ALTER TABLE "comments_table" ADD COLUMN "hidden" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "comment_reports_table" ADD CONSTRAINT "comment_reports_table_commentId_comments_table_id_comment_fk" FOREIGN KEY ("commentId") REFERENCES "public"."comments_table"("id_comment") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "comment_reports_table" ADD CONSTRAINT "comment_reports_table_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;