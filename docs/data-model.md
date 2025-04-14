# Documents and Assets Data Model

This document outlines the database schema design for the Documents and Assets components of the Acte de Présence platform.

## Database Schema Design

### Documents Schema

```sql
-- Document types enumeration
CREATE TYPE document_type AS ENUM ('folder', 'page', 'link', 'snippet', 'email');

-- Base documents table (using adjacency list for tree structure)
CREATE TABLE documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    parent_id UUID REFERENCES documents(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL,
    type document_type NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID NOT NULL,
    updated_by UUID NOT NULL,
    is_published BOOLEAN DEFAULT FALSE,
    published_at TIMESTAMP WITH TIME ZONE,
    published_by UUID,
    metadata JSONB DEFAULT '{}',
    UNIQUE(parent_id, slug)
);

-- Create index for faster tree traversal
CREATE INDEX idx_documents_parent_id ON documents(parent_id);

-- Document versions for content history
CREATE TABLE document_versions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_id UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
    version_number INTEGER NOT NULL,
    content JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID NOT NULL,
    UNIQUE(document_id, version_number)
);

-- Type-specific tables for different document types

-- Pages table
CREATE TABLE document_pages (
    document_id UUID PRIMARY KEY REFERENCES documents(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    template_id UUID,
    layout JSONB,
    seo_title VARCHAR(255),
    seo_description TEXT,
    seo_keywords TEXT[]
);

-- Links table
CREATE TABLE document_links (
    document_id UUID PRIMARY KEY REFERENCES documents(id) ON DELETE CASCADE,
    url VARCHAR(2048) NOT NULL,
    target VARCHAR(20) DEFAULT '_blank',
    rel VARCHAR(100) DEFAULT 'noopener noreferrer'
);

-- Snippets table
CREATE TABLE document_snippets (
    document_id UUID PRIMARY KEY REFERENCES documents(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    is_reusable BOOLEAN DEFAULT TRUE,
    variables JSONB DEFAULT '[]'
);

-- Emails table
CREATE TABLE document_emails (
    document_id UUID PRIMARY KEY REFERENCES documents(id) ON DELETE CASCADE,
    subject VARCHAR(255) NOT NULL,
    body TEXT NOT NULL,
    template_id UUID,
    variables JSONB DEFAULT '[]'
);
```

### Assets Schema

```sql
-- Asset types enumeration
CREATE TYPE asset_type AS ENUM ('folder', 'image', 'video', 'audio', 'other');

-- Base assets table (using adjacency list for tree structure)
CREATE TABLE assets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    parent_id UUID REFERENCES assets(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL,
    type asset_type NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID NOT NULL,
    updated_by UUID NOT NULL,
    is_published BOOLEAN DEFAULT FALSE,
    published_at TIMESTAMP WITH TIME ZONE,
    published_by UUID,
    metadata JSONB DEFAULT '{}',
    UNIQUE(parent_id, slug)
);

-- Create index for faster tree traversal
CREATE INDEX idx_assets_parent_id ON assets(parent_id);

-- Asset versions for content history
CREATE TABLE asset_versions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    asset_id UUID NOT NULL REFERENCES assets(id) ON DELETE CASCADE,
    version_number INTEGER NOT NULL,
    file_path VARCHAR(1024) NOT NULL,
    file_size BIGINT NOT NULL,
    mime_type VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID NOT NULL,
    UNIQUE(asset_id, version_number)
);

-- Type-specific tables for different asset types

-- Images table
CREATE TABLE asset_images (
    asset_id UUID PRIMARY KEY REFERENCES assets(id) ON DELETE CASCADE,
    width INTEGER,
    height INTEGER,
    format VARCHAR(20),
    thumbnail_path VARCHAR(1024),
    alt_text TEXT,
    caption TEXT
);

-- Videos table
CREATE TABLE asset_videos (
    asset_id UUID PRIMARY KEY REFERENCES assets(id) ON DELETE CASCADE,
    duration INTEGER,
    width INTEGER,
    height INTEGER,
    format VARCHAR(20),
    thumbnail_path VARCHAR(1024),
    transcript TEXT,
    caption TEXT
);

-- Audio table
CREATE TABLE asset_audio (
    asset_id UUID PRIMARY KEY REFERENCES assets(id) ON DELETE CASCADE,
    duration INTEGER,
    format VARCHAR(20),
    bitrate INTEGER,
    transcript TEXT,
    caption TEXT
);

-- Other files table
CREATE TABLE asset_others (
    asset_id UUID PRIMARY KEY REFERENCES assets(id) ON DELETE CASCADE,
    file_extension VARCHAR(20),
    original_filename VARCHAR(255)
);
```

## API Design

### Documents API

#### Endpoints

- `GET /api/documents` - List documents (with filtering)
- `GET /api/documents/{id}` - Get document details
- `POST /api/documents` - Create a new document
- `PUT /api/documents/{id}` - Update a document
- `DELETE /api/documents/{id}` - Delete a document
- `GET /api/documents/{id}/children` - Get child documents
- `GET /api/documents/{id}/ancestors` - Get ancestor documents
- `GET /api/documents/{id}/versions` - Get document versions
- `POST /api/documents/{id}/versions` - Create a new version
- `GET /api/documents/{id}/versions/{version}` - Get a specific version
- `POST /api/documents/{id}/publish` - Publish a document
- `POST /api/documents/{id}/unpublish` - Unpublish a document
- `POST /api/documents/move` - Move documents (bulk operation)
- `POST /api/documents/copy` - Copy documents (bulk operation)

### Assets API

#### Endpoints

- `GET /api/assets` - List assets (with filtering)
- `GET /api/assets/{id}` - Get asset details
- `POST /api/assets` - Create a new asset
- `PUT /api/assets/{id}` - Update an asset
- `DELETE /api/assets/{id}` - Delete an asset
- `GET /api/assets/{id}/children` - Get child assets
- `GET /api/assets/{id}/ancestors` - Get ancestor assets
- `GET /api/assets/{id}/versions` - Get asset versions
- `POST /api/assets/{id}/versions` - Create a new version
- `GET /api/assets/{id}/versions/{version}` - Get a specific version
- `POST /api/assets/{id}/publish` - Publish an asset
- `POST /api/assets/{id}/unpublish` - Unpublish an asset
- `POST /api/assets/move` - Move assets (bulk operation)
- `POST /api/assets/copy` - Copy assets (bulk operation)
- `GET /api/assets/{id}/download` - Download an asset
- `GET /api/assets/{id}/thumbnail` - Get asset thumbnail

## Implementation Considerations

### Tree Structure Performance

For efficient tree traversal, consider these approaches:

1. **Adjacency List** (implemented above)
   - Simple to implement
   - Requires recursive queries for deep trees
   - Good for frequent updates

2. **Nested Set Model** (alternative)
   - Faster reads for tree traversal
   - More complex to maintain
   - Better for read-heavy operations

3. **Materialized Path** (alternative)
   - Stores full path from root
   - Good balance of performance
   - Easier to query than adjacency list

### Caching Strategy

- Cache frequently accessed documents and assets
- Implement Redis for caching tree structures
- Use CDN for media assets
- Consider implementing a cache invalidation strategy

### Search Implementation

- Implement full-text search using PostgreSQL's tsvector
- Consider Elasticsearch for more advanced search capabilities
- Implement faceted search for filtering by type, metadata, etc.

### File Storage

- Use S3-compatible storage for assets
- Implement a content delivery network for media assets
- Generate thumbnails for images and videos
- Extract metadata from assets (EXIF, etc.)
``` 