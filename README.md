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