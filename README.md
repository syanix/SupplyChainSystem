# Supply Chain Management System

A multi-tenant SaaS platform for small businesses in supply-chain-intensive industries (e.g., restaurants, coffee shops). This platform streamlines supplier management, order processing, and collaboration, ensuring secure data isolation between tenants.

## Project Overview

This system is designed to help small businesses manage their supply chain operations efficiently. It provides features for order management, supplier collaboration, and multi-tenant support with proper data isolation.

## Documentation

- [Local Development Guide](./docs/LOCAL_DEVELOPMENT.md) - How to run the system locally
- [User Management Guide](./docs/USER_MANAGEMENT.md) - How to create and manage users
- [Setup Guide](./docs/SETUP.md) - Comprehensive setup instructions
- [Docker Setup](./docs/DOCKER-SETUP.md) - Docker-specific setup instructions
- [Troubleshooting Guide](./docs/TROUBLESHOOTING.md) - Solutions for common issues
- [API Documentation](./docs/API.md) - API endpoints and usage
- [Architecture Overview](./docs/ARCHITECTURE.md) - System architecture details
- [Deployment Guide](./docs/DEPLOYMENT.md) - How to deploy the system
- [CI/CD Setup](./CICD_README.md) - CI/CD workflows and deployment configurations
- [Type Strategy](./docs/TYPE_STRATEGY.md) - Our approach to TypeScript types and validation
- [Linter Warnings Guide](./docs/LINTER_WARNINGS.md) - Guide to addressing linter warnings
- [Remaining Linter Warnings](./docs/REMAINING_LINTER_WARNINGS.md) - Summary of remaining linter warnings

## Recent Improvements

- **Enhanced Type Safety**: Replaced `any` types with explicit types, created proper type definitions for Prisma entities, and fixed React Hook dependency warnings.
- **TypeScript Error Fixes**: Resolved method signature mismatches, fixed JWT authentication validation, and ensured proper handling of optional fields like `tenantId`.
- **Database Management**: Added comprehensive database reinitialization scripts and seeding functionality for easier development and testing.
- **Repository Improvements**: Fixed mapping functions in Order, Product, and Supplier repositories to ensure proper type conversion between Prisma and shared types.
- **Documentation**: Created comprehensive documentation for type strategy, linter warnings, and code organization.
- **Code Quality**: Improved error handling, added proper validation, and ensured consistent typing across the codebase.
- **Build Process**: Fixed TypeScript configuration for Prisma seed script to ensure proper compilation and execution.
- **CI/CD Simplification**: Streamlined GitHub workflows, simplified Docker configuration, and improved artifact packaging for more reliable deployments.

## Quick Start

