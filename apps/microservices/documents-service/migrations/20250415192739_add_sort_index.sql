-- Modify "documents" table
ALTER TABLE "public"."documents" ADD COLUMN "index" bigint NOT NULL DEFAULT 0;
