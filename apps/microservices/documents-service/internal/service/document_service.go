package service

import (
	"acp/microservices/documents-service/internal/models"
	"errors"
	"fmt"
	"os"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

// DocumentService handles business logic for documents
type DocumentService struct {
	DB *gorm.DB
}

// NewDocumentService creates a new document service
func NewDocumentService(db *gorm.DB) *DocumentService {
	return &DocumentService{DB: db}
}

// GetDocuments retrieves documents with optional filters
func (s *DocumentService) GetDocuments(limit, offset int, documentType, tag string, parentID *uuid.UUID, onlyRoot bool) ([]models.DocumentDTO, int64, error) {
	var documents []models.Document
	var total int64

	query := s.DB.Model(&models.Document{})

	if documentType != "" {
		query = query.Where("document_type = ?", documentType)
	}

	if parentID != nil {
		query = query.Where("parent_id = ?", parentID)
	}

	if onlyRoot {
		query = query.Where("parent_id IS NULL")
	}

	if tag != "" {
		query = query.Joins("JOIN document_tags ON document_tags.document_id = documents.id").
			Joins("JOIN tags ON tags.id = document_tags.tag_id").
			Where("tags.name = ?", tag)
	}

	// Count total before pagination
	query.Count(&total)

	// Apply pagination and get documents
	err := query.Preload("Tags").Preload("Metadata").
		Limit(limit).Offset(offset).
		Order("index ASC").
		Find(&documents).Error
	documentDTOs := make([]models.DocumentDTO, len(documents))
	for i, doc := range documents {
		documentDTOs[i] = models.DocumentDTO{
			ID:           doc.ID,
			Path:         doc.Path,
			Key:          doc.Key,
			ParentID:     doc.ParentID,
			DocumentType: doc.DocumentType,
			Index:        doc.Index,
			CreatedAt:    doc.CreatedAt,
			UpdatedAt:    doc.UpdatedAt,
		}
	}
	return documentDTOs, total, err
}

func (s *DocumentService) GetDocumentsForWebsite(websiteID uuid.UUID) []models.DocumentDTO {
	return []models.DocumentDTO{}
}

// GetDocumentByID retrieves a document by its ID
func (s *DocumentService) GetDocumentByID(id uuid.UUID) (*models.Document, error) {
	var document models.Document
	if err := s.DB.Preload("Tags").Preload("Metadata").Preload("Children", func(db *gorm.DB) *gorm.DB {
		return db.Order("index ASC")
	}).First(&document, id).Error; err != nil {
		return nil, err
	}
	return &document, nil
}

// GetDocumentByPathAndKey retrieves a document by its path and key
func (s *DocumentService) GetDocumentByPathAndKey(path *string, key string) (*models.Document, error) {
	var document models.Document
	query := s.DB.Where("key = ?", key)

	if path != nil {
		query = query.Where("path = ?", *path)
	} else {
		query = query.Where("path IS NULL")
	}

	if err := query.Preload("Tags").Preload("Metadata").Preload("Children", func(db *gorm.DB) *gorm.DB {
		return db.Order("index ASC")
	}).First(&document).Error; err != nil {
		return nil, err
	}

	return &document, nil
}

// CreateDocument creates a new document record
func (s *DocumentService) CreateDocument(doc *models.Document) error {
	// If this is a document with content (not a folder), prepare storage for content
	if doc.DocumentType != models.FOLDER {
		// Get storage path from environment or use default
		storagePath := os.Getenv("DOCUMENT_STORAGE_PATH")
		if storagePath == "" {
			storagePath = "./storage/documents"
		}

		// Create directory if it doesn't exist
		if err := os.MkdirAll(storagePath, 0755); err != nil {
			return fmt.Errorf("failed to create storage directory: %w", err)
		}
	}

	// If parent exists, set the path based on parent path + key
	if doc.ParentID != nil {
		parent := models.Document{}
		if err := s.DB.First(&parent, *doc.ParentID).Error; err != nil {
			return fmt.Errorf("parent document not found: %w", err)
		}

		// Generate path based on parent path
		var newPath string
		if parent.Path != nil {
			newPath = *parent.Path + "/" + parent.Key
		} else {
			newPath = parent.Key
		}
		doc.Path = &newPath
	}

	// Get next index for documents with same parent
	var maxIndex struct{ MaxIndex uint }
	query := s.DB
	if doc.ParentID != nil {
		query = query.Where("parent_id = ?", *doc.ParentID)
	} else {
		query = query.Where("parent_id IS NULL")
	}

	if err := query.Model(&models.Document{}).Select("COALESCE(MAX(index), 0) as max_index").Scan(&maxIndex).Error; err != nil {
		return err
	}
	doc.Index = maxIndex.MaxIndex + 1

	// Create document record in database
	return s.DB.Create(doc).Error
}

// UpdateDocument updates an existing document
func (s *DocumentService) UpdateDocument(doc *models.Document) error {
	return s.DB.Model(doc).Updates(map[string]interface{}{
		"key":   doc.Key,
		"index": doc.Index,
	}).Error
}

// UpdateDocumentIndex updates just the index of a document
func (s *DocumentService) UpdateDocumentIndex(id uuid.UUID, index uint) error {
	return s.DB.Model(&models.Document{}).Where("id = ?", id).Update("index", index).Error
}

// DeleteDocument deletes a document and its children
func (s *DocumentService) DeleteDocument(id uuid.UUID) error {
	return s.DB.Transaction(func(tx *gorm.DB) error {
		// First, get the document
		var document models.Document
		if err := tx.First(&document, id).Error; err != nil {
			return err
		}

		// Delete the document and its children will be deleted due to the CASCADE constraint
		return tx.Delete(&document).Error
	})
}

// MoveDocument moves a document to a new parent
func (s *DocumentService) MoveDocument(docID uuid.UUID, newParentID *uuid.UUID) error {
	return s.DB.Transaction(func(tx *gorm.DB) error {
		var document models.Document
		if err := tx.First(&document, docID).Error; err != nil {
			return err
		}

		// If new parent exists, validate it
		if newParentID != nil {
			var parent models.Document
			if err := tx.First(&parent, *newParentID).Error; err != nil {
				return fmt.Errorf("parent document not found: %w", err)
			}

			// Ensure the parent is a folder
			if parent.DocumentType != models.FOLDER {
				return errors.New("parent document must be a folder")
			}

			// Check for circular reference
			if *newParentID == docID {
				return errors.New("document cannot be its own parent")
			}

			// Check if the new parent is a descendant of the document
			currentParentID := parent.ParentID
			for currentParentID != nil {
				if *currentParentID == docID {
					return errors.New("parent cannot be a descendant of the document")
				}

				var currentParent models.Document
				if err := tx.Select("parent_id").First(&currentParent, *currentParentID).Error; err != nil {
					break
				}
				currentParentID = currentParent.ParentID
			}

			// Update parent ID
			document.ParentID = newParentID

			// Update path
			var newPath string
			if parent.Path != nil {
				newPath = *parent.Path + "/" + parent.Key
			} else {
				newPath = parent.Key
			}
			document.Path = &newPath
		} else {
			// Moving to root
			document.ParentID = nil
			document.Path = nil
		}

		// Get next index for documents with same new parent
		var maxIndex struct{ MaxIndex uint }
		query := tx.Model(&models.Document{})
		if newParentID != nil {
			query = query.Where("parent_id = ?", *newParentID)
		} else {
			query = query.Where("parent_id IS NULL")
		}

		if err := query.Select("COALESCE(MAX(index), 0) as max_index").Scan(&maxIndex).Error; err != nil {
			return err
		}
		document.Index = maxIndex.MaxIndex + 1

		// Update the document
		return tx.Save(&document).Error
	})
}

// AddTagToDocument adds a tag to a document
func (s *DocumentService) AddTagToDocument(documentID uuid.UUID, tagName string) error {
	// Find or create tag
	var tag models.Tag
	if err := s.DB.Where("name = ?", tagName).FirstOrCreate(&tag, models.Tag{Name: tagName}).Error; err != nil {
		return err
	}

	// Associate tag with document
	return s.DB.Exec("INSERT INTO document_tags (document_id, tag_id) VALUES (?, ?) ON CONFLICT DO NOTHING", documentID, tag.ID).Error
}

// RemoveTagFromDocument removes a tag from a document
func (s *DocumentService) RemoveTagFromDocument(documentID uuid.UUID, tagName string) error {
	var tag models.Tag
	if err := s.DB.Where("name = ?", tagName).First(&tag).Error; err != nil {
		return err
	}

	return s.DB.Exec("DELETE FROM document_tags WHERE document_id = ? AND tag_id = ?", documentID, tag.ID).Error
}

// AddMetadataToDocument adds metadata to a document
func (s *DocumentService) AddMetadataToDocument(documentID uuid.UUID, key, value string) error {
	metadata := models.Metadata{
		DocumentID: documentID,
		Key:        key,
		Value:      value,
	}

	return s.DB.Create(&metadata).Error
}

// UpdateMetadataForDocument updates or creates metadata for a document
func (s *DocumentService) UpdateMetadataForDocument(documentID uuid.UUID, key, value string) error {
	return s.DB.Transaction(func(tx *gorm.DB) error {
		var metadata models.Metadata
		result := tx.Where("document_id = ? AND key = ?", documentID, key).First(&metadata)

		if result.Error != nil {
			if errors.Is(result.Error, gorm.ErrRecordNotFound) {
				// Create new metadata
				return tx.Create(&models.Metadata{
					DocumentID: documentID,
					Key:        key,
					Value:      value,
				}).Error
			}
			return result.Error
		}

		// Update existing metadata
		metadata.Value = value
		return tx.Save(&metadata).Error
	})
}
