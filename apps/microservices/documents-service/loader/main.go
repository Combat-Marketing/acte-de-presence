package main

import (
	"fmt"
	"io"
	"os"

	"acp/microservices/documents-service/internal/models"

	"ariga.io/atlas-provider-gorm/gormschema"
)

func main() {
	// Create a new GORM schema provider for PostgreSQL
	stmts, err := gormschema.New("postgres").Load(
		// List all your model structs here
		&models.Document{},
		&models.Tag{},
		&models.Metadata{},
	)
	if err != nil {
		fmt.Fprintf(os.Stderr, "failed to load GORM schema: %v\n", err)
		os.Exit(1)
	}

	// Output the schema statements to stdout
	io.WriteString(os.Stdout, stmts)
}
