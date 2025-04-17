package models

import "github.com/google/uuid"

type WebsiteDTO struct {
	ID          uuid.UUID `json:"id" binding:"required"`
	DomainName  string    `json:"domain_name" binding:"required"`
	WebsiteName string    `json:"website_name" binding:"required"`
}
