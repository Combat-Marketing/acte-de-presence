package handlers

import (
	"acp/microservices/websites-service/internal/models"
	"acp/microservices/websites-service/internal/service"
	"net/http"

	"github.com/gin-gonic/gin"
)

// WebsiteHandler handles website-related HTTP requests
type WebsiteHandler struct {
	websiteService *service.WebsiteService
}

// NewWebsiteHandler creates a new website handler
func NewWebsiteHandler(websiteService *service.WebsiteService) *WebsiteHandler {
	return &WebsiteHandler{websiteService: websiteService}
}

// GetWebsites handles GET /websites
func (h *WebsiteHandler) GetWebsites(c *gin.Context) {
	// Get websites
	websites, total, err := h.websiteService.GetWebsites()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err})
		return
	}
	c.JSON(http.StatusOK, gin.H{"websites": websites, "total": total})
}

// CreateWebsite handles POST /websites
func (h *WebsiteHandler) CreateWebsite(c *gin.Context) {
	// Bind JSON to website model
	var website models.Website
	if err := c.ShouldBindJSON(&website); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Create website
	if err := h.websiteService.CreateWebsite(&website); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, gin.H{"message": "Website created successfully"})
}
