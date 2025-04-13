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
	consulAddr := os.Getenv("CONSUL_ADDR")
	consulClient, err := consul.NewClient(consulAddr)
	if err != nil {
		log.Fatalf("Failed to create Consul client: %v", err)
	}

	serviceID := "settings-service"
	serviceName := "ACP Settings Service"
	serviceAddress := "settings-service"
	servicePort := 5004

	err = consulClient.RegisterService(serviceID, serviceName, serviceAddress, servicePort, "settings")
	if err != nil {
		log.Fatalf("Failed to register service: %v", err)
	}

	router := gin.Default()
	router.GET("/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"status": "ok"})
	})

	router.GET("/config", func(c *gin.Context) {
		val, err := consulClient.GetKV("config/" + serviceID + "/pagination-limit")
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		}
		c.JSON(http.StatusOK, gin.H{"pagination_limit": val})
	})

	log.Printf("Starting %s service on port %d", serviceName, servicePort)
	router.Run(fmt.Sprintf(":%d", servicePort))
}
