package handlers

import (
	"acp/microservices/documents-service/internal/models"
	"acp/microservices/documents-service/internal/service"
	"fmt"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

// DocumentHandler handles document-related HTTP requests
type DocumentHandler struct {
	DocumentService *service.DocumentService
}

// NewDocumentHandler creates a new document handler
func NewDocumentHandler(documentService *service.DocumentService) *DocumentHandler {
	return &DocumentHandler{DocumentService: documentService}
}

// GetDocuments handles GET /documents
func (h *DocumentHandler) GetDocuments(c *gin.Context) {
	// Parse query parameters
	limitStr := c.DefaultQuery("limit", "50")
	offsetStr := c.DefaultQuery("offset", "0")
	documentType := c.DefaultQuery("type", "")
	onlyRootStr := c.DefaultQuery("only_root", "false")
	onlyRoot, err := strconv.ParseBool(onlyRootStr)
	if err != nil {
		onlyRoot = false
	}
	tag := c.DefaultQuery("tag", "")

	var parentID *uuid.UUID
	if parentIDStr := c.Query("parent_id"); parentIDStr != "" {
		if id, err := uuid.FromBytes([]byte(parentIDStr)); err == nil {
			parentUUID := id
			parentID = &parentUUID
		}
	}

	limit, err := strconv.Atoi(limitStr)
	if err != nil {
		limit = 50
	}

	offset, err := strconv.Atoi(offsetStr)
	if err != nil {
		offset = 0
	}

	// Get documents
	documents, total, err := h.DocumentService.GetDocuments(limit, offset, documentType, tag, parentID, onlyRoot)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"documents": documents,
		"total":     total,
		"limit":     limit,
		"offset":    offset,
	})
}

// GetDocument handles GET /documents/:id
func (h *DocumentHandler) GetDocument(c *gin.Context) {
	id, err := uuid.FromBytes([]byte(c.Param("id")))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid document ID"})
		return
	}

	document, err := h.DocumentService.GetDocumentByID(id)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Document not found"})
		return
	}

	c.JSON(http.StatusOK, document)
}

// GetDocumentByPath handles GET /documents/by-path
func (h *DocumentHandler) GetDocumentByPath(c *gin.Context) {
	var path *string
	pathStr := c.Query("path")
	if pathStr != "" {
		path = &pathStr
	}

	key := c.Query("key")
	if key == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Key is required"})
		return
	}

	document, err := h.DocumentService.GetDocumentByPathAndKey(path, key)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Document not found"})
		return
	}

	c.JSON(http.StatusOK, document)
}

// CreateDocument handles POST /documents
func (h *DocumentHandler) CreateDocument(c *gin.Context) {
	var request struct {
		Key          string              `json:"key" binding:"required"`
		Index        *uint               `json:"index"`
		DocumentType models.DocumentType `json:"document_type" binding:"required"`
		ParentID     *uuid.UUID          `json:"parent_id"`
		Metadata     []struct {
			Key   string `json:"key" binding:"required"`
			Value string `json:"value" binding:"required"`
		} `json:"metadata"`
		Tags []string `json:"tags"`
	}

	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": fmt.Sprintf("Invalid request format: %v", err)})
		return
	}

	// Create document object
	document := models.Document{
		Key:          request.Key,
		DocumentType: request.DocumentType,
		ParentID:     request.ParentID,
	}

	// If index is provided, use it (otherwise the service will calculate it)
	if request.Index != nil {
		document.Index = *request.Index
	}

	// Create document
	if err := h.DocumentService.CreateDocument(&document); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("Failed to create document: %v", err)})
		return
	}

	// Add metadata if provided
	for _, meta := range request.Metadata {
		if err := h.DocumentService.AddMetadataToDocument(document.ID, meta.Key, meta.Value); err != nil {
			// Log error but continue
			fmt.Printf("Failed to add metadata %s to document %d: %v\n", meta.Key, document.ID, err)
		}
	}

	// Add tags if provided
	for _, tag := range request.Tags {
		if err := h.DocumentService.AddTagToDocument(document.ID, tag); err != nil {
			// Log error but continue
			fmt.Printf("Failed to add tag %s to document %d: %v\n", tag, document.ID, err)
		}
	}

	// Return the created document
	createdDoc, _ := h.DocumentService.GetDocumentByID(document.ID)
	c.JSON(http.StatusCreated, createdDoc)
}

