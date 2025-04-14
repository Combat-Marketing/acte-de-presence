package main

import (
	"fmt"
	"log"
	"net/http"
	"os"

	"acp/libs/consul"

	"github.com/gin-gonic/gin"
)

func main() {
	// Use the new helper to register the service
	consulClient, err := consul.RegisterServiceFromEnv()
	if err != nil {
		log.Fatalf("Failed to register service: %v", err)
	}

	// Set default values if environment variables are not set
	if os.Getenv("SERVICE_ID") == "" {
		os.Setenv("SERVICE_ID", "auth-service")
	}
	if os.Getenv("SERVICE_NAME") == "" {
		os.Setenv("SERVICE_NAME", "auth-service")
	}
	if os.Getenv("SERVICE_ADDRESS") == "" {
		os.Setenv("SERVICE_ADDRESS", "auth-service")
	}
	if os.Getenv("SERVICE_PORT") == "" {
		os.Setenv("SERVICE_PORT", "5002")
	}
	if os.Getenv("SERVICE_ENDPOINT") == "" {
		os.Setenv("SERVICE_ENDPOINT", "auth")
	}

	// Get service port from environment
	servicePort := 5002
	if portStr := os.Getenv("SERVICE_PORT"); portStr != "" {
		_, err := fmt.Sscanf(portStr, "%d", &servicePort)
		if err != nil {
			log.Fatalf("Invalid SERVICE_PORT: %v", err)
		}
	}

	router := gin.Default()
	router.GET("/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"status": "ok"})
	})

	router.GET("/config", func(c *gin.Context) {
		val, err := consulClient.GetKV("config/auth-service/token-expiry")
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		}
		c.JSON(http.StatusOK, gin.H{"token_expiry": val})
	})

	log.Printf("Starting auth service on port %d", servicePort)
	router.Run(fmt.Sprintf(":%d", servicePort))
}
