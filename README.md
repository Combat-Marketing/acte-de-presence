# Acte de Presence - Enterprise CMS & Digital Asset Management

Acte de Presence is a powerful Enterprise Content Management System (CMS) built with [Next.js](https://nextjs.org), designed to streamline your organization's content and digital asset management workflows.

## Key Features

- **Robust Content Management**: Create, edit, and publish content with an intuitive interface
- **Advanced Digital Asset Management (DAM)**: Centralized storage, organization, and distribution of digital assets
- **Version Control**: Track changes and maintain content history
- **Role-Based Access Control**: Granular permissions for team management
- **API-First Architecture**: Headless CMS capabilities for multi-channel content delivery
- **Enterprise-Grade Security**: Advanced security features to protect your content

## Getting Started

1. Setup the database

    a. Add to your .env file:
    ```env
    DATABASE_URL="postgres://postgres:postgres@localhost:5432/postgres?shema=public"
    ```

    b. Run the migrations
    ```bash
    npm run migrate
    ```
    c. Seed the database. This will create the default user and basic document/asset roots
    ```bash
    npm run seed
    ```

2. Setup next auth secret
    a. Set a secret
    ```bash
    npx auth secret
    ```

    b. Set 

4. Start development server
   ```bash
   npm run dev
   ```

## Project structure
### Project Structure

The project is organized into the following key directories and components:

```
/src
    /components       # Reusable React components
    /pages            # Next.js pages for routing
    /services         # API and microservice integrations
    /styles           # Global and component-specific styles
    /utils            # Utility functions and helpers
    /middleware       # Middleware for request handling and authentication
    /ai               # AI service integrations for content generation and recommendations
    /cms              # Core CMS logic and multi-website management
    /dam              # Digital Asset Management logic
```

### Microservices

Acte de Presence uses a microservices architecture to ensure scalability and modularity:

- **Content Service**: Handles content creation, editing, and publishing.
- **Asset Service**: Manages digital assets, including storage, retrieval, and metadata.
- **AI Service**: Integrates AI capabilities for content suggestions, SEO optimization, and analytics.
- **Authentication Service**: Manages user authentication and role-based access control.
- **API Gateway**: Provides a unified API for external integrations and multi-channel delivery.

### Technologies Used

- **Frontend**: [Next.js](https://nextjs.org) for server-side rendering and React-based UI.
- **Backend**: Go with a modular microservices architecture.
- **Database**: PostgreSQL for relational data storage.
- **ORM**: Gorm
- **Authentication**: NextAuth.js for secure user authentication.
- **AI Integration**: OpenAI API for content generation and recommendations.
- **Storage**: AWS S3 or similar for digital asset storage.
- **Styling**: Tailwind CSS for rapid UI development.
- **Testing**: Jest and React Testing Library for unit and integration tests.
- **Containerization**: Docker for consistent development and deployment environments.

This structure and technology stack ensure that developers can easily contribute to the project and extend its functionality as needed.