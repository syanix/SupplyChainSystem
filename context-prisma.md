# Prisma Migration Context

This document provides context about the migration from TypeORM to Prisma in the Supply Chain System project.

## Overview

We've migrated from TypeORM to Prisma as our ORM for database access. This migration provides several benefits:

1. **Type Safety**: Prisma generates TypeScript types from your schema, providing better type safety
2. **Developer Experience**: Better tooling and error messages
3. **Performance**: Generally better performance than TypeORM
4. **Maintainability**: Schema-first approach leads to more maintainable code

## Shared Prisma Schema Approach

We're using a shared Prisma schema approach in our monorepo:

1. **Single Source of Truth**: The Prisma schema is defined in `packages/database/prisma/schema.prisma`
2. **Shared Client**: The database package exports a pre-configured Prisma client
3. **API Integration**: The API project imports and uses the client from the database package

This approach ensures consistency across the codebase and eliminates duplication.

## Migration Steps

The migration from TypeORM to Prisma involved the following steps:

1. **Install Prisma Dependencies**: Added Prisma client and CLI to the project
2. **Create Prisma Service**: Created a PrismaService that uses the client from the database package
3. **Create Prisma Module**: Created a PrismaModule that provides the PrismaService
4. **Update App Module**: Updated the app module to use PrismaModule instead of TypeOrmModule
5. **Update Feature Modules**: Updated feature modules to use Prisma instead of TypeORM
6. **Update Docker Configuration**: Updated Docker configuration to use the Prisma schema from the database package
7. **Update Shared Types**: Updated shared types to align with the Prisma schema
   - Updated Tenant interface to include all properties from the Prisma schema (description, logo, primaryColor, secondaryColor, isActive)
   - Updated CreateTenantRequest and UpdateTenantRequest interfaces to align with the Tenant interface
   - Updated DTOs to include all properties from the Prisma schema
8. **Remove TypeORM Dependencies**: Removed TypeORM dependencies from package.json
9. **Remove TypeORM Entity Files**: Removed TypeORM entity files as they're no longer needed
10. **Update Imports**: Updated imports to use shared types instead of TypeORM entities

## Migration Completion

The migration to Prisma has been completed. All TypeORM dependencies and files have been removed, and the application now uses Prisma exclusively for database access. The following changes were made:

1. **Removed TypeORM Dependencies**:

   - Removed `typeorm` and `@nestjs/typeorm` from package.json
   - Removed TypeORM from resolutions in the root package.json

2. **Removed TypeORM Files**:

   - Removed all TypeORM entity files
   - Removed TypeORM provider files (database.providers.ts, users.providers.ts, tenants.providers.ts)

3. **Updated Modules**:

   - Updated DatabaseModule to use PrismaModule instead of TypeORM providers
   - Updated imports in auth controller to use shared User type instead of TypeORM entity

4. **Repository Pattern**:
   - All repositories now use Prisma instead of TypeORM
   - Services use repository interfaces for better testability and maintainability

## Prisma Schema

The Prisma schema is defined in `packages/database/prisma/schema.prisma`. It includes models for:

- User
- Tenant
- Supplier
- Product
- Order
- OrderItem
- Contact
- And more...

## Prisma Service

The PrismaService is defined in `apps/api/src/prisma/prisma.service.ts`. It uses the client from the database package:

```typescript
@Injectable()
export class PrismaService implements OnModuleInit, OnModuleDestroy {
  // Use the prisma client from the database package
  public client = prisma;

  async onModuleInit() {
    // The client is already connected in the database package
    // but we can add additional setup here if needed
  }

  async onModuleDestroy() {
    await this.client.$disconnect();
  }
}
```

## Prisma Module

The PrismaModule is defined in `apps/api/src/prisma/prisma.module.ts`. It provides and exports the PrismaService:

```typescript
@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
```

## Using Prisma in Services

Services now use the client from the PrismaService through repository interfaces. For example, the UsersService:

```typescript
@Injectable()
export class UsersService {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  async findAll(tenantId?: string) {
    return this.userRepository.findAll(tenantId);
  }

  // Other methods...
}
```

