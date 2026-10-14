CREATE TABLE "clubs_table" (
	"wikidataId" text PRIMARY KEY NOT NULL,
	"nom" text NOT NULL,
	"logoUrl" text NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
