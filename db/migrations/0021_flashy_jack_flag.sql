CREATE TABLE "quiz_attempts_table" (
	"id_attempt" text PRIMARY KEY NOT NULL,
	"userId" text,
	"questionIds" text[] NOT NULL,
	"answers" integer[] DEFAULT '{}' NOT NULL,
	"score" integer DEFAULT 0 NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"finishedAt" timestamp
);
--> statement-breakpoint
CREATE TABLE "quiz_questions_table" (
	"id_question" text PRIMARY KEY NOT NULL,
	"question" text NOT NULL,
	"answers" text[] NOT NULL,
	"correctIndex" integer NOT NULL,
	"explanation" text,
	"active" boolean DEFAULT true NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "quiz_attempts_table" ADD CONSTRAINT "quiz_attempts_table_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;