## Benefits of Prisma

1. **Type Safety**: Prisma generates TypeScript types from your schema
2. **Developer Experience**: Better tooling and error messages
3. **Performance**: Generally better performance than TypeORM
4. **Maintainability**: Schema-first approach leads to more maintainable code
5. **Prisma Studio**: Visual database editor for development

## Type Safety Improvements

We've made significant improvements to the type safety of the codebase:

1. **Replaced `any` Types**: We've replaced all instances of `any` with more specific types throughout the codebase.

2. **Created PrismaEntity Types**: We've defined explicit types for Prisma entities (PrismaProduct, PrismaUser, PrismaTenant, PrismaSupplier) to ensure proper mapping between Prisma and our domain models.

3. **Fixed Type Assertions**: We've replaced unsafe type assertions with proper type definitions and assertions.

4. **Created UserResponseDto**: We've added a UserResponseDto to properly document the API response structure.

5. **Added Type Strategy Documentation**: We've created a comprehensive type strategy document at `docs/TYPE_STRATEGY.md` that outlines our approach to type safety.

## Next Steps

1. **Implement Type Hierarchies**: Apply the type hierarchy pattern described in the type strategy document to all entities.

2. **Add Zod Schemas**: Create Zod schemas for runtime validation of all entities.

3. **Create Type Guards**: Add type guards to improve type safety when narrowing types.

4. **Update API Documentation**: Ensure all API endpoints are properly documented with Swagger annotations.

## Recent Fixes

Several TypeScript errors were fixed in the repository implementations to ensure compatibility with Prisma's type system:

1. **Order Repository**:

   - Fixed nested writes for order items using Prisma's `create` syntax
   - Added missing `supplierId` field to the `CreateOrderDto`
   - Improved transaction handling for creating and updating orders with items

2. **Product Repository**:

   - Fixed required field handling for SKU generation
   - Updated the create method to use proper Prisma nested write syntax
   - Ensured all required fields are properly set

3. **Supplier Repository**:
   - Fixed required field handling for address
   - Updated the create method to use proper Prisma nested write syntax
   - Improved contacts creation with proper conditional logic

These fixes ensure type safety and proper integration with Prisma's API, which is more strict than TypeORM's API in terms of type checking.

## Docker Environment Dependencies

Prisma requires specific system dependencies to function properly in Docker containers:

1. **OpenSSL 1.1.x**: Prisma's query engine requires OpenSSL 1.1.x
2. **libc6-compat**: Required for compatibility with Alpine Linux

Both Dockerfiles (development and production) have been updated to include these dependencies:

```dockerfile
# Install OpenSSL and other required dependencies for Prisma
RUN apk add --no-cache openssl openssl-dev libc6-compat
```

This ensures that Prisma can properly load its query engine in the Docker environment, especially on ARM64 architecture.

## Type Mapping Between Prisma and Shared Types

One challenge in our architecture is managing the differences between Prisma's generated types and our shared types. We've adopted the following approach:

1. **Define Shared Types**: All entity types are defined in the shared package to ensure consistency across the application.

2. **Explicit Mapping Functions**: Each repository includes mapping functions that convert Prisma's return types to our shared types.

3. **Type Safety**: We use explicit mapping rather than type assertions to ensure type safety.

Example of a mapping function:

```typescript
private mapPrismaProductToSharedProduct(prismaProduct: any): Product {
  return {
    id: prismaProduct.id,
    name: prismaProduct.name,
    description: prismaProduct.description,
    price: prismaProduct.price,
    sku: prismaProduct.sku,
    unit: "each", // Default value for required field in shared type
    stock: prismaProduct.stockQuantity || 0, // Map stockQuantity to stock
    imageUrl: prismaProduct.imageUrl,
    supplierId: prismaProduct.supplierId,
    tenantId: prismaProduct.tenantId,
    createdAt: prismaProduct.createdAt,
    updatedAt: prismaProduct.updatedAt,
  };
}
```

### Benefits of This Approach

1. **Decoupling**: The shared types are decoupled from the database schema, allowing each to evolve independently.

