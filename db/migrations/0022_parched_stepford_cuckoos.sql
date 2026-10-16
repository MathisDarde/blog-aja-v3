CREATE TABLE "club_logo_versions_table" (
	"clubKey" text PRIMARY KEY NOT NULL,
	"nom" text NOT NULL,
	"noms" text[] DEFAULT '{}' NOT NULL,
	"periodes" json DEFAULT '[]'::json NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
