package models

import (
	"database/sql/driver"
	"fmt"
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

// DocumentType string enum for document types
type DocumentType string

const (
	FOLDER  DocumentType = "FOLDER"
	PAGE    DocumentType = "PAGE"
	LINK    DocumentType = "LINK"
	SNIPPET DocumentType = "SNIPPET"
	EMAIL   DocumentType = "EMAIL"
)

func (documentType *DocumentType) Scan(value any) error {
	if value == nil {
		return nil
	}

	switch v := value.(type) {
	case []byte:
		*documentType = DocumentType(v)
	case string:
		*documentType = DocumentType(v)
	default:
		// Add more detailed error handling with type information
		return fmt.Errorf("cannot scan value of type %T into DocumentType, expected []byte or string", value)
	}
	return nil
}

func (documentType DocumentType) Value() (driver.Value, error) {
	return string(documentType), nil
}

// Base model definition, including UUID fields
type Base struct {
	ID        uuid.UUID      `gorm:"type:uuid;primary_key;default:gen_random_uuid()" json:"id"`
	CreatedAt time.Time      `json:"created_at" gorm:"autoCreateTime"`
	UpdatedAt time.Time      `json:"updated_at" gorm:"autoUpdateTime"`
	DeletedAt gorm.DeletedAt `json:"deleted_at" gorm:"index"`
}

// BeforeCreate will set a UUID rather than numeric ID
func (base *Base) BeforeCreate(tx *gorm.DB) error {
	if base.ID == uuid.Nil {
		base.ID = uuid.New()
	}
	return nil
}

// Document represents a document in the system
type Document struct {
	Base
	Path         *string      `json:"path" gorm:"default:null;uniqueIndex:unq_path_key"`
	Key          string       `json:"key" gorm:"not null;uniqueIndex:unq_path_key"`
	Index        uint         `json:"index" gorm:"not null;default:0"`
	DocumentType DocumentType `json:"document_type" gorm:"type:VARCHAR(20);not null;check:document_type IN ('FOLDER','PAGE','LINK','SNIPPET','EMAIL')"`
	ParentID     *uuid.UUID   `json:"parent_id" gorm:"type:uuid;default:null"`
	Parent       *Document    `json:"parent" gorm:"foreignKey:ParentID;references:ID;constraint:OnDelete:CASCADE"`
	Children     []*Document  `json:"children" gorm:"foreignKey:ParentID"`
	Tags         []Tag        `json:"tags" gorm:"many2many:document_tags;"`
	Metadata     []Metadata   `json:"metadata" gorm:"foreignKey:DocumentID"`
}

// Tag represents a tag that can be attached to documents
type Tag struct {
	Base
	Name      string     `json:"name" gorm:"unique;not null"`
	Documents []Document `json:"documents" gorm:"many2many:document_tags;"`
}

// Metadata represents additional metadata for a document
type Metadata struct {
	Base
	DocumentID uuid.UUID `json:"document_id" gorm:"type:uuid;not null"`
	Key        string    `json:"key" gorm:"not null"`
	Value      string    `json:"value" gorm:"not null"`
}
