-- Modify "documents" table
ALTER TABLE "public"."documents" DROP CONSTRAINT "uni_documents_key", DROP CONSTRAINT "uni_documents_path";
-- Create index "unq_path_key" to table: "documents"
CREATE UNIQUE INDEX "unq_path_key" ON "public"."documents" ("path", "key");
