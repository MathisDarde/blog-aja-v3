ALTER TABLE "methode_expert_match_table" ADD COLUMN "abreviationequipe1" text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE "methode_expert_match_table" ADD COLUMN "abreviationequipe2" text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE "methode_expert_match_table" ADD COLUMN "scoreequipe1" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "methode_expert_match_table" ADD COLUMN "scoreequipe2" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "methode_expert_match_table" ADD COLUMN "tabequipe1" integer;--> statement-breakpoint
ALTER TABLE "methode_expert_match_table" ADD COLUMN "tabequipe2" integer;--> statement-breakpoint
ALTER TABLE "methode_expert_match_table" ADD COLUMN "prolongation" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "methode_expert_match_table" ADD COLUMN "logoequipe1" text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE "methode_expert_match_table" ADD COLUMN "logoequipe2" text DEFAULT '' NOT NULL;--> statement-breakpoint
-- Conversion des titres saisis à la main (« AJA 2 - 0 BVB (5 à 6 tab) ») en champs séparés.
-- Un titre qui ne suit pas ce format garde ses valeurs par défaut et reste tel quel.
UPDATE "methode_expert_match_table" AS m
SET
  "abreviationequipe1" = parsed.core[1],
  "scoreequipe1" = parsed.core[2]::integer,
  "scoreequipe2" = parsed.core[3]::integer,
  "abreviationequipe2" = parsed.core[4],
  "tabequipe1" = parsed.tab[1]::integer,
  "tabequipe2" = parsed.tab[2]::integer
FROM (
  SELECT
    "id_methode",
    regexp_match(
      regexp_replace("titrematch", '\s*\(.*\)\s*$', ''),
      '^\s*(.*\S)\s+(\d+)\s*-\s*(\d+)\s+(\S.*\S|\S)\s*$'
    ) AS core,
    regexp_match("titrematch", '\((\d+)\s*(?:-|à)\s*(\d+)\s*tab\)') AS tab
  FROM "methode_expert_match_table"
) AS parsed
WHERE m."id_methode" = parsed."id_methode" AND parsed.core IS NOT NULL;
--> statement-breakpoint
-- Abréviations harmonisées
UPDATE "methode_expert_match_table" SET "abreviationequipe1" = 'AJA' WHERE "abreviationequipe1" <> '' AND "nomequipe1" ILIKE '%auxerre%';--> statement-breakpoint
UPDATE "methode_expert_match_table" SET "abreviationequipe2" = 'AJA' WHERE "abreviationequipe2" <> '' AND "nomequipe2" ILIKE '%auxerre%';--> statement-breakpoint
UPDATE "methode_expert_match_table" SET "abreviationequipe1" = 'AJAX' WHERE "abreviationequipe1" <> '' AND "nomequipe1" ILIKE '%ajax%';--> statement-breakpoint
UPDATE "methode_expert_match_table" SET "abreviationequipe2" = 'AJAX' WHERE "abreviationequipe2" <> '' AND "nomequipe2" ILIKE '%ajax%';--> statement-breakpoint
UPDATE "methode_expert_match_table" SET "abreviationequipe1" = 'FCSM' WHERE "abreviationequipe1" <> '' AND "nomequipe1" ILIKE '%sochaux%';--> statement-breakpoint
UPDATE "methode_expert_match_table" SET "abreviationequipe2" = 'FCSM' WHERE "abreviationequipe2" <> '' AND "nomequipe2" ILIKE '%sochaux%';--> statement-breakpoint
-- Titres reconstruits au format unique (même règle que buildMatchTitle)
UPDATE "methode_expert_match_table"
SET "titrematch" =
  "abreviationequipe1" || ' ' || "scoreequipe1" || ' - ' || "scoreequipe2" || ' ' || "abreviationequipe2"
  || CASE
    WHEN "tabequipe1" IS NOT NULL AND "tabequipe2" IS NOT NULL
      THEN ' (' || "tabequipe1" || ' - ' || "tabequipe2" || ' tab)'
    ELSE ''
  END
WHERE "abreviationequipe1" <> '' AND "abreviationequipe2" <> '';
