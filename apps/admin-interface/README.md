# Admin Interface

This is the admin interface for the "Acte de Présence" application, built with [Next.js](https://nextjs.org).

## Features

- User management
- Event scheduling and management
- Attendance tracking
- Analytics and reporting
- Administrative settings

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to access the admin panel.

## Environment Setup

Create a `.env.local` file in the root directory with the following variables:

```
# Next Auth
NEXTAUTH_URL=<ADMIN_INTERFACE_URL>
NEXTAUTH_SECRET="<OPENSSL_SECRET>" # Generate with: openssl rand -base64 32

NEXT_PUBLIC_API_URL=http://localhost:8080

# Keycloak
KEYCLOAK_ID=acp-frontend
# Get this from Keycloak Admin Console:
# 1. Go to Clients > acp-frontend
# 2. Go to Credentials
# 3. Copy the Client Secret
KEYCLOAK_SECRET=<KEYCLOAK_SECRET>
KEYCLOAK_ISSUER=http://<KEYCLOAK_URL>/realms/acp
```

## Authentication

The admin interface uses [NextAuth.js](https://next-auth.js.org/) for authentication. Only authorized administrators can access this interface.

## Project Structure

- `app/` - Next.js application routes and components
- `components/` - Reusable UI components
- `lib/` - Utility functions and helpers
- `prisma/` - Database schema and migrations

## Learn More

For more information about the technologies used:

- [Next.js Documentation](https://nextjs.org/docs)
- [NextAuth.js Documentation](https://next-auth.js.org/getting-started/introduction)

©2025 Combat Jongerenmarketing en -communicatie B.V.