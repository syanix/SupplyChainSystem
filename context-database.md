# Database Context

This document contains detailed information about the database architecture of the Supply Chain System project. For a high-level overview of the entire project, see [main context](./context.md).

## Overview

The database layer is built with PostgreSQL and Prisma ORM, implementing a multi-tenant architecture with schema isolation for each tenant.

## Architecture

- **Database**: PostgreSQL
- **ORM**: Prisma with multi-schema preview feature
- **Hosting**: Supabase
- **Migration Strategy**: Prisma Migrate
- **Tenant Isolation**: Separate schema per tenant

## Recent Changes

- Implemented multi-tenant database architecture:
  - Created a schema per tenant approach
  - Implemented dynamic schema selection based on tenant context
  - Added tenant isolation middleware to ensure data security
- Set up Prisma with multi-schema preview feature:
  - Configured Prisma to work with multiple schemas
  - Added schema management utilities
  - Created migration scripts that work across schemas
- Optimized database queries:
  - Added indexes for frequently queried fields
  - Implemented query optimization for common operations
  - Added pagination to list endpoints

## Schema Design

The database includes the following main entities:

- **Users**: User accounts and authentication information
- **Tenants**: Tenant information and configuration
- **Orders**: Order details and status
- **OrderItems**: Individual items within orders
- **Products**: Product catalog
- **Suppliers**: Supplier information
- **SupplierProducts**: Products offered by suppliers
- **Inventory**: Inventory levels and locations

## Multi-Tenant Implementation

Each tenant has its own schema in the PostgreSQL database. The schema name is derived from the tenant ID. When a request comes in, the tenant context is determined from the request, and the appropriate schema is selected for database operations.

## Migration Strategy

Database migrations are managed through Prisma Migrate. The migration process:

1. Creates a migration for the base schema
2. Applies the migration to each tenant schema
3. Tracks migration history per tenant

## Known Issues

- Need to ensure proper tenant isolation in all database queries
- Need to optimize database performance for large datasets
- Need to implement a more robust migration strategy for schema changes
- Need to add more comprehensive database tests
- Connection pooling needs optimization for multi-tenant scenarios

## Next Steps

- Implement database monitoring and performance tracking
- Add database backup and restore procedures
- Implement audit logging for sensitive operations
- Optimize indexes for common query patterns
- Add database-level security policies
