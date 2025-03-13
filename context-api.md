# API Context

This document contains detailed information about the backend API of the Supply Chain System project. For a high-level overview of the entire project, see [main context](./context.md).

## Overview

The API is built with NestJS and provides the backend services for the Supply Chain System. It handles authentication, data processing, business logic, and database interactions.

## Architecture

- **Framework**: NestJS
- **API Style**: RESTful with OpenAPI documentation
- **Authentication**: JWT-based with role-based access control
- **Database Access**: Prisma ORM
- **Deployment**: Fly.io with Docker

## Recent Changes

- Fixed Fly.io deployment with pre-built artifacts:
  - Updated the deployment process to create a complete deployment directory
  - Added node_modules copying to ensure all dependencies are available
  - Created a custom fly.toml file directly in the deployment directory
  - Simplified the deployment command to use the local configuration
  - Fixed the Dockerfile to correctly reference the pre-built artifacts
- Created Fly.io applications:
  - Installed Fly.io CLI locally
  - Created `supply-chain-system-api` for production
  - Created `supply-chain-system-api-staging` for staging
  - This resolves the "Could not find App" error during deployment
- Fixed Fly.io build configuration conflicts:
  - Removed redundant `.fly/launch.toml` files that were causing build detection conflicts
  - Added `processes = ["app"]` to the `[http_service]` section in both `fly.toml` and `fly.staging.toml`
  - This resolves the "more than one build configuration found" error and properly links services to processes
- Fixed Fly.io application type detection:
  - Added explicit NestJS configuration to fly.toml files
  - Created .fly/launch.toml files for both production and staging
  - Added processes section to specify the correct start command
  - Set builder to "dockerfile" to ensure correct build process
- Fixed Fly.io deployment issues:
  - Created a new multi-stage Dockerfile that properly handles the monorepo structure
  - Fixed the dependency resolution for local packages (@supply-chain-system/shared)
  - Added proper .dockerignore files at both root and app levels
  - Ensured shared packages are built before the API in the Docker build process
  - Updated fly.toml files with proper build context pointing to the monorepo root
- Enhanced API dependency management:
  - Updated API package.json to ensure shared packages are built first
  - Added a build:deps script that builds all shared packages
  - Modified all API scripts to run build:deps when needed
  - This ensures proper dependency order during development and deployment
- Improved Fly.io deployment configuration:
  - Updated fly.toml and fly.staging.toml to use the Dockerfile
  - Configured the build process to build shared packages first
  - Added .dockerignore to optimize Docker builds
- Fixed user role handling in the admin section
- Updated the `UpdateUserDto` to include the `isActive` field
- Corrected the field name from `active` to `isActive` in the user entity

## Directory Structure

```
apps/api/
├── src/
│   ├── auth/             # Authentication module
│   ├── users/            # User management module
│   ├── orders/           # Order management module
│   ├── suppliers/        # Supplier management module
│   ├── tenants/          # Tenant management module
│   ├── app.module.ts     # Main application module
│   └── main.ts           # Application entry point
├── test/                 # Test files
├── Dockerfile            # Docker configuration
└── ...
```

## Key Modules

- **Auth**: Handles authentication and authorization
- **Users**: Manages user accounts and profiles
- **Orders**: Manages order creation, updates, and tracking
- **Suppliers**: Manages supplier information and relationships
- **Tenants**: Manages multi-tenant functionality and isolation

## API Endpoints

- `/auth`: Authentication endpoints
- `/users`: User management endpoints
- `/orders`: Order management endpoints
- `/suppliers`: Supplier management endpoints
- `/tenants`: Tenant management endpoints
- `/health`: Health check endpoint

## Known Issues

- Fly.io deployment issues:
  - Missing NestJS dependencies in the Docker build process
  - Need to update the Dockerfile to install all required NestJS packages
  - Current error: "Cannot find module '@nestjs/typeorm' or its corresponding type declarations"
- Need to implement comprehensive error handling throughout the application
- Need to add more validation to DTOs
- Need to improve logging for better debugging
- Need to add more comprehensive unit and integration tests

## Next Steps

- Implement comprehensive API documentation with Swagger
- Add rate limiting for security
- Implement caching for frequently accessed data
- Add more comprehensive logging
- Implement health checks and monitoring
