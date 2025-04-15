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
  dev = "postgres://postgres:postgres@localhost:5432/documents?sslmode=disable"
  migration {
    dir = "file://migrations"
  }
  format {
    migrate {
      diff = "{{ sql . \"  \" }}"
    }
  }
}

env "production" {
  src = data.external_schema.gorm.url
  url = "${DATABASE_URL}"
  migration {
    dir = "file://migrations"
  }
}