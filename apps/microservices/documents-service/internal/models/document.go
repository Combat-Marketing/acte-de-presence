package models

import (
	"database/sql/driver"
	"time"

	"gorm.io/gorm"
)

type DocumentType string

const (
	FOLDER  DocumentType = "FOLDER"
	PAGE    DocumentType = "PAGE"
	LINK    DocumentType = "LINK"
	SNIPPET DocumentType = "SNIPPET"
	EMAIL   DocumentType = "EMAIL"
)

func (documentType *DocumentType) Scan(value any) error {
	*documentType = DocumentType(value.([]byte))
	return nil
}

func (documentType DocumentType) Value() (driver.Value, error) {
	return string(documentType), nil
}

// Document represents a document in the system
type Document struct {
	gorm.Model
	Path         *string      `json:"path" gorm:"default:null;uniqueIndex:unq_path_key"`
	Key          string       `json:"key" gorm:"not null;uniqueIndex:unq_path_key"`
	Index        uint         `json:"index" gorm:"not null;default:0"`
	DocumentType DocumentType `json:"document_type" gorm:"type:VARCHAR(20);not null;check:document_type IN ('FOLDER','PAGE','LINK','SNIPPET','EMAIL')"`
	ParentID     *uint        `json:"parent_id" gorm:"default:null"`
	Parent       *Document    `json:"parent" gorm:"foreignKey:ParentID;references:ID;constraint:OnDelete:CASCADE"`
	Children     []*Document  `json:"children" gorm:"foreignKey:ParentID"`
	CreatedAt    time.Time    `json:"created_at" gorm:"autoCreateTime"`
	UpdatedAt    time.Time    `json:"updated_at" gorm:"autoUpdateTime"`
	Tags         []Tag        `json:"tags" gorm:"many2many:document_tags;"`
	Metadata     []Metadata   `json:"metadata" gorm:"foreignKey:DocumentID"`
}

// Tag represents a tag that can be attached to documents
type Tag struct {
	gorm.Model
	Name      string     `json:"name" gorm:"unique;not null"`
	Documents []Document `json:"documents" gorm:"many2many:document_tags;"`
}

// Metadata represents additional metadata for a document
type Metadata struct {
	gorm.Model
	DocumentID uint   `json:"document_id" gorm:"not null"`
	Key        string `json:"key" gorm:"not null"`
	Value      string `json:"value" gorm:"not null"`
}
