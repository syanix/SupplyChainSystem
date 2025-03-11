# Supply Chain Management System - Setup Guide

This document provides comprehensive instructions for setting up the Supply Chain Management System development environment, installing all required packages, and running the applications.

## Prerequisites

- Node.js >= 18.0.0
- npm >= 10.2.4 (comes with Node.js installation)
- Git
- PostgreSQL database

## Project Structure

The project follows a monorepo structure using npm workspaces:

```
SupplyChainSystem/
├── apps/
│   ├── api/       # NestJS backend API
│   └── web/       # Next.js frontend application
├── packages/
│   ├── database/  # Database models and migrations
│   ├── shared/    # Shared utilities and types
│   └── ui/        # Shared UI component library
└── docs/          # Project documentation
```

## Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd SupplyChainSystem
```

### 2. Install Dependencies

The project uses npm workspaces to manage dependencies across multiple packages. Run the following command at the root of the project to install all dependencies:

```bash
npm install
```

This will install:
- Root dependencies (Turbo, ESLint, etc.)
- All dependencies for each package in the `packages/` directory
- All dependencies for each application in the `apps/` directory

### 3. Database Setup

#### Option 1: Manual PostgreSQL Setup

Create a `.env` file in the `packages/database` directory with your PostgreSQL connection details:

```
DATABASE_URL="postgresql://username:password@localhost:5432/supply_chain_db?schema=public"
```

#### Option 2: Docker PostgreSQL Setup

For a more automated setup using Docker, refer to the [Docker Setup Guide](./DOCKER-SETUP.md) which provides instructions for running PostgreSQL in a Docker container.

#### Run Migrations

To set up the database schema:

```bash
cd packages/database
npm run migrate:dev
```

Optionally, seed the database with initial data:

```bash
npm run db:seed
```

### 4. Environment Configuration

#### API Environment

Create a `.env` file in the `apps/api` directory:

```
PORT=3001
DATABASE_URL="postgresql://username:password@localhost:5432/supply_chain_db?schema=public"
JWT_SECRET="your-jwt-secret-key"
SUPABASE_URL="your-supabase-url"
SUPABASE_KEY="your-supabase-key"
RESEND_API_KEY="your-resend-api-key"
```

#### Web Environment

Create a `.env.local` file in the `apps/web` directory:

```
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET="your-nextauth-secret-key"
```

## Running the Applications

### Development Mode

To run all applications and packages in development mode with hot reloading:

```bash
# From the root directory
npm run dev
```

This will start:
- The NestJS API server on http://localhost:3001
- The Next.js web application on http://localhost:3000
- Watch mode for all shared packages

### Running Individual Applications

To run only specific applications or packages:

```bash
# Run only the API
cd apps/api
npm run start:dev

# Run only the web app
cd apps/web
npm run dev

# Build shared UI components
cd packages/ui
npm run dev
```

## Building for Production

To build all applications and packages for production:

```bash
# From the root directory
npm run build
```

To start the production builds:

```bash
npm run start
```

## Development Workflow

### Code Linting

To lint all code:

```bash
npm run lint
```

### Formatting Code

To format all code using Prettier:

```bash
npm run format
```

## Troubleshooting

### Common Issues

1. **Package dependency issues**
   - Try cleaning node_modules and reinstalling: `rm -rf node_modules && npm install`

2. **Database connection errors**
   - Verify PostgreSQL is running and credentials are correct
   - Check that the database exists: `createdb supply_chain_db`

3. **Port conflicts**
   - If ports 3000 or 3001 are already in use, modify the port in the respective .env files

## File Generation Context

This section documents the context behind key file generation decisions for future reference:

### Frontend (Next.js)

- **Next.js 15**: Selected for its improved performance, server components, and built-in optimizations
- **Tailwind CSS**: Used for utility-first styling approach
- **Radix UI**: Provides accessible, unstyled components that can be customized with Tailwind
- **SWR**: Used for data fetching with built-in caching and revalidation

### Backend (NestJS)

- **NestJS**: Chosen for its structured, modular architecture and TypeScript support
- **TypeORM**: Used for database interactions with PostgreSQL
- **Swagger/OpenAPI**: Implemented for API documentation
- **Supabase Auth**: Integrated for authentication services

### Database

- **PostgreSQL**: Selected for its robustness and advanced features like row-level security
- **Prisma**: Used as the primary ORM for type-safe database access
- **Multi-tenant design**: Implemented using tenant_id columns and row-level security

### Shared Packages

- **UI Package**: Contains reusable UI components following atomic design principles
- **Database Package**: Centralizes database schema and migration management
- **Shared Package**: Houses common utilities, types, and validation schemas using Zod

## Next Steps

- Complete the implementation of core features
- Set up CI/CD pipeline
- Configure monitoring and logging
- Implement comprehensive testing strategy