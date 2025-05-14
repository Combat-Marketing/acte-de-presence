// atlas.hcl
data "external_schema" "gorm" {
  program = [
    "go",
    "run",
    "-mod=mod",
    "./loader",
  ]
}

env "development" {
  src = data.external_schema.gorm.url
  dev = "postgres://postgres:postgres@localhost:5432/websites?sslmode=disable"
  migration {
    dir = "file://migrations"
  }
  format {
    migrate {
      diff = "{{ sql . \"  \" }}"
    }
  }
  schemas = ["public"]
  exclude = ["atlas_schema_revisions"]
}

env "production" {
  src = data.external_schema.gorm.url
  url = "${DATABASE_URL}"
  migration {
    dir = "file://migrations"
  }
  schemas = ["public"]
  exclude = ["atlas_schema_revisions"]
}