package database

import (
	"database/sql"
	"log"
	"os"
	"time"

	_ "github.com/lib/pq" // PostgreSQL driver for database/sql
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

var DB *gorm.DB

// InitDatabase initializes the database connection
func InitDatabase() (*gorm.DB, error) {
	// Get database connection string from environment
	dbURL := os.Getenv("DATABASE_URL")
	if dbURL == "" {
		dbURL = "postgres://postgres:postgres@localhost:5432/websites?sslmode=disable"
	}

	// First, make a connection to verify the database exists
	sqlDB, err := sql.Open("postgres", dbURL)
	if err != nil {
		log.Printf("Failed to open database connection: %v", err)
		return nil, err
	}
	defer sqlDB.Close()

	// Add retry logic for database connection
	const maxRetries = 5
	const retryDelay = 3 * time.Second

	for i := 0; i < maxRetries; i++ {
		err = sqlDB.Ping()
		if err == nil {
			break
		}
		log.Printf("Failed to ping database (attempt %d/%d): %v", i+1, maxRetries, err)
		if i < maxRetries-1 {
			log.Printf("Retrying in %v...", retryDelay)
			time.Sleep(retryDelay)
		}
	}
	if err != nil {
		log.Printf("Failed to connect to database after %d attempts: %v", maxRetries, err)
		return nil, err
	}

	// Configure GORM
	config := &gorm.Config{
		Logger: logger.Default.LogMode(logger.Info),
	}

	// Connect to database with GORM
	DB, err = gorm.Open(postgres.Open(dbURL), config)
	if err != nil {
		log.Printf("Failed to connect to database with GORM: %v", err)
		return nil, err
	}

	log.Println("Connected to database successfully")
	return DB, nil
}

// GetDB returns the database connection
func GetDB() *gorm.DB {
	return DB
}