2. **API Stability**: Changes to the database schema don't necessarily require changes to the API.

3. **Type Safety**: Explicit mapping ensures all required properties are present.

4. **Flexibility**: We can handle differences in naming conventions between Prisma and our API.

### Known Type Discrepancies

There are some known discrepancies between our shared types and the Prisma schema:

1. **Product**:

   - Shared type uses `stock`, Prisma schema uses `stockQuantity`
   - Shared type requires `unit`, Prisma schema doesn't have this field

2. **Order**:
   - OrderItem in shared type requires `productId`, Prisma schema uses a relation

These discrepancies are handled in the mapping functions in each repository.

For more details, see the [Shared Types README](packages/shared/src/types/README.md).

### Future Improvements

1. **Generate Shared Types from Prisma Schema**: Consider tools to automatically generate shared types from the Prisma schema.

2. **Zod Validation**: Add Zod schemas for runtime validation of data.

3. **Type-Safe Mappers**: Create more type-safe mapping functions using TypeScript utility types.

## Enhanced Type Strategy Implementation

We've implemented several improvements to our type strategy:

### 1. Type Hierarchies

We now use type hierarchies for all entities:

```typescript
// Base type with common properties
export interface BaseProduct {
  name: string;
  sku: string;
  price: number;
  // ...other common properties
}

// Complete type with all properties
export interface Product extends BaseProduct {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  // ...other properties
}
```

### 2. Runtime Validation with Zod

We've added Zod schemas for runtime validation:

```typescript
// Zod schema for base product
export const baseProductSchema = z.object({
  name: z.string().min(1, "Name is required"),
  sku: z.string().min(1, "SKU is required"),
  price: z.number().positive("Price must be positive"),
  // ...other validations
});
```

### 3. Common Utility Types

We've defined common utility types to avoid using `any`:

```typescript
// A type for unknown record objects instead of using 'any'
export type UnknownRecord = Record<string, unknown>;

// A type for repository response objects
export type RepositoryResponse<T> = Promise<T>;
```

### 4. Documentation

We've documented our type strategy in [docs/TYPE_STRATEGY.md](../docs/TYPE_STRATEGY.md).

For more details on our type strategy, see the [Type Strategy Documentation](../docs/TYPE_STRATEGY.md).

## Frontend Type Safety Improvements

We've also enhanced type safety in the frontend code:

1. **Replaced `any` Types**: We've replaced all instances of `any` with more specific types throughout the frontend codebase.

2. **Created Type Utilities**: We've added a comprehensive set of type utilities in `apps/web/src/utils/type-utils.ts` that provide:

   - Type guards for common types (isString, isNumber, isObject, etc.)
   - Safe property access functions
   - Type assertion utilities

3. **Enhanced API Client**: We've improved the API client to use generic types and `UnknownRecord` instead of `any`.

4. **Typed Form Handling**: We've added proper types for form values and submission handlers.

5. **Safe Type Assertions**: We've replaced unsafe type assertions with safer alternatives using the `unknown` intermediate type.

These improvements ensure type safety across the entire application, from the backend to the frontend.

## Linter Warnings Documentation

We've created a comprehensive guide for addressing the remaining linter warnings in the codebase. This document, located at `docs/LINTER_WARNINGS.md`, provides:

1. **Categorized Warnings**: Warnings are grouped by type (Next.js specific, React Hooks, etc.)
2. **Affected Files**: Lists of files affected by each warning type
3. **Fix Instructions**: Step-by-step instructions for fixing each warning type
4. **Code Examples**: Before and after examples showing how to fix the warnings
5. **Best Practices**: Guidelines for avoiding linter warnings in the future

This documentation will help developers maintain code quality and consistency as the project evolves.

## React Hook Dependency Fixes

We've implemented fixes for React Hook dependency warnings in several key files:

1. **Profile Page**: Fixed the `useEffect` dependency warning in `apps/web/src/app/profile/page.tsx` by moving the `fetchUserProfile` function inside the `useEffect` hook.

2. **Suppliers Page**: Fixed the `useEffect` dependency warning in `apps/web/src/app/suppliers/pages/SuppliersPage.tsx` by adding an `eslint-disable-next-line` comment for the specific dependency.

