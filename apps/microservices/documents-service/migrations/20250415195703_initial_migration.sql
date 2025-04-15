-- Create "documents" table
CREATE TABLE "public"."documents" (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "created_at" timestamptz NULL,
  "updated_at" timestamptz NULL,
  "deleted_at" timestamptz NULL,
  "path" text NULL,
  "key" text NOT NULL,
  "index" bigint NOT NULL DEFAULT 0,
  "document_type" character varying(20) NOT NULL,
  "parent_id" uuid NULL,
  PRIMARY KEY ("id"),
  CONSTRAINT "fk_documents_children" FOREIGN KEY ("parent_id") REFERENCES "public"."documents" ("id") ON UPDATE NO ACTION ON DELETE NO ACTION,
  CONSTRAINT "chk_documents_document_type" CHECK ((document_type)::text = ANY ((ARRAY['FOLDER'::character varying, 'PAGE'::character varying, 'LINK'::character varying, 'SNIPPET'::character varying, 'EMAIL'::character varying])::text[]))
);
-- Create index "idx_documents_deleted_at" to table: "documents"
CREATE INDEX "idx_documents_deleted_at" ON "public"."documents" ("deleted_at");
-- Create index "unq_path_key" to table: "documents"
CREATE UNIQUE INDEX "unq_path_key" ON "public"."documents" ("path", "key");
-- Create "tags" table
CREATE TABLE "public"."tags" (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "created_at" timestamptz NULL,
  "updated_at" timestamptz NULL,
  "deleted_at" timestamptz NULL,
  "name" text NOT NULL,
  PRIMARY KEY ("id"),
  CONSTRAINT "uni_tags_name" UNIQUE ("name")
);
-- Create index "idx_tags_deleted_at" to table: "tags"
CREATE INDEX "idx_tags_deleted_at" ON "public"."tags" ("deleted_at");
-- Create "document_tags" table
CREATE TABLE "public"."document_tags" (
  "tag_id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "document_id" uuid NOT NULL DEFAULT gen_random_uuid(),
  PRIMARY KEY ("tag_id", "document_id"),
  CONSTRAINT "fk_document_tags_document" FOREIGN KEY ("document_id") REFERENCES "public"."documents" ("id") ON UPDATE NO ACTION ON DELETE NO ACTION,
  CONSTRAINT "fk_document_tags_tag" FOREIGN KEY ("tag_id") REFERENCES "public"."tags" ("id") ON UPDATE NO ACTION ON DELETE NO ACTION
);
-- Create "metadata" table
CREATE TABLE "public"."metadata" (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "created_at" timestamptz NULL,
  "updated_at" timestamptz NULL,
  "deleted_at" timestamptz NULL,
  "document_id" uuid NOT NULL,
  "key" text NOT NULL,
  "value" text NOT NULL,
  PRIMARY KEY ("id"),
  CONSTRAINT "fk_documents_metadata" FOREIGN KEY ("document_id") REFERENCES "public"."documents" ("id") ON UPDATE NO ACTION ON DELETE NO ACTION
);
-- Create index "idx_metadata_deleted_at" to table: "metadata"
CREATE INDEX "idx_metadata_deleted_at" ON "public"."metadata" ("deleted_at");
