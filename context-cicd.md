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

1. The build workflow creates a deployment package with all necessary files
2. The deployment workflow downloads the package and extracts it
3. The deployment workflow uses Fly.io CLI to deploy the API
4. Health checks verify the deployment was successful

### Frontend Deployment

1. The build workflow creates a deployment package with pre-built Next.js artifacts
2. The deployment workflow downloads the package and extracts it
3. The deployment workflow uses Vercel CLI to deploy the frontend with the `--prebuilt` flag
4. The deployment is automatically available at the Vercel URL

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
