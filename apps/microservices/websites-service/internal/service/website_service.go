package service

import (
	"acp/microservices/websites-service/internal/models"

	"gorm.io/gorm"
)

// WebsiteService handles business logic for websites
type WebsiteService struct {
	DB *gorm.DB
}

// NewWebsiteService creates a new website service
func NewWebsiteService(db *gorm.DB) *WebsiteService {
	return &WebsiteService{DB: db}
}

func (s *WebsiteService) GetWebsites() ([]models.WebsiteDTO, int64, error) {
	var websites []models.Website
	var total int64

	// Count total before pagination
	s.DB.Model(&models.Website{}).Count(&total)

	// Apply pagination and get websites
	err := s.DB.
		Order("name ASC").
		Find(&websites).Error
	if err != nil {
		return nil, 0, err
	}
	websitesDTOs := make([]models.WebsiteDTO, len(websites))
	for i, w := range websites {
		websitesDTOs[i] = models.WebsiteDTO{
			ID:          w.ID,
			WebsiteName: w.Name,
			DomainName:  w.DomainName,
		}
	}
	return websitesDTOs, total, nil
}

func (s *WebsiteService) CreateWebsite(website *models.Website) error {
	// Check if website with the same domain name already exists
	var existingWebsite models.Website
	err := s.DB.Where("domain_name = ?", website.DomainName).First(&existingWebsite).Error
	if err == nil {
		return gorm.ErrRecordNotFound
	}

	// Create the new website
	if err := s.DB.Create(&website).Error; err != nil {
		return err
	}
	return nil
}
