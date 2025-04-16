package main

import (
	"fmt"
	"log"
	"net/http"
	"os"
	"os/exec"
	"time"

	"acp/libs/consul"
	"acp/microservices/documents-service/internal/database"
	"acp/microservices/documents-service/internal/handlers"
	"acp/microservices/documents-service/internal/middleware"
	"acp/microservices/documents-service/internal/service"

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
	consulClient, err := consul.RegisterServiceFromEnv()
	if err != nil {
		log.Fatalf("Failed to register service: %v", err)
	}

	// Set default values if environment variables are not set
	if os.Getenv("SERVICE_ID") == "" {
		os.Setenv("SERVICE_ID", "documents-service")
	}
	if os.Getenv("SERVICE_NAME") == "" {
		os.Setenv("SERVICE_NAME", "documents-service")
	}
	if os.Getenv("SERVICE_ADDRESS") == "" {
		os.Setenv("SERVICE_ADDRESS", "documents-service")
	}
	if os.Getenv("SERVICE_PORT") == "" {
		os.Setenv("SERVICE_PORT", "5003")
	}
	if os.Getenv("SERVICE_ENDPOINT") == "" {
		os.Setenv("SERVICE_ENDPOINT", "documents")
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
	documentService := service.NewDocumentService(db)
	documentHandler := handlers.NewDocumentHandler(documentService)

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

	// Add config endpoint
	router.GET("/config", func(c *gin.Context) {
		val, err := consulClient.GetKV("config/documents-service/storage-path")
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusOK, gin.H{"storage_path": val})
	})

	// API routes
	api := router.Group("/")
	{
		// Public routes
		api.GET("/:id/download", func(c *gin.Context) {
			// Implementation for downloading documents would go here
			// This endpoint would serve the document file
			c.JSON(http.StatusOK, gin.H{"message": "Download endpoint not yet implemented"})
		})
		api.GET("/", documentHandler.GetDocuments)
		api.GET("/:id", documentHandler.GetDocument)

		// Protected routes
		protected := api.Group("/")
		protected.Use(middleware.AuthMiddleware())
		{
			// Document routes
			protected.POST("/", documentHandler.CreateDocument)
			protected.PUT("/:id", documentHandler.UpdateDocument)
			protected.DELETE("/:id", documentHandler.DeleteDocument)

			// Tag routes
			protected.POST("/:id/tags", documentHandler.AddTagToDocument)
			protected.DELETE("/:id/tags/:tag", documentHandler.RemoveTagFromDocument)
		}
	}

	log.Printf("Starting documents service on port %d", servicePort)
	router.Run(fmt.Sprintf(":%d", servicePort))
}
