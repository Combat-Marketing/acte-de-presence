package main

import (
	"bytes"
	"fmt"
	"html/template"
	"log"
	"os"
	"os/exec"
	"strconv"
	"strings"
)

func main() {
	log.Println("Starting ACP CLI")

	if len(os.Args) < 2 {
		showHelp()
		os.Exit(1)
	}

	command := os.Args[1]

	switch command {
	case "help":
		showHelp()
	case "microservice:generate":
		if len(os.Args) != 5 {
			log.Fatal("Usage: acp-cli microservice:generate <service-name> <service-id> <port>")
		}
		generateMicroservice(os.Args[2], os.Args[3], os.Args[4])
	default:
		log.Printf("Unknown command: %s\n", command)
		showHelp()
		os.Exit(1)
	}
}

func showHelp() {
	fmt.Println("ACP CLI Usage:")
	fmt.Println("  help                                    Show this help message")
	fmt.Println("  microservice:generate <name> <id> <port> Generate a new microservice")
}

func generateMicroservice(serviceName, serviceID, portStr string) {
	port, err := strconv.Atoi(portStr)
	if err != nil {
		log.Fatalf("Invalid port number: %v", err)
	}

	// Create service directory
	serviceDir := fmt.Sprintf("../apps/microservices/%s", serviceID)
	serviceSrcDir := fmt.Sprintf("%s/cmd", serviceDir)
	err = os.MkdirAll(serviceSrcDir, 0755)
	if err != nil {
		log.Fatalf("Failed to create service directory: %v", err)
	}

	// Initialize Go module
	// go mod init github.com/your-org/acp/apps/microservices/<service-id>
	cmd := exec.Command("go", "mod", "init", fmt.Sprintf("acp/microservices/%s", serviceID))
	cmd.Dir = serviceDir
	output, err := cmd.CombinedOutput()
	if err != nil {
		log.Printf("Executing command: %s %s", cmd.Path, cmd.String())
		log.Fatalf("Failed to initialize Go module: %v\nOutput: %s", err, output)
	}

	cmd = exec.Command("go", "mod", "edit", "-replace", "acp/libs/consul=../../../libs/go/consul")
	cmd.Dir = serviceDir
	_, err = cmd.CombinedOutput()
	if err != nil {
		log.Fatalf("Failed to edit Go module: %v", err)
	}
	cmd = exec.Command("go", "get", "acp/libs/consul")
	cmd.Dir = serviceDir
	_, err = cmd.CombinedOutput()
	if err != nil {
		log.Fatalf("Failed to get Go module: %v", err)
	}

	cmd = exec.Command("go", "get", "github.com/gin-gonic/gin")
	cmd.Dir = serviceDir
	output, err = cmd.CombinedOutput()
	if err != nil {
		log.Fatalf("Failed to get Gin: %v\nOutput: %s", err, output)
	}

	{
		// Create template data with named variables for better readability
		templateData := struct {
			ServiceID   string
			ServiceName string
			Address     string
			Port        int
		}{
			ServiceID:   serviceID,
			ServiceName: serviceName,
			Address:     serviceID, // Using serviceID as address
			Port:        port,
		}
		// Generate main.go file
		mainFile := fmt.Sprintf("%s/main.go", serviceSrcDir)
		templateContent, err := os.ReadFile("templates/service.go.tmpl")
		if err != nil {
			log.Fatalf("Failed to read template file: %v", err)
		}

		tmpl, err := template.New("service_main").Parse(string(templateContent))
		if err != nil {
			log.Fatalf("Failed to parse template: %v", err)
		}

		var buffer bytes.Buffer
		err = tmpl.Execute(&buffer, templateData)
		if err != nil {
			log.Fatalf("Failed to execute template: %v", err)
		}

		err = os.WriteFile(mainFile, buffer.Bytes(), 0644)
		if err != nil {
			log.Fatalf("Failed to write main.go: %v", err)
		}
	}

	{
		// Generate Dockerfile
		templateData := struct {
			ServiceID string
			Port      int
		}{
			ServiceID: serviceID,
			Port:      port,
		}
		dockerfilePath := fmt.Sprintf("%s/Dockerfile", serviceDir)
		templateContent, err := os.ReadFile("templates/dockerfile.tmpl")
		if err != nil {
			log.Fatalf("Failed to read Dockerfile template: %v", err)
		}
		tmpl, err := template.New("service_dockerfile").Parse(string(templateContent))
		if err != nil {
			log.Fatalf("Failed to parse Dockerfile template: %v", err)
		}

		var buffer bytes.Buffer
		err = tmpl.Execute(&buffer, templateData)
		if err != nil {
			log.Fatalf("Failed to execute Dockerfile template: %v", err)
		}

		err = os.WriteFile(dockerfilePath, buffer.Bytes(), 0644)
		if err != nil {
			log.Fatalf("Failed to write Dockerfile: %v", err)
		}
	}

	{
		// Generate docker-compose.entry.tmpl
		templateData := struct {
			ServiceID string
			Port      int
		}{
			ServiceID: serviceID,
			Port:      port,
		}

		dockerComposeFile := fmt.Sprintf("../infra/docker-compose.yml")
		templateContent, err := os.ReadFile("templates/docker-compose.entry.tmpl")
		if err != nil {
			log.Fatalf("Failed to read docker-compose.entry.tmpl: %v", err)
		}
		tmpl, err := template.New("service_docker_compose").Parse(string(templateContent))
		if err != nil {
			log.Fatalf("Failed to parse docker-compose.entry.tmpl: %v", err)
		}

		var buffer bytes.Buffer
		err = tmpl.Execute(&buffer, templateData)
		if err != nil {
			log.Fatalf("Failed to execute docker-compose.entry.tmpl: %v", err)
		}

		// Read the docker-compose.yml file
		dockerComposeContent, err := os.ReadFile(dockerComposeFile)
		if err != nil {
			log.Fatalf("Failed to read docker-compose.yml: %v", err)
		}

		// Find the marker where to insert the new service
		marker := "## -> Service entries will be added here <- ##"
		dockerComposeStr := string(dockerComposeContent)
		markerIndex := strings.Index(dockerComposeStr, marker)
		if markerIndex == -1 {
			log.Fatalf("Could not find marker in docker-compose.yml")
		}

		// Insert the new service entry before the marker
		newDockerComposeContent := dockerComposeStr[:markerIndex] +
			buffer.String() + "\n  " +
			dockerComposeStr[markerIndex:]

		// Write the updated content back to the file
		err = os.WriteFile(dockerComposeFile, []byte(newDockerComposeContent), 0644)
		if err != nil {
			log.Fatalf("Failed to update docker-compose.yml: %v", err)
		}

		log.Printf("Added %s service to docker-compose.yml", serviceID)
	}
	log.Printf("Successfully created microservice %s in %s", serviceName, serviceDir)
}
