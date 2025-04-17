package models

import (
	"time"

	"github.com/google/uuid"
)

type DocumentDTO struct {
	ID           uuid.UUID    `json:"id" binding:"required"`
	Path         *string      `json:"path" binding:"required"`
	Key          string       `json:"key" binding:"required"`
	ParentID     *uuid.UUID   `json:"parent_id" binding:"required"`
	DocumentType DocumentType `json:"document_type" binding:"required"`
	Index        uint         `json:"index" binding:"required"`
	CreatedAt    time.Time    `json:"created_at" binding:"required"`
	UpdatedAt    time.Time    `json:"updated_at" binding:"required"`
}
