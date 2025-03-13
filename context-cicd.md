# CI/CD Context

This document contains detailed information about the CI/CD setup of the Supply Chain System project. For a high-level overview of the entire project, see [main context](./context.md).

## Overview

The CI/CD pipeline automates testing, building, and deployment of the Supply Chain System. It uses GitHub Actions for automation, Fly.io for API hosting, and Vercel for frontend hosting.

## Architecture

- **CI/CD Platform**: GitHub Actions
- **API Hosting**: Fly.io with Docker
- **Frontend Hosting**: Vercel
- **Database Hosting**: Supabase
- **Artifact Storage**: GitHub Artifacts

## Workflows

### Build Workflow

The CI Build workflow is triggered automatically on code commits to the main branch and can also be manually triggered via `workflow_dispatch`. It:

- Runs automatically when changes are made to relevant files (apps, packages, config files)
- Accepts an optional description parameter for manual builds
- Performs code quality checks (linting, type checking, formatting)
- Builds the application and packages
- Creates deployment artifacts
- Uploads artifacts to GitHub's artifact storage

### Deployment Workflows

Separate workflows for staging and production deployments:

- Accept an optional build ID parameter
- Accept an optional run ID parameter to specify which workflow run contains the artifacts
- Automatically find the latest successful build if no run ID is specified
- Download the specified build (or latest if not specified)
- Deploy to the appropriate environment
- Perform health checks after deployment

### Database Migration Workflow

A dedicated workflow for database migrations that:

- Applies migrations to the database
- Handles schema changes safely
- Can be run independently of deployments

### Pull Request Workflow

A workflow that runs on pull requests to:

- Check code quality
- Run tests
- Ensure the application builds successfully

## Recent Changes

### Fly.io Standard Build Configuration (2023-11-25)

We've transitioned from a custom Dockerfile to Fly.io's standard build process:

1. **Change**: Replaced the custom Dockerfile-based build with Fly.io's standard buildpacks and removed the Dockerfile entirely.

2. **Configuration Updates**:

   - Added `builder = "heroku/buildpacks:20"` and `buildpacks = ["heroku/nodejs"]` to use Node.js buildpacks
   - Set `app = "npm run start:prod"` to use the correct start command
   - Added GitHub integration settings to enable direct deployments from the Syanix GitHub organization
   - Configured rolling deployment strategy for zero-downtime updates
   - Added custom build command `npm run build:all` to handle monorepo dependencies
   - Enabled monorepo support with `enable_monorepo = true` in the experimental section
   - Set `PROJECT_PATH = "apps/api"` to specify the API project within the monorepo
   - Removed the Dockerfile as it's no longer needed with the buildpack approach

3. **Benefits**:
   - Simplified build process that follows platform standards
   - Automatic dependency installation and build optimization
   - Direct GitHub integration for streamlined deployments
   - Reduced maintenance overhead for build configurations
   - Proper handling of monorepo package dependencies
   - Automatic rollback capability for failed deployments
   - Cleaner repository without redundant Docker configuration

This change leverages Fly.io's native capabilities for building and deploying Node.js applications, eliminating the need for custom Docker configuration while maintaining the same functionality.

### Fly.io Process Command Format Update (2023-11-24)

We've further refined the Fly.io process command format to resolve persistent issues:

1. **Issue**: Despite our previous fix, the deployment was still failing with the error `Error: Invalid format 'node dist/main'`.

2. **Root Cause**: Fly.io's process command format in the `[processes]` section requires a specific format with an explicit working directory.

3. **Solution**: Updated both `fly.toml` and `fly.staging.toml` files to use a command that explicitly sets the working directory:
   ```toml
   [processes]
     app = "cd /app/apps/api && node dist/main"
   ```

This change ensures that Fly.io can properly execute the command in the correct directory context, allowing the NestJS application to start successfully after deployment.

### TypeORM Configuration Fix (2023-11-23)

We've resolved the persistent NestJS dependency injection error with TypeORM:

1. **Issue**: Despite previous fixes, the application was still failing with `UnknownDependenciesException: Nest can't resolve dependencies of the TypeOrmCoreModule (TypeOrmModuleOptions, ?). Please make sure that the argument ModuleRef at index [1] is available in the TypeOrmCoreModule context.`

2. **Root Cause**: The issue was related to how TypeORM was being configured in NestJS v11. The `forRootAsync` method in TypeORM v11 has a different dependency structure that requires a ModuleRef that wasn't being properly provided.

3. **Solution**: Simplified the TypeORM configuration by using the synchronous `forRoot` method instead of `forRootAsync`:
   - Replaced the async configuration with a direct configuration using process.env variables
   - Added `autoLoadEntities: true` to ensure all entities are properly registered
   - Maintained the same SSL and synchronize settings based on environment