1. **Clone the repository**:

   ```bash
   git clone https://github.com/yourusername/SupplyChainSystem.git
   cd SupplyChainSystem
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Initialize the database**:

   ```bash
   npm run db:reinit
   ```

   This will start the database containers, create the schema, and seed the database with initial data.

4. **Start the development servers**:

   ```bash
   npm run dev
   ```

5. **Access the application**:

   - Web: http://localhost:3000
   - API: http://localhost:3001
   - API Docs: http://localhost:3001/api/docs

6. **Login with the default admin user**:
   - Email: admin@example.com
   - Password: Admin123!

## Docker Requirements

The Docker setup requires the following dependencies:

- **Node.js 20**: The application runs on Node.js 20
- **PostgreSQL 15**: The database is PostgreSQL 15
- **OpenSSL 1.1.x**: Prisma requires OpenSSL 1.1.x to function properly

The Dockerfiles include the necessary dependencies for Prisma to work correctly:

```dockerfile
# Install OpenSSL and other required dependencies for Prisma
RUN apk add --no-cache openssl openssl-dev libc6-compat
```

If you encounter OpenSSL errors, you can rebuild the containers using the provided script:

```bash
./scripts/rebuild-api.sh
```

## Core Features

### Order Management

- Create, track, and manage orders
- Automated PDF generation for purchase orders
- Email notifications for order status updates

### Supplier Collaboration

- Supplier profiles and product catalogs
- Bulk product uploads
- Supplier order confirmation

### Multi-Tenant Architecture

- Secure data isolation between tenants
- Configurable environments for each business
- Role-based access control

### User Management

- Role-based access control (Admin, Manager, Staff)
- Multi-user support per business
- Authentication via NextAuth.js and Supabase Auth

### Goods Receipt & Order History

- Verification process for received goods
- Audit-friendly order history
- Export options for order history

## Tech Stack

### Frontend

- Next.js 15 (hosted on Vercel)
- Tailwind CSS for styling
- Headless UI and Radix UI for components

### Backend

- NestJS (hosted on Fly.io, future AWS migration-ready)
- PostgreSQL (Supabase) for database
- Prisma ORM for type-safe database access
- Cloudflare R2 for file storage (images, PDFs)

### Additional Technologies

- Repository pattern for clean architecture
- ESLint and Prettier for code quality
- Supabase Auth for authentication
- Resend for email notifications

## System Architecture

The system follows a modular, componentized, layered architecture to facilitate future scalability and migrations. It uses tenant isolation with a `tenant_id` in all database tables and middleware for JWT-based tenant validation.

## Security & Compliance

- AES-256 encryption for PII at rest
- TLS 1.3 enforced via security headers
- Comprehensive audit logging
- Rate limiting to prevent abuse

## CI/CD Pipeline

The project uses GitHub Actions for continuous integration and deployment:

- Automated testing on all pull requests
- Automated deployments to staging and production environments
- Database migration workflows
- Deployment dashboard for monitoring
- Automatic rollback on failed deployments

For more details, see the [CI/CD Setup Guide](./CICD_README.md).

## Testing Strategy

- Unit Tests: Vitest + HappyDOM (80% coverage target)
- Integration Tests: Supertest (90% coverage target)
- E2E Tests: Playwright (100% coverage for core flows)
- Load Testing: k6

## Project Structure

The project follows a monorepo structure with the following main directories:

```
/
├── apps/
│   ├── web/                 # Next.js frontend application
│   └── api/                 # NestJS backend application
├── packages/
│   ├── database/            # Database schema and migrations
│   ├── shared/              # Shared types and utilities
│   └── ui/                  # Shared UI components
├── docs/                    # Project documentation
│   ├── ARCHITECTURE.md
│   ├── API.md
│   ├── DEPLOYMENT.md
│   └── ADRS/
├── scripts/                 # Utility scripts
└── README.md                # Project overview
```

## Getting Started

### Prerequisites

- Node.js 20.x or higher
- npm 10.x or higher
- Docker and Docker Compose (for PostgreSQL)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/supply-chain-system.git
   cd supply-chain-system
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up the database:

   ```bash
   # Start PostgreSQL using Docker
   docker-compose up -d postgres
   ```

   For more details, see [PostgreSQL Setup Guide](docs/POSTGRES_SETUP.md).

4. Set up environment variables:

   ```bash
   # Copy example env files
   cp .env.example .env
   cp packages/database/.env.example packages/database/.env
   ```

5. Run database migrations:

   ```bash
   cd packages/database
   npx prisma migrate dev
   cd ../..
   ```

6. Start the development server:

   ```bash
   npm run dev
   ```

7. Open your browser and navigate to:
   - Frontend: http://localhost:3000
   - API: http://localhost:4000
   - API Documentation: http://localhost:4000/api-docs

### Project Structure

The project follows a monorepo structure with the following main directories:

```
/
├── apps/
│   ├── web/                 # Next.js frontend application
│   └── api/                 # NestJS backend application
├── packages/
│   ├── database/            # Database schema and migrations
│   ├── shared/              # Shared types and utilities
│   └── ui/                  # Shared UI components
├── docs/                    # Project documentation
├── scripts/                 # Utility scripts
└── docker-compose.yml       # Docker configuration
```

## Development

### Available Scripts

- `npm run dev` - Start all applications in development mode
- `npm run build` - Build all applications
- `npm run build:packages` - Build only the shared packages (ui, shared, database)
- `npm run start` - Start all applications in production mode
- `npm run lint` - Run linting on all applications
- `npm run type-check` - Run type checking on all applications
- `npm run test` - Run tests on all applications

### Build Sequence

The project uses Turborepo to manage the build sequence. The build sequence is configured in the `turbo.json` file. The key points to note are:

1. Shared packages (`@supply-chain-system/ui`, `@supply-chain-system/shared`, `@supply-chain-system/database`) must be built before the applications.
2. The `type-check` task depends on the `build` task of the shared packages.
3. When running type checking in CI/CD, always run `npm run build:packages` first to ensure the shared packages are built.

### UI Component Library

The project includes a comprehensive UI component library built with Tailwind CSS and Headless UI. The components are designed to be accessible, responsive, and customizable.

Key components include:

- Layout components (Layout, Sidebar, Navbar)
- Form components (Input, Select, Button)
- Data display components (Table, Card)
- Feedback components (Alert, Modal)
- Navigation components (Tabs, Pagination)

All components are available in the `packages/ui` directory and can be imported from the `@supply-chain-system/ui` package.

## License

_License information will be added._

## Local Docker Environment

We've set up a local Docker environment that mirrors the Fly.io production environment. This allows you to test your changes locally before deploying to production.

### Local Development Environment

To start the local development environment:

```bash
# Start the local development environment
./scripts/local-test.sh
```

This will:

1. Build and start Docker containers for PostgreSQL and the API
2. Set up the development environment with hot reloading
3. Wait for the API to be ready
4. Provide URLs for accessing the API

### Simulating Fly.io Deployment

To simulate a Fly.io deployment locally:

```bash
# Simulate a Fly.io deployment
./scripts/simulate-fly-deploy.sh
```

This will:

1. Build the production Docker image using the same Dockerfile as Fly.io
2. Create a Docker network to simulate the Fly.io network
3. Start PostgreSQL and the API containers with production settings
4. Wait for the API to be ready
5. Provide URLs for accessing the API

### Cleaning Up

To clean up all Docker containers and networks:

```bash
# Clean up all Docker containers and networks
./scripts/cleanup.sh
```

### Troubleshooting

If you encounter issues with the local Docker environment:

1. Check the logs:

   ```bash
   # For the development environment
   docker-compose logs -f api

   # For the Fly.io simulation
   docker logs -f fly-api
   ```

2. Ensure the DATABASE_URL environment variable is correctly set in both environments

3. Verify that the health endpoint is working correctly

4. If needed, rebuild the containers:

   ```bash
   # For the development environment
   docker-compose down && docker-compose up -d --build

   # For the Fly.io simulation
   docker rm -f fly-api fly-postgres && ./scripts/simulate-fly-deploy.sh
   ```

## Type Safety

We prioritize type safety throughout the codebase:

- **TypeScript First**: All code is fully typed with TypeScript
- **No Any**: We avoid using `any` type whenever possible
- **Type Hierarchies**: We use type hierarchies to model domain entities
- **Runtime Validation**: We use Zod for runtime validation of data
- **Repository Pattern**: We use repository interfaces to abstract data access

For more details, see our [Type Strategy](./docs/TYPE_STRATEGY.md) document.