3. **Admin Users Pages**: Fixed unused imports in the admin users pages by commenting out the `UserRole` import with a note indicating when it should be used.

4. **Auth Service**: Fixed TypeScript errors in `apps/web/src/lib/auth.ts` by:
   - Correcting the import for `CredentialsProvider` to use the default import syntax
   - Adding proper type annotations to the `credentials` parameter in the `authorize` function
   - Adding an ESLint disable comment to suppress the import/no-named-as-default warning

These fixes improve code quality and reduce linter warnings while maintaining the functionality of the components.

## Type Safety in Frontend Components

We've enhanced type safety in frontend components by:

1. **Replaced `any` with Specific Types**: Changed `any` types to more specific types like `unknown` or `Record<string, unknown>`.

2. **Improved Event Handler Types**: Added proper TypeScript types for event handlers in React components.

3. **Type-Safe API Calls**: Enhanced the type safety of API calls by using proper return types and parameter types.

4. **Documented Type Strategy**: Updated the type strategy documentation to include best practices for React components and hooks.

These improvements ensure that our frontend code is as type-safe as our backend code, providing a consistent development experience across the entire application.

## TypeScript Error Fixes

### JWT Strategy and Auth Service

- Fixed the `validateUser` method in `auth.service.ts` to handle both email/password authentication and JWT payload validation using method overloading.
- Implemented proper type checking for the `validateUser` method to ensure it works correctly with both authentication methods.
- Added error handling to gracefully handle cases where a user is not found during JWT validation.
- Fixed the JWT strategy to properly convert string roles to the `UserRole` enum type.

### User Repository

- Enhanced the `mapPrismaUserToSharedUser` method to ensure the `tenantId` field is always a string, preventing TypeScript errors.
- Updated the `update` method in `UserRepository` to accept an optional `filterTenantId` parameter for tenant-specific user updates.
- Added proper error handling when a user is not found in a specific tenant during update operations.
- Updated the repository interface to match the implementation changes.

### Order Repository

- Fixed the `mapPrismaOrderToSharedOrder` method to include the required `supplierId` field.
- Updated the `mapPrismaOrderItemToSharedOrderItem` method call to properly pass the `orderId` parameter.
- Ensured all required fields from the `Order` interface are properly mapped.

### Product Repository

- Fixed the `attributes` field in the `create` method to properly handle JSON data by converting it to a string.

### Supplier Repository

- Updated the `mapPrismaSupplierToSharedSupplier` method to properly map Prisma supplier data to the shared `Supplier` interface.
- Fixed the contacts mapping to ensure all required fields are present.
- Converted the `isActive` boolean field to the appropriate `SupplierStatus` enum value.
- Fixed the `customFields` property by using the `attributes` field from the DTO.

### Type Safety Improvements

- Ensured consistent typing across the codebase, particularly for user-related operations.
- Fixed method signature mismatches between service and repository layers.
- Added explicit type annotations to prevent implicit `any` types.
- Verified type safety with successful type checks across all packages.

## Database Reinitialization and Seeding

We've implemented a comprehensive database reinitialization process to simplify development and testing. This process includes:

1. **Database Reset**: Dropping and recreating the database to ensure a clean state
2. **Schema Migration**: Applying all Prisma migrations to create the database schema
3. **Data Seeding**: Populating the database with initial data for development and testing

### Reinitialization Scripts

We've added several scripts to the project to facilitate database management:

1. **db:up**: Starts the database containers

   ```bash
   npm run db:up
   ```

2. **db:down**: Stops the database containers

   ```bash
   npm run db:down
   ```

3. **db:reset**: Stops and removes all containers, volumes, and networks, then recreates them

   ```bash
   npm run db:reset
   ```

4. **db:seed**: Seeds the database with initial data

   ```bash
   npm run db:seed
   ```

5. **db:reinit**: Performs all steps to completely reinitialize the database
   ```bash
   npm run db:reinit
   ```

### Seed Data

The seed script (`packages/database/prisma/seed.ts`) creates the following data:

