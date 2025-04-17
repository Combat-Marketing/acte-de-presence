package database

import (
	"acp/microservices/websites-service/internal/models"
	"fmt"
	"log"

	_ "ariga.io/atlas-provider-gorm/gormschema"
	"gorm.io/gorm"
)

// RunMigrations executes database migrations
func RunMigrations(db *gorm.DB) error {
	log.Println("Running database migrations...")

	// Auto migrate the schemas
	err := db.AutoMigrate(
		&models.Website{},
		&models.WebsiteSetting{},
	)

	if err != nil {
		return fmt.Errorf("failed to run migrations: %w", err)
	}

	log.Println("Database migrations completed successfully")
	return nil
}
