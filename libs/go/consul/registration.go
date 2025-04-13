package consul

import (
	"fmt"
	"log"
	"os"

	"github.com/hashicorp/consul/api"
)

// ServiceConfig holds the configuration for a service to be registered with Consul
type ServiceConfig struct {
	// Required fields
	ID       string // Unique identifier for the service
	Name     string // Name of the service
	Address  string // Address of the service
	Port     int    // Port of the service
	Endpoint string // API endpoint path (e.g., "auth", "cms")

	// Optional fields
	Tags              []string          // Additional tags for the service
	Meta              map[string]string // Metadata for the service
	CheckInterval     string            // Health check interval (default: "10s")
	CheckTimeout      string            // Health check timeout (default: "5s")
	CheckPath         string            // Health check path (default: "/health")
	CheckProtocol     string            // Health check protocol (default: "http")
	EnableTraefik     bool              // Whether to enable Traefik integration (default: true)
	TraefikEntrypoint string            // Traefik entrypoint (default: "web")
}

// DefaultServiceConfig creates a default ServiceConfig with sensible defaults
func DefaultServiceConfig(id, name, address string, port int, endpoint string) *ServiceConfig {
	return &ServiceConfig{
		ID:                id,
		Name:              name,
		Address:           address,
		Port:              port,
		Endpoint:          endpoint,
		Tags:              []string{},
		Meta:              map[string]string{},
		CheckInterval:     "10s",
		CheckTimeout:      "5s",
		CheckPath:         "/health",
		CheckProtocol:     "http",
		EnableTraefik:     true,
		TraefikEntrypoint: "web",
	}
}

// RegisterServiceWithConfig registers a service with Consul using the provided configuration
func (c *Client) RegisterServiceWithConfig(config *ServiceConfig) error {
	// Build tags
	tags := config.Tags

	// Add Traefik tags if enabled
	if config.EnableTraefik {
		traefikTags := []string{
			"traefik.enable=true",
			fmt.Sprintf("traefik.http.routers.%s.rule=PathPrefix(`/%s`)", config.ID, config.Endpoint),
			fmt.Sprintf("traefik.http.routers.%s.entrypoints=%s", config.ID, config.TraefikEntrypoint),
			fmt.Sprintf("traefik.http.middlewares.%s-strip.stripPrefix.prefixes=/%s", config.ID, config.Endpoint),
			fmt.Sprintf("traefik.http.middlewares.%s-strip.stripPrefix.forceSlash=false", config.ID),
			fmt.Sprintf("traefik.http.routers.%s.middlewares=%s-strip", config.ID, config.ID),
		}
		tags = append(tags, traefikTags...)
	}

	// Create registration
	registration := &api.AgentServiceRegistration{
		ID:      config.ID,
		Name:    config.Name,
		Address: config.Address,
		Port:    config.Port,
		Tags:    tags,
		Meta:    config.Meta,
		Check: &api.AgentServiceCheck{
			HTTP:     fmt.Sprintf("%s://%s:%d%s", config.CheckProtocol, config.Address, config.Port, config.CheckPath),
			Interval: config.CheckInterval,
			Timeout:  config.CheckTimeout,
		},
	}

	// Register service
	err := c.Consul.Agent().ServiceRegister(registration)
	if err != nil {
		log.Printf("Failed to register service %s: %v", config.ID, err)
		return err
	}
	log.Printf("Service %s registered successfully", config.ID)
	return nil
}

// RegisterService is a convenience method that uses DefaultServiceConfig
func (c *Client) RegisterService(serviceID, serviceName, address string, port int, endpoint string) error {
	config := DefaultServiceConfig(serviceID, serviceName, address, port, endpoint)
	return c.RegisterServiceWithConfig(config)
}

// DeregisterService deregisters a service from Consul
func (c *Client) DeregisterService(serviceID string) error {
	err := c.Consul.Agent().ServiceDeregister(serviceID)
	if err != nil {
		log.Printf("Failed to deregister service %s: %v", serviceID, err)
		return err
	}
	log.Printf("Service %s deregistered successfully", serviceID)
	return nil
}

// RegisterServiceFromEnv registers a service using environment variables
func RegisterServiceFromEnv() (*Client, error) {
	// Get Consul address from environment
	consulAddr := os.Getenv("CONSUL_ADDR")
	if consulAddr == "" {
		consulAddr = "localhost:8500" // Default Consul address
	}

	// Create Consul client
	client, err := NewClient(consulAddr)
	if err != nil {
		return nil, fmt.Errorf("failed to create Consul client: %w", err)
	}

	// Get service configuration from environment
	serviceID := os.Getenv("SERVICE_ID")
	serviceName := os.Getenv("SERVICE_NAME")
	serviceAddress := os.Getenv("SERVICE_ADDRESS")
	servicePort := 0
	if portStr := os.Getenv("SERVICE_PORT"); portStr != "" {
		_, err := fmt.Sscanf(portStr, "%d", &servicePort)
		if err != nil {
			return nil, fmt.Errorf("invalid SERVICE_PORT: %w", err)
		}
	}
	serviceEndpoint := os.Getenv("SERVICE_ENDPOINT")

	// Validate required fields
	if serviceID == "" || serviceName == "" || serviceAddress == "" || servicePort == 0 || serviceEndpoint == "" {
		return nil, fmt.Errorf("missing required environment variables: SERVICE_ID, SERVICE_NAME, SERVICE_ADDRESS, SERVICE_PORT, SERVICE_ENDPOINT")
	}

	// Register service
	err = client.RegisterService(serviceID, serviceName, serviceAddress, servicePort, serviceEndpoint)
	if err != nil {
		return nil, fmt.Errorf("failed to register service: %w", err)
	}

	// Set up graceful shutdown
	go func() {
		// Wait for interrupt signal
		sigChan := make(chan os.Signal, 1)
		select {
		case <-sigChan:
			log.Println("Shutting down...")
			// Deregister service
			err := client.DeregisterService(serviceID)
			if err != nil {
				log.Printf("Failed to deregister service: %v", err)
			}
			os.Exit(0)
		}
	}()

	return client, nil
}