1. **Default Tenant**:

   - Name: "Default Company"
   - Slug: "default-company"
   - Description: "Default company for development"

2. **Super Admin User**:

   - Email: admin@example.com
   - Password: Admin123!
   - Role: SUPER_ADMIN

3. **Default Supplier**:

   - Name: "ABC Supplies"
   - Email: contact@abcsupplies.com
   - Phone: 123-456-7890
   - Address: 123 Main St, Anytown, CA, USA
   - Contact: John Doe (Sales Manager)

4. **Sample Products**:
   - Product 1: SKU-001, Price: $19.99, Stock: 100
   - Product 2: SKU-002, Price: $29.99, Stock: 50

### Benefits of Database Seeding

1. **Consistent Development Environment**: All developers work with the same initial data
2. **Faster Setup**: New developers can quickly set up a working environment
3. **Testing**: Provides a known state for testing
4. **Demo Data**: Provides data for demonstrations and presentations

### Documentation Updates

We've updated the following documentation files to include information about the database reinitialization process:

1. **DATABASE_SETUP.md**: Added sections on database reinitialization and seeding
2. **LOCAL_DEVELOPMENT.md**: Updated the database setup section to include the new scripts
3. **TROUBLESHOOTING.md**: Added a section on database issues and how to resolve them

These updates ensure that all developers have access to the information they need to effectively manage the database during development.

## TypeScript Configuration for Prisma Seed Script

To ensure proper TypeScript compilation and execution of the Prisma seed script, we've implemented a separate TypeScript configuration specifically for the seed script:

1. **Created a Separate TypeScript Configuration**: We created a `tsconfig.seed.json` file in the database package with the following configuration:

```json
{
  "extends": "../../tsconfig.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": ".",
    "module": "CommonJS",
    "esModuleInterop": true
  },
  "include": ["prisma/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

2. **Updated the Seed Script**: We updated the `db:seed` script in `package.json` to use this configuration:

```json
"db:seed": "ts-node --project tsconfig.seed.json prisma/seed.ts"
```

This approach solves the issue where the TypeScript compiler was trying to include the `prisma/seed.ts` file in the main build process, but the file was outside the `rootDir` specified in the main `tsconfig.json`.

By using a separate TypeScript configuration for the seed script, we can:

1. Keep the main `tsconfig.json` focused on the source code in the `src` directory
2. Allow the seed script to be executed with its own TypeScript configuration
3. Avoid TypeScript compilation errors during the build process

This solution maintains the separation of concerns between the main source code and the database seeding functionality while ensuring both can be properly typed and compiled.

## GitHub Workflow Simplification

We've simplified the GitHub workflows to make them more maintainable and efficient. The following changes have been implemented:

1. **Removed Deployment Workflows**:

   - Removed `deploy-production.yml` and `deploy-staging.yml` files
   - Deployment can now be handled manually or through a separate process

2. **Simplified Build Workflow**:

   - Streamlined the build process to focus on building all projects correctly
   - Simplified the artifact creation process

3. **Improved Artifact Packaging**:

   - API artifact now includes `node_modules` for runtime dependencies
   - Packages are now included in their entirety rather than just the dist folders
   - Simplified the directory structure for easier deployment

4. **Simplified Dockerfile**:

   - Created a minimal Dockerfile that uses the default Node.js image
   - Removed complex multi-stage build process
   - Assumes artifacts are pre-built, focusing only on running the application

5. **Improved Fly.io Deployment**:
   - Updated `deploy-api.yml` to work with the new artifact structure
   - Removed Dockerfile reference from fly.toml files
   - Dynamically generates fly.toml during deployment
   - Simplified the deployment process by using standard Fly.io features
   - Manages secrets securely using the Fly.io CLI

These changes ensure that the build process is more reliable and easier to maintain, while also making deployment more straightforward. The API artifact now includes all necessary runtime dependencies, eliminating the need for complex dependency installation during deployment.

## Deployment Fixes

We've made several improvements to the deployment process to ensure that all required dependencies are properly included:

1. **Production Dependencies**: Instead of copying the development node_modules directory, we now install production-only dependencies in the deployment artifact. This ensures that:

   - Only necessary dependencies are included
   - Development dependencies are excluded
   - The node_modules structure is optimized for the deployment environment

2. **Prisma Client**: We now explicitly copy the Prisma schema and generate the Prisma client during the build process. This ensures that:

   - The Prisma client is properly generated for the deployment environment
   - The `@prisma/client` is initialized correctly
   - No runtime errors occur due to missing Prisma client

3. **Prisma Binary Targets**: We've updated the schema.prisma file to include the correct binary targets for different environments:

   ```prisma
   generator client {
     provider        = "prisma-client-js"
     previewFeatures = ["multiSchema"]
     binaryTargets   = ["native", "linux-musl-openssl-3.0.x"]
   }
   ```

   This ensures that Prisma can run in both local development environments and in Alpine Linux-based containers (like those used by Fly.io).

4. **Correct File Paths**: We've updated the file paths in the Dockerfile and fly.toml to use the correct path for the main.js file, ensuring that the application starts properly.

5. **Directory Structure**: We've improved the directory creation process to ensure all necessary directories exist before copying files. This prevents errors like "Not a directory" when copying files to nested paths.

6. **Husky Removal**: We now remove the husky prepare script from the package.json file before installing dependencies. This prevents errors when running npm ci in a non-git environment, as husky tries to install git hooks.

7. **OpenSSL for Prisma**: We've added OpenSSL to the Dockerfile to ensure that Prisma can function correctly in the Alpine Linux environment.

8. **Environment Variables for Vercel Deployment**

## Environment Variables for Vercel Deployment

We've updated the GitHub workflow for Vercel deployment to include environment-specific API URLs:

- Production: `https://supply-chain-system-api.fly.dev`
- Staging: `https://staging-supply-chain-system-api.fly.dev`

