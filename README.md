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
- Cloudflare R2 for file storage (images, PDFs)

### Additional Technologies

- Type-safe ORM for database schema management
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

- Node.js 18.x or higher
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
- `npm run start` - Start all applications in production mode
- `npm run lint` - Run linting on all applications
- `npm run test` - Run tests on all applications

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
