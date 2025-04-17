package main

import (
	"flag"
	"fmt"
	"log"
	"os"
	"os/exec"
)

func main() {
	// Define command line flags
	createCmd := flag.Bool("create", false, "Create a new migration")
	applyCmd := flag.Bool("apply", false, "Apply all pending migrations")
	name := flag.String("name", "", "Name for the new migration (required with -create)")
	status := flag.Bool("status", false, "Show migration status")
	verify := flag.Bool("verify", false, "Verify that migrations are up-to-date")

	flag.Parse()

	// Get database connection string from environment
	dbURL := os.Getenv("DATABASE_URL")
	if dbURL == "" {
		dbURL = "postgres://postgres:postgres@localhost:5432/websites?sslmode=disable"
	}

	// Execute the requested command
	if *createCmd {
		if *name == "" {
			log.Fatal("Migration name is required with -create flag")
		}

		fmt.Printf("Creating new migration: %s\n", *name)

		cmd := exec.Command("atlas", "migrate", "diff", *name,
			"--env", "development")

		cmd.Stdout = os.Stdout
		cmd.Stderr = os.Stderr

		if err := cmd.Run(); err != nil {
			log.Fatalf("Failed to create migration: %v", err)
		}

		fmt.Printf("Migration '%s' created successfully\n", *name)
	} else if *applyCmd {
		fmt.Println("Applying migrations...")

		cmd := exec.Command("atlas", "migrate", "apply",
			"--env", "development")

		cmd.Stdout = os.Stdout
		cmd.Stderr = os.Stderr

		if err := cmd.Run(); err != nil {
			log.Fatalf("Failed to apply migrations: %v", err)
		}

		fmt.Println("Migrations applied successfully")
	} else if *status {
		fmt.Println("Checking migration status...")

		cmd := exec.Command("atlas", "migrate", "status",
			"--env", "development")

		cmd.Stdout = os.Stdout
		cmd.Stderr = os.Stderr

		if err := cmd.Run(); err != nil {
			log.Fatalf("Failed to check migration status: %v", err)
		}
	} else if *verify {
		fmt.Println("Verifying migrations...")

		cmd := exec.Command("atlas", "migrate", "validate",
			"--env", "development")

		cmd.Stdout = os.Stdout
		cmd.Stderr = os.Stderr

		if err := cmd.Run(); err != nil {
			log.Fatalf("Migration validation failed: %v", err)
		}

		fmt.Println("Migrations are valid")
	} else {
		flag.Usage()
	}
}
