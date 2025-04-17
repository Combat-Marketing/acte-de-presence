package main

import (
	"fmt"
	"log"
	"net/http"
	"os"
	"os/exec"
	"time"

	"acp/libs/consul"
	"acp/microservices/websites-service/internal/database"
	"acp/microservices/websites-service/internal/handlers"
	"acp/microservices/websites-service/internal/middleware"
	"acp/microservices/websites-service/internal/service"

	_ "ariga.io/atlas-provider-gorm/gormschema"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

// runMigrations runs database migrations using Atlas CLI
func runMigrations() error {
	log.Println("Running Atlas migrations...")

	cmd := exec.Command("atlas", "migrate", "apply", "--env", "development")
	cmd.Stdout = os.Stdout
	cmd.Stderr = os.Stderr

	if err := cmd.Run(); err != nil {
		return fmt.Errorf("migration failed: %w", err)
	}

	log.Println("Migrations completed successfully")
	return nil
}

func main() {
	// Use the new helper to register the service
	_, err := consul.RegisterServiceFromEnv()
	if err != nil {
		log.Fatalf("Failed to register service: %v", err)
	}

	// Set default values if environment variables are not set
	if os.Getenv("SERVICE_ID") == "" {
		os.Setenv("SERVICE_ID", "websites-service")
	}
	if os.Getenv("SERVICE_NAME") == "" {
		os.Setenv("SERVICE_NAME", "websites-service")
	}
	if os.Getenv("SERVICE_ADDRESS") == "" {
		os.Setenv("SERVICE_ADDRESS", "websites-service")
	}
	if os.Getenv("SERVICE_PORT") == "" {
		os.Setenv("SERVICE_PORT", "5004")
	}
	if os.Getenv("SERVICE_ENDPOINT") == "" {
		os.Setenv("SERVICE_ENDPOINT", "websites")
	}

	// Get service port from environment
	servicePort := 5003
	if portStr := os.Getenv("SERVICE_PORT"); portStr != "" {
		_, err := fmt.Sscanf(portStr, "%d", &servicePort)
		if err != nil {
			log.Fatalf("Invalid SERVICE_PORT: %v", err)
		}
	}

	// Initialize database
	db, err := database.InitDatabase()
	if err != nil {
		log.Fatalf("Failed to initialize database: %v", err)
	}

	// Create services and handlers
	websiteService := service.NewWebsiteService(db)
	websiteHandler := handlers.NewWebsiteHandler(websiteService)

	// Create router
	router := gin.Default()

	// Configure CORS
	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"*"}, // Or specify your frontend URL
		AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept", "Authorization", "X-Requested-With"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	// Add health check endpoint
	router.GET("/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"status": "ok"})
	})

	// API routes
	api := router.Group("/")
	{
		api.GET("/", websiteHandler.GetWebsites)

		// Protected routes
		protected := api.Group("/")
		protected.Use(middleware.AuthMiddleware())
		{

		}
	}

	log.Printf("Starting websites service on port %d", servicePort)
	router.Run(fmt.Sprintf(":%d", servicePort))
}