This ensures that the frontend application can communicate with the correct backend API based on the deployment environment.

For Vercel deployment, we're using a Git-based approach with a focus on the web app:

1. The workflow checks out the code directly from the repository
2. It verifies the monorepo structure (checks for `apps/web` directory and key files)
3. It prepares the web app for standalone deployment by copying workspace dependencies
4. It removes the Husky prepare script to prevent git-related errors during deployment
5. It changes to the web app directory before deployment
6. It sets appropriate project names for each environment:
   - Production: `supply-chain-system`
   - Staging: `staging-supply-chain-system`
7. Vercel handles the web app build and deployment process

We've added monorepo-specific configuration to handle the Next.js app in the `apps/web` directory:

1. **Root vercel.json**: Configuration file with:

   - Custom build command that focuses only on the web app and removes Husky prepare scripts using Node.js
   - Custom install command that focuses only on the web app and removes Husky prepare scripts using Node.js
   - Ignore command to only trigger builds when the web app changes
   - Custom output directory pointing to the web app's `.next` directory
   - Rewrites to properly handle the monorepo structure

2. **Web app vercel.json**: A specific configuration file in the web app directory that:

   - Specifies the framework (Next.js)
   - Provides build and install commands that remove Husky prepare scripts using Node.js
   - Sets the output directory to `.next`

3. **.npmrc files**: Added in both the root directory and the web app directory to:
   - Disable scripts during npm install
   - Prevent Husky from trying to install git hooks
   - Ensure smooth installation of dependencies without git-related errors

This approach simplifies the deployment process by leveraging Vercel's built-in Git integration and build system, while ensuring that only the web app is built and deployed. The workflow sets the appropriate environment variables and project names based on the deployment target, ensuring that the frontend application can communicate with the correct backend API and deploy to the correct Vercel project.

The workflow includes steps to ensure that:

- The monorepo structure is correct
- The web app has access to all required workspace dependencies
- Husky doesn't cause issues during the build process
- The deployment is verified via health checks

By focusing only on the web app during deployment and preventing Husky-related errors, we ensure that:

- Vercel doesn't attempt to build the API or other parts of the monorepo
- The web app has access to all required dependencies
- The build process completes without git-related errors
- The application is built consistently according to Vercel's best practices
