# Supply Chain System Project Context

This document provides a high-level overview of the Supply Chain System project. For detailed information about specific domains, please refer to the following specialized context files:

- [Web Frontend Context](./context-web.md) - Next.js frontend application details
- [API Context](./context-api.md) - NestJS backend API details
- [Database Context](./context-database.md) - Database schema, migrations, and Prisma ORM details
- [UI Components Context](./context-ui.md) - Shared UI component library details
- [Shared Code Context](./context-shared.md) - Shared utilities, types, and business logic
- [CI/CD Context](./context-cicd.md) - Deployment pipelines, environments, and infrastructure

## Project Overview

The Supply Chain System is a multi-tenant SaaS platform designed for small businesses in supply-chain-intensive industries. It provides features for order management, supplier collaboration, and multi-tenant support with proper data isolation.

## Current Status

### Implemented Features

- User authentication and authorization
- Multi-tenant architecture with data isolation
- Order management system
- Supplier management
- Product catalog
- Role-based access control

### Recent Changes

See the domain-specific context files for detailed recent changes in each area.

## Next Steps

- Implement comprehensive testing strategy
- Set up monitoring and alerting
- Enhance security measures
- Optimize database performance
- Implement additional features for order tracking and reporting

## Architecture Decisions

- Using a monorepo structure for better code organization and sharing
- Implementing multi-tenant architecture with tenant isolation
- Using Prisma with multi-schema preview feature for database management
- Deploying the API to Fly.io and the frontend to Vercel
- Using GitHub Actions for CI/CD automation

## Known Issues

See the domain-specific context files for detailed known issues in each area.

## Dependencies

- Node.js 20.x
- PostgreSQL
- Prisma ORM
- NestJS for backend
- Next.js for frontend
- Tailwind CSS for styling
- NextAuth.js for authentication
- Supabase for database hosting
- Fly.io for API hosting
- Vercel for frontend hosting
- GitHub Actions for CI/CD