// UpdateDocument handles PUT /documents/:id
func (h *DocumentHandler) UpdateDocument(c *gin.Context) {
	id, err := uuid.FromBytes([]byte(c.Param("id")))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid document ID"})
		return
	}

	// Get existing document
	document, err := h.DocumentService.GetDocumentByID(id)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Document not found"})
		return
	}

	// Bind JSON to request
	var request struct {
		Key   string `json:"key"`
		Index *uint  `json:"index"`
	}

	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
		return
	}

	// Update fields
	if request.Key != "" {
		document.Key = request.Key
	}

	if request.Index != nil {
		document.Index = *request.Index
	}

	// Save changes
	if err := h.DocumentService.UpdateDocument(document); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update document"})
		return
	}

	// Return the updated document
	updatedDoc, _ := h.DocumentService.GetDocumentByID(id)
	c.JSON(http.StatusOK, updatedDoc)
}

// MoveDocument handles POST /documents/:id/move
func (h *DocumentHandler) MoveDocument(c *gin.Context) {
	id, err := uuid.FromBytes([]byte(c.Param("id")))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid document ID"})
		return
	}

	var request struct {
		ParentID *uuid.UUID `json:"parent_id"`
	}

	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
		return
	}

	if err := h.DocumentService.MoveDocument(id, request.ParentID); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("Failed to move document: %v", err)})
		return
	}

	// Return the updated document
	updatedDoc, _ := h.DocumentService.GetDocumentByID(id)
	c.JSON(http.StatusOK, updatedDoc)
}

// DeleteDocument handles DELETE /documents/:id
func (h *DocumentHandler) DeleteDocument(c *gin.Context) {
	id, err := uuid.FromBytes([]byte(c.Param("id")))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid document ID"})
		return
	}

	if err := h.DocumentService.DeleteDocument(id); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete document"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Document deleted successfully"})
}

// AddTagToDocument handles POST /documents/:id/tags
func (h *DocumentHandler) AddTagToDocument(c *gin.Context) {
	id, err := uuid.FromBytes([]byte(c.Param("id")))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid document ID"})
		return
	}

	var request struct {
		Tag string `json:"tag" binding:"required"`
	}

	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Tag is required"})
		return
	}

	if err := h.DocumentService.AddTagToDocument(id, request.Tag); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to add tag"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Tag added successfully"})
}

// RemoveTagFromDocument handles DELETE /documents/:id/tags/:tag
func (h *DocumentHandler) RemoveTagFromDocument(c *gin.Context) {
	id, err := uuid.FromBytes([]byte(c.Param("id")))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid document ID"})
		return
	}

	tag := c.Param("tag")
	if tag == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Tag is required"})
		return
	}

	if err := h.DocumentService.RemoveTagFromDocument(id, tag); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to remove tag"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Tag removed successfully"})
}

// SetMetadataForDocument handles POST /documents/:id/metadata
func (h *DocumentHandler) SetMetadataForDocument(c *gin.Context) {
	id, err := uuid.FromBytes([]byte(c.Param("id")))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid document ID"})
		return
	}

	var request struct {
		Key   string `json:"key" binding:"required"`
		Value string `json:"value" binding:"required"`
	}

	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Key and value are required"})
		return
	}

	if err := h.DocumentService.UpdateMetadataForDocument(id, request.Key, request.Value); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to set metadata"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Metadata set successfully"})
}
