# Documents Service

A microservice for managing documents and their metadata.

## Overview

This service provides a RESTful API for uploading, downloading, and managing documents with metadata and tags.

## Features

- Document upload/download
- Document metadata management
- Document tagging
- Filtering and searching documents
- Authentication and authorization

## Tech Stack

- Go
- Gin web framework
- GORM ORM
- Atlas migrations
- PostgreSQL database
- Consul for service discovery

## Database Migrations

This service uses Atlas for database migrations with GORM integration. Atlas is a powerful database schema migration tool that works with any ORM.

### Prerequisites

To use Atlas migrations, you need to install the Atlas CLI:

```bash
# For macOS
brew install ariga/tap/atlas

# For Linux
curl -sSf https://atlasgo.sh | sh

# For Windows
# Download from https://atlasgo.io or install with Scoop/Chocolatey
scoop bucket add atlas https://github.com/ariga/scoop-atlas.git
scoop install atlas
```

### Project Setup

The project is configured to use Atlas with GORM in "Go Program Mode" where:

1. A loader program in `./loader/main.go` reads your GORM models and generates a schema representation
2. The Atlas configuration in `atlas.hcl` references this program to understand your desired schema state
3. Atlas compares your desired schema with the current database state to generate migrations

### Managing Migrations

The project includes a CLI tool in `cmd/migrate/main.go` that simplifies working with Atlas migrations:

#### Creating a New Migration

When you make changes to your database schema (by modifying GORM models), create a new migration:

```bash
go run cmd/migrate/main.go -create -name add_new_field
```

This will:
1. Compare your GORM models against the current database state
2. Generate a versioned SQL migration in the `migrations/` directory

#### Applying Migrations

To apply pending migrations:

```bash
go run cmd/migrate/main.go -apply
```

#### Checking Migration Status

To see which migrations have been applied and which are pending:

```bash
go run cmd/migrate/main.go -status
```

#### Validating Migrations

To validate that your migrations are correct and can be applied:

```bash
go run cmd/migrate/main.go -verify
```

### Database Schema

The service uses the following database schema, defined as GORM models:

- `Document`: Stores document metadata and file reference
- `Tag`: Represents tags that can be applied to documents
- `Metadata`: Stores additional key-value metadata for documents

### Automatic Migration on Startup

The service automatically attempts to apply any pending migrations on startup. This ensures that the database schema is always up to date with the application code.

## API Endpoints

### Public Endpoints

- `GET /health` - Health check endpoint
- `GET /config` - Service configuration
- `GET /api/v1/documents/:id/download` - Download a document

### Protected Endpoints (Require Authentication)

- `GET /api/v1/documents` - Get all documents with filtering options
- `GET /api/v1/documents/:id` - Get a document by ID
- `POST /api/v1/documents` - Create a new document
- `PUT /api/v1/documents/:id` - Update a document
- `DELETE /api/v1/documents/:id` - Delete a document
- `POST /api/v1/documents/:id/tags` - Add a tag to a document
- `DELETE /api/v1/documents/:id/tags/:tag` - Remove a tag from a document

## Environment Variables

- `DATABASE_URL` - PostgreSQL connection URL
- `SERVICE_ID` - Service ID for Consul registration
- `SERVICE_NAME` - Service name for Consul registration
- `SERVICE_ADDRESS` - Service address for Consul registration
- `SERVICE_PORT` - Port for the service to listen on
- `SERVICE_ENDPOINT` - Service endpoint for Consul registration
- `DOCUMENT_STORAGE_PATH` - Path to store uploaded documents

## Planned
- [ ] Data model setup for the different document types
    - [ ] FOLDER
    - [ ] PAGE
    - [ ] LINK
    - [ ] SNIPPET
    - [ ] EMAIL
- [ ] Localization support
- [ ] Document properties support
    - [ ] Inheritance
- [ ] Master document support
- [ ] Version control and document history
- [ ] Workflow management system for document approval processes
- [ ] Advanced document relationships (parent/child, references)
- [ ] Custom field types and validation
- [ ] Document templates
- [ ] Access control lists for fine-grained permissions
- [ ] Full-text search integration
- [ ] Document preview generation
- [ ] Bulk operations API
- [ ] Document tree structure with drag-and-drop support
- [ ] Scheduled publishing/unpublishing
- [ ] Document cloning functionality