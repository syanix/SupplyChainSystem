# Shared Code Context

This document contains detailed information about the shared code packages of the Supply Chain System project. For a high-level overview of the entire project, see [main context](./context.md).

## Overview

The shared code packages provide common functionality, types, and utilities that are used across the frontend and backend applications. They are built with TypeScript and published as internal packages within the monorepo.

## Architecture

- **Language**: TypeScript
- **Packaging**: Internal packages within the monorepo
- **Testing**: Jest
- **Documentation**: TSDoc

## Packages

### @supply-chain-system/shared

This package contains shared types, utilities, and business logic that is used by both the frontend and backend.

#### Key Features

- TypeScript interfaces for domain models
- Shared validation logic
- Utility functions
- Constants and enumerations
- Date and time utilities
- Formatting utilities

### @supply-chain-system/database

This package contains database-related code that is shared between applications.

#### Key Features

- Prisma client configuration
- Database connection utilities
- Migration utilities
- Seeding utilities
- Query builders

## Recent Changes

- Enhanced shared type definitions:
  - Added comprehensive TypeScript interfaces for all domain models
  - Improved type safety with strict null checks
  - Added documentation to all interfaces
- Improved shared utilities:
  - Added date formatting utilities
  - Implemented number formatting functions
  - Created validation utilities
  - Added error handling utilities
- Optimized build process:
  - Configured TypeScript for optimal compilation
  - Added proper dependency management
  - Improved package structure for better tree-shaking

## Usage Guidelines

Shared packages are imported in other packages and applications:

```typescript
// In API code
import { OrderStatus, formatCurrency } from "@supply-chain-system/shared";
import { getPrismaClient } from "@supply-chain-system/database";

// In Web code
import { OrderStatus, formatDate } from "@supply-chain-system/shared";
```

## Known Issues

- Need to improve documentation for shared utilities
- Some shared types need refinement for better type safety
- Need to add more comprehensive unit tests
- Need to optimize bundle size for frontend usage
- Need to improve error handling in shared utilities

## Next Steps

- Implement a comprehensive validation library
- Add more business logic to shared packages
- Improve documentation with examples
- Add more comprehensive unit tests
- Optimize bundle size for frontend usage
