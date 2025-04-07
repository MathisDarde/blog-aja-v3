CREATE TABLE "account" (
	"id" text PRIMARY KEY NOT NULL,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"userId" text NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp,
	"refresh_token_expires_at" timestamp,
	"scope" text,
	"password" text,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "articles_table" (
	"id_article" text PRIMARY KEY NOT NULL,
	"image_url" text NOT NULL,
	"title" text NOT NULL,
	"teaser" text NOT NULL,
	"content" text NOT NULL,
	"author" text NOT NULL,
	"tags" varchar(255)[] NOT NULL,
	"userId" text NOT NULL,
	"published_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "comments_table" (
	"id_comment" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"content" text NOT NULL,
	"userId" text NOT NULL,
	"article_id" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "session" (
	"id" text PRIMARY KEY NOT NULL,
	"expires_at" timestamp NOT NULL,
	"token" text NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"userId" text NOT NULL,
	CONSTRAINT "session_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "users_table" (
	"userId" text PRIMARY KEY NOT NULL,
	"pseudo" text NOT NULL,
	"photodeprofil" text,
	"birthday" timestamp NOT NULL,
	"email" text NOT NULL,
	"password" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL,
	"admin" boolean DEFAULT false,
	CONSTRAINT "users_table_pseudo_unique" UNIQUE("pseudo"),
	CONSTRAINT "users_table_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "verification" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp,
	"updated_at" timestamp
);
--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_userId_users_table_userId_fk" FOREIGN KEY ("userId") REFERENCES "public"."users_table"("userId") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "articles_table" ADD CONSTRAINT "articles_table_userId_users_table_userId_fk" FOREIGN KEY ("userId") REFERENCES "public"."users_table"("userId") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "comments_table" ADD CONSTRAINT "comments_table_userId_users_table_userId_fk" FOREIGN KEY ("userId") REFERENCES "public"."users_table"("userId") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "comments_table" ADD CONSTRAINT "comments_table_article_id_articles_table_id_article_fk" FOREIGN KEY ("article_id") REFERENCES "public"."articles_table"("id_article") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_userId_users_table_userId_fk" FOREIGN KEY ("userId") REFERENCES "public"."users_table"("userId") ON DELETE cascade ON UPDATE no action;