This change eliminates the dependency on ModuleRef that was causing the injection error, allowing the application to start successfully.

### Fly.io Process Command Fix (2023-11-22)

We've fixed an issue with the Fly.io deployment process command format:

1. **Issue**: The deployment was failing with the error `Error: Invalid format 'node dist/main.js'` when trying to start the application.

2. **Root Cause**: Fly.io's process command format in the `[processes]` section of the `fly.toml` file was incorrectly specified with the `.js` extension.

3. **Solution**: Updated both `fly.toml` and `fly.staging.toml` files to use the correct process command format:
   ```toml
   [processes]
     app = "node dist/main"
   ```

This fix ensures that Fly.io can properly start the NestJS application after deployment.

### TypeORM Dependency Fix (2023-11-21)

We've resolved a critical NestJS dependency injection error that was preventing the API from starting:

1. **Issue**: The application was failing with `UnknownDependenciesException: Nest can't resolve dependencies of the TypeOrmCoreModule (TypeOrmModuleOptions, ?)`

2. **Root Cause**: The error was caused by a version mismatch between NestJS core packages and TypeORM integration after upgrading to NestJS v11.

3. **Solution**: Updated the TypeOrmModule configuration in app.module.ts:
   - Simplified the TypeORM configuration to use a more compatible format
   - Added proper SSL configuration for production environments
   - Ensured proper entity loading

This fix ensures that the API can properly connect to the database and start successfully, resolving the deployment failures.

### Environment Variable Handling (2023-11-20)

We've clarified how environment variables are handled in our deployment process:

1. **Build-Time Variable Substitution**: GitHub Actions automatically substitutes secret references like `${{ secrets.PRODUCTION_DATABASE_URL }}` with their actual values during the build process:

   - The correct environment variables are embedded in the Fly.io configuration files during build
   - No additional substitution is needed during deployment

2. **Secure Credential Management**: Environment-specific credentials are stored as GitHub Secrets:
   - `PRODUCTION_DATABASE_URL` and `STAGING_DATABASE_URL` for database connections
   - `PRODUCTION_JWT_SECRET` and `STAGING_JWT_SECRET` for JWT authentication
   - `FLY_API_TOKEN` for Fly.io authentication

This approach ensures that our application has access to the correct environment variables during runtime while maintaining security best practices.

### Workflow Permissions Update (2023-11-19)

We've updated the permissions configuration in our deployment workflows to address the "Resource not accessible by integration" error:

1. **Explicit Permissions**: Added explicit permissions blocks to all workflow files:

   - `deploy.yml`: Added `actions: write` permission to allow triggering other workflows
   - `deploy-api.yml` and `deploy-web.yml`: Added `actions: read` permission to access artifacts

2. **Personal Access Token Fallback**: Added support for using a Personal Access Token (PAT) as a fallback:

   - The workflows now check for a `PAT_TOKEN` secret before falling back to the default `GITHUB_TOKEN`
   - This provides flexibility when the default token doesn't have sufficient permissions

3. **Fly.io Authentication**: Added Fly.io API token authentication to the API deployment workflow:
   - The workflow now uses the `FLY_API_TOKEN` secret for authentication with Fly.io
   - This resolves the "No access token available" error during deployment

These changes ensure that our workflows have the necessary permissions and authentication to access artifacts, trigger other workflows, and deploy to our hosting platforms.

### Multi-Stage Deployment Workflows (2023-11-18)

We've implemented a more flexible multi-stage deployment architecture:

1. **Separated Deployment Workflows**: Created dedicated workflows for API and Web deployments:

   - `deploy-api.yml`: Handles API deployment to Fly.io
   - `deploy-web.yml`: Handles Web deployment to Vercel
   - `deploy.yml`: Combined workflow that can trigger both deployments in parallel

2. **Parallel Deployments**: API and Web deployments can now run in parallel, reducing overall deployment time.

3. **Manual Triggering**: All deployments require manual triggering with explicit confirmation, preventing accidental deployments.

4. **Selective Deployment**: The combined workflow allows selecting which components to deploy (API, Web, or both).

5. **Environment Selection**: Each workflow supports deploying to either staging or production environments.

6. **Artifact Flexibility**: Deployments can use artifacts from any successful build by specifying the run ID or build ID.

This architecture provides greater control and flexibility over the deployment process while maintaining security and reliability.

### Security Enhancement: Credentials Management (2023-11-17)

We've implemented a critical security improvement in how we handle sensitive credentials:

1. **GitHub Secrets**: Moved all sensitive credentials (database URLs, JWT secrets) from hardcoded values in workflow files to GitHub Secrets.

2. **Environment-Specific Secrets**: Created separate secrets for production and staging environments:

   - `PRODUCTION_DATABASE_URL` and `STAGING_DATABASE_URL`
   - `PRODUCTION_JWT_SECRET` and `STAGING_JWT_SECRET`

3. **Secret Injection**: These secrets are now injected into the Fly.io configuration during the build process.

This change significantly improves our security posture by:

- Preventing credential exposure in the repository
- Limiting access to sensitive information
- Following security best practices for CI/CD pipelines
- Enabling easier credential rotation without code changes

### Improved Package Lock Handling (2023-11-16)

We've enhanced our build and deployment processes to better handle package-lock.json mismatches:

1. **Fallback Installation Strategy**: Both the CI workflow and Dockerfile now attempt `npm ci` first, but fall back to `npm install` if the package-lock.json is out of sync with package.json.

2. **Automatic Recovery**: This ensures that builds don't fail due to package-lock.json mismatches, which can happen after dependency version updates.

This improvement makes our CI/CD pipeline more resilient to dependency changes and reduces build failures.

### NestJS Dependency Version Alignment (2023-11-15)

We've implemented a more robust solution for handling NestJS dependency version conflicts:

1. **Source Package Alignment**: All NestJS package versions are now directly aligned in the source package.json files, ensuring consistency between the root package.json resolutions and the API package.json dependencies.

2. **Simplified Build Process**: The build workflow no longer needs to dynamically extract and apply NestJS versions during the build process, as they're already aligned in the source files.

3. **Removed Legacy Peer Deps Flag**: We've removed the `--legacy-peer-deps` flag from the Dockerfile's npm installation command, opting for a cleaner approach that properly resolves dependencies.

This approach ensures that all NestJS packages are consistently versioned throughout the project, preventing "Cannot find module" errors and version conflicts during deployment.

### Benefits of the New Approach:

- **Maintainability**: Single source of truth for NestJS versions in the source package.json files
- **Reliability**: Prevents version drift between different parts of the application
- **Cleaner Builds**: No need for workarounds like `--legacy-peer-deps`
- **Simplified CI/CD**: Build workflow no longer needs complex jq commands to align versions
- **Future-Proofing**: Makes upgrading NestJS versions simpler in the future

### Previous Issues Resolved:

- "npm error ERESOLVE could not resolve" during Docker build
- "Cannot find module '@nestjs/config'" errors in production
- Inconsistent behavior between local development and production environments

## Deployment Process

### API Deployment

The API deployment process now uses the `deploy-api.yml` workflow:

1. **Manual Trigger**: The workflow is manually triggered with required confirmation.
2. **Environment Selection**: The target environment (staging or production) is specified.
3. **Artifact Selection**: The build artifacts to deploy are selected (latest or specific build).
4. **Deployment**: The API is deployed to Fly.io using the appropriate configuration.
5. **Verification**: Health checks verify the deployment was successful.
6. **Rollback**: Automatic rollback occurs if verification fails.

### Web Deployment

The Web deployment process now uses the `deploy-web.yml` workflow:

1. **Manual Trigger**: The workflow is manually triggered with required confirmation.
2. **Environment Selection**: The target environment (staging or production) is specified.
3. **Artifact Selection**: The build artifacts to deploy are selected (latest or specific build).
4. **Deployment**: The Web frontend is deployed to Vercel using the `--prebuilt` flag.
5. **Verification**: Health checks verify the deployment was successful.

### Combined Deployment

The combined deployment process uses the `deploy.yml` workflow:

1. **Manual Trigger**: The workflow is manually triggered with required confirmation.
2. **Component Selection**: The components to deploy (API, Web, or both) are selected.
3. **Environment Selection**: The target environment (staging or production) is specified.
4. **Parallel Execution**: Selected deployment workflows are triggered in parallel.
5. **Independent Verification**: Each deployment is independently verified.

## Environment Configuration

- **Development**: Local environment for development
- **Staging**: Testing environment for QA and validation
- **Production**: Live environment for end users

Each environment has its own configuration for:

- API endpoints
- Database connections
- Feature flags
- Logging levels

## Known Issues

- Need to implement more comprehensive health checks
- Need to add more automated tests to the CI pipeline
- Need to improve rollback procedures
- Need to add performance testing to the CI pipeline
- Need to implement blue-green deployments for zero downtime

## Next Steps

- Implement comprehensive monitoring and alerting
- Add performance testing to the CI pipeline
- Implement blue-green deployments
- Add security scanning to the CI pipeline
- Implement automated database backups before migrations
