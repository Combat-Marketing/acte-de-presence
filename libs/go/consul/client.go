package consul

import (
	"fmt"
	"log"

	"github.com/hashicorp/consul/api"
)

type Client struct {
	Consul *api.Client
}

// NewClient creates a new Consul client with the given address.
// The address should be in the format "host:port" (e.g. "localhost:8500").
// Returns a Client instance and any error that occurred during creation.
func NewClient(address string) (*Client, error) {
	config := api.DefaultConfig()
	config.Address = address
	client, err := api.NewClient(config)
	if err != nil {
		return nil, err
	}
	return &Client{Consul: client}, nil
}

// RegisterService registers a new service with Consul.
// The serviceID is a unique identifier for the service.
// The serviceName is the name of the service.
// The address is the address of the service.
// The port is the port of the service.
// Returns any error that occurred during registration.
func (c *Client) RegisterService(serviceID, serviceName, address string, port int, endpoint string) error {
	registration := &api.AgentServiceRegistration{
		ID:      serviceID,
		Name:    serviceName,
		Address: address,
		Port:    port,
		Tags: []string{
			"traefik.enable=true",
			fmt.Sprintf("traefik.http.routers.%s.rule=PathPrefix(`/%s`)", serviceID, endpoint),
			fmt.Sprintf("traefik.http.routers.%s.entrypoints=web", serviceID),
			// fmt.Sprintf("traefik.http.services.%s.service=%s", serviceID, serviceID),
			fmt.Sprintf("traefik.http.middlewares.%s-strip.stripPrefix.prefixes=/%s", serviceID, endpoint),
			fmt.Sprintf("traefik.http.middlewares.%s-strip.stripPrefix.forceSlash=false", serviceID),
			fmt.Sprintf("traefik.http.routers.%s.middlewares=%s-strip", serviceID, serviceID),
		},
		Check: &api.AgentServiceCheck{
			HTTP:     fmt.Sprintf("http://%s:%d/health", address, port),
			Interval: "10s",
		},
	}

	err := c.Consul.Agent().ServiceRegister(registration)
	if err != nil {
		log.Printf("Failed to register service %s: %v", serviceID, err)
		return err
	}
	log.Printf("Service %s registered successfully", serviceID)
	return nil
}

func (c *Client) GetKV(key string) (string, error) {
	pair, _, err := c.Consul.KV().Get(key, nil)
	if err != nil || pair == nil {
		return "", fmt.Errorf("key %s not found", key)
	}
	return string(pair.Value), nil
}
