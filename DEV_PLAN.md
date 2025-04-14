# Acte de Présence – SaaS Development Plan

This document outlines the development milestones and infrastructure setup for the Acte de Présence SaaS-based CMS/DAM platform.

---

## ✅ Completed

### 🧱 Core Infrastructure

- [x] Monorepo project structure (apps, libs, infra)
- [x] Docker Compose-based dev environment
- [x] Central `.env` config and `env_file` support
- [x] PostgreSQL, Redis, and Keycloak containerized
- [x] Consul cluster for:
  - [x] Service discovery
  - [x] KV store
  - [x] Health checks

### ⚙️ Microservices

- [x] `auth-service` (Go)
- [x] `cms-service` (Go)
- [x] `documents-service` (Go)
- [x] Shared Go library for Consul integration
- [x] Automatic Consul service registration with health checks
- [x] Keycloak integration and realm import via JSON
- [x] Clean REST APIs with `/health` endpoints

### 🌐 Traefik Integration

- [x] Traefik v3 reverse proxy via Docker
- [x] Dashboard exposed at `localhost:9000`
- [x] Entrypoints: `web` (8080) and `dashboard`
- [x] Consul Catalog used as Traefik provider
- [x] Per-service routing configured using tags
- [x] Per-service prefix-stripping middlewares via tags
- [x] Services accessible via paths:
  - `/auth`
  - `/cms`
  - `/documents`

---

## 🔨 In Progress

- [ ] Refactor Go Consul registration into shared helper
- [ ] Consistent naming scheme for all service tags and routers
- [ ] Add CI for `docker-compose up --build --exit-code-from`
- [ ] Write unit tests for each service's endpoints
- [ ] Implement Documents and Assets data models and services
- [ ] Set up MinIO for S3-compatible object storage

---

## 📊 Data Model: Documents and Assets

### Documents Structure
Documents will be organized in a tree structure with the following types:

1. **Folder** - Container for other documents
2. **Page** - Content page with rich text
3. **Link** - External URL reference
4. **Snippet** - Reusable content fragment
5. **Email** - Email template or content

### Assets Structure
Assets will also follow a tree structure with these types:

1. **Folder** - Container for other assets
2. **Image** - Image files (jpg, png, gif, etc.)
3. **Video** - Video files (mp4, webm, etc.)
4. **Audio** - Audio files (mp3, wav, etc.)
5. **Other** - Miscellaneous file types

### Implementation Plan

#### Database Schema
- [ ] Create PostgreSQL schemas for `documents` and `assets`
- [ ] Implement tree structure using adjacency list or nested set model
- [ ] Add type enumeration for both document and asset types
- [ ] Create metadata tables for type-specific attributes
- [ ] Implement versioning for content changes
- [ ] Create indexes for efficient tree traversal
- [ ] Implement document and asset version tables
- [ ] Create type-specific tables for different document and asset types

#### API Endpoints
- [ ] CRUD operations for both documents and assets
- [ ] Tree traversal endpoints (get children, get ancestors)
- [ ] Search and filtering by type, metadata, etc.
- [ ] Bulk operations for moving/copying items
- [ ] Version history and rollback capabilities
- [ ] Publishing workflow endpoints
- [ ] File upload/download endpoints for assets
- [ ] Thumbnail generation for media assets

#### Storage Strategy
- [ ] Set up MinIO for S3-compatible object storage
- [ ] Configure MinIO buckets for different asset types
- [ ] Implement MinIO client integration in Go services
- [ ] Set up MinIO lifecycle policies for versioning
- [ ] Configure MinIO access policies and security
- [ ] Implement file storage for assets using MinIO
- [ ] Content delivery network integration for media assets
- [ ] Thumbnail generation for images and videos
- [ ] Metadata extraction for assets (EXIF, etc.)
- [ ] Implement caching strategy for tree structures
- [ ] Set up Redis for caching frequently accessed content

#### UI Components
- [ ] Tree view component for navigation
- [ ] Type-specific editors for different document types
- [ ] Asset browser with preview capabilities
- [ ] Drag-and-drop interface for organizing content
- [ ] Search and filter interface
- [ ] Version history viewer
- [ ] Publishing workflow UI
- [ ] MinIO file browser integration

#### Service Architecture
- [ ] Implement API Layer with RESTful endpoints
- [ ] Implement Service Layer with business logic
- [ ] Implement Repository Layer for database interactions
- [ ] Implement Integration Layer for cross-service communication
- [ ] Implement Storage Layer for file management with MinIO
- [ ] Set up event publishing for content changes

#### Performance Optimization
- [ ] Implement caching for tree structures
- [ ] Set up pagination for large trees
- [ ] Implement lazy loading for deep trees
- [ ] Optimize file storage with MinIO and CDN integration
- [ ] Implement on-demand thumbnail generation
- [ ] Set up metadata extraction for assets
- [ ] Configure MinIO for optimal performance

#### Security Implementation
- [ ] Implement role-based access control
- [ ] Set up file upload security measures
- [ ] Implement API security (rate limiting, validation)
- [ ] Set up audit logging for content changes
- [ ] Configure MinIO security policies and encryption

---

## 🚧 Planned / To Do

### 🧪 Development Environment

- [ ] Local HTTPS support via Traefik (mkcert or Let's Encrypt staging)
- [ ] Service metrics + observability (Prometheus / Grafana)
- [ ] Optional Vault integration for secrets
- [ ] MinIO console exposed at `localhost:9001`

### 🧑‍💻 Services

- [ ] `settings-service` (Go)
- [ ] `api-gateway` as a thin proxy layer or BFF
- [ ] GraphQL support layer (optional)
- [ ] Frontend apps:
  - [ ] Admin UI (React or SvelteKit)
  - [ ] Public CMS frontend

### 🔐 Authentication / Authorization

- [ ] Role-based access control with Keycloak
- [ ] JWT validation middleware in Go
- [ ] SSO via OIDC clients
- [ ] MinIO IAM integration with Keycloak

### 🔁 Deployment

- [ ] Docker Compose → Nomad / K8s migration strategy
- [ ] GitHub Actions CI/CD pipelines
- [ ] Per-environment configuration (dev/staging/prod)
- [ ] Versioning and changelogs for microservices
- [ ] MinIO high availability configuration

---

## 📎 Notes

- Use `docker-compose logs -f api-gateway` and Consul UI to debug service discovery.
- All services must self-register in Consul and define routing via tags.
- Keep routing paths, names, and middlewares consistent for clean configuration.
- Document and Asset trees should support deep nesting with performance considerations.
- Consider implementing caching strategies for frequently accessed content.
- For tree traversal, consider using adjacency list, nested set model, or materialized path based on access patterns.
- Implement proper indexing for efficient tree traversal.
- Consider using PostgreSQL's tsvector for full-text search or Elasticsearch for more advanced capabilities.
- Use MinIO for S3-compatible storage with CDN integration for media delivery.
- Configure MinIO with appropriate bucket policies and lifecycle rules for versioning.
- Implement proper error handling for MinIO operations in Go services.

