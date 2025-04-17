package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

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
type Website struct {
	Base
	Name            string           `json:"name" gorm:"not null"`
	DomainName      string           `json:"domain_name" gorm:"not null"`
	WebsiteSettings []WebsiteSetting `json:"website_settings" gorm:"foreignKey:WebsiteID"`
}

type WebsiteSetting struct {
	Base
	WebsiteID uuid.UUID `json:"website_id" gorm:"not null"`
	Website   Website   `json:"website" gorm:"foreignKey:WebsiteID"`
	Key       string    `json:"key" gorm:"not null"`
	Value     string    `json:"value" gorm:"not null"`
}
