-- Create "websites" table
CREATE TABLE "public"."websites" (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "created_at" timestamptz NULL,
  "updated_at" timestamptz NULL,
  "deleted_at" timestamptz NULL,
  "name" text NOT NULL,
  "domain_name" text NOT NULL,
  PRIMARY KEY ("id")
);
-- Create index "idx_websites_deleted_at" to table: "websites"
CREATE INDEX "idx_websites_deleted_at" ON "public"."websites" ("deleted_at");
-- Create "website_settings" table
CREATE TABLE "public"."website_settings" (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "created_at" timestamptz NULL,
  "updated_at" timestamptz NULL,
  "deleted_at" timestamptz NULL,
  "website_id" uuid NOT NULL,
  "key" text NOT NULL,
  "value" text NOT NULL,
  PRIMARY KEY ("id"),
  CONSTRAINT "fk_websites_website_settings" FOREIGN KEY ("website_id") REFERENCES "public"."websites" ("id") ON UPDATE NO ACTION ON DELETE NO ACTION
);
-- Create index "idx_website_settings_deleted_at" to table: "website_settings"
CREATE INDEX "idx_website_settings_deleted_at" ON "public"."website_settings" ("deleted_at");
