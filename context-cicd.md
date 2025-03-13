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

The build workflow is manually triggered via `workflow_dispatch`. It:

- Accepts an optional description parameter for the build
- Performs code quality checks (linting, type checking, formatting)
- Builds the application and packages
- Creates deployment artifacts
- Uploads artifacts to GitHub's artifact storage

### Deployment Workflows

Separate workflows for staging and production deployments:

- Accept an optional build ID parameter
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

- Updated all GitHub Actions to latest versions:
  - Updated actions/checkout from v3 to v4
  - Updated actions/setup-node from v3 to v4
  - Updated actions/download-artifact to v4 consistently
  - Updated superfly/flyctl-actions/setup-flyctl from master to 1.4
  - Updated amondnet/vercel-action from v20 to v25
  - This ensures compatibility with the latest GitHub Actions runner (2.322.0)
- Changed build workflow to manual trigger only:
  - Removed automatic trigger on push to main branch
  - Added optional description input parameter
  - This gives more control over when builds are created
- Fixed GitHub Actions artifact download permissions:
  - Added explicit `permissions` block with `actions: read` permission
  - Switched from `dawidd6/action-download-artifact@v2` to official `actions/download-artifact@v3`
  - Added `github-token` parameter to artifact download steps
  - This resolves the "Resource not accessible by integration" error
- Updated GitHub Actions artifact actions:
  - Upgraded actions/upload-artifact from v3 to v4
  - Upgraded actions/download-artifact from v3 to v4
  - Fixed "Missing download info" error in GitHub Actions workflow
- Separated build and deploy processes:
  - Created a dedicated build workflow that runs on push to main and on-demand
  - Build workflow creates deployment artifacts and uploads them to GitHub
  - Deployment workflows download artifacts and deploy them to environments
  - Added ability to specify which build to deploy via build ID
  - This improves reliability and allows for promoting the same build across environments
- Fixed GitHub Actions Fly.io deployment:
  - Corrected the usage of superfly/flyctl-actions/setup-flyctl action
  - Separated the setup and deployment steps
  - Fixed the rollback procedure to use flyctl directly
  - Removed invalid 'args' parameter that was causing warnings
- Fixed GitHub Pages deployment permissions:
  - Added explicit `permissions` section to the deployment dashboard workflow
  - Granted `contents: write` and `pages: write` permissions to the GITHUB_TOKEN
  - This resolves the 403 error when trying to push to the gh-pages branch
- Further optimized CI/CD workflow:
  - Streamlined code commit process to only run the `check` script (lint + type-check + format)
  - Kept full build and test process for pull requests
  - This improves CI performance for regular commits while maintaining thorough checks for PRs
- Improved CI/CD workflow:
  - Separated code quality checks from deployment workflows
  - Made staging and production deployments manually triggered via workflow_dispatch
  - Added confirmation step for deployments to prevent accidental deployments
  - Created separate workflow files for staging and production deployments
- Fixed GitHub Actions formatting check:
  - Updated all Prettier commands to use `npx prettier` instead of direct `prettier` calls
  - This resolves the "command not found" error in GitHub Actions
- Fixed GitHub Actions build errors related to TypeScript type checking:
  - Updated the build sequence to ensure shared packages are built before type checking
  - Added a new `build:packages` script to build only the shared packages
  - Modified the `type-check` task in turbo.json to depend on the `build` task
  - Standardized Node.js version to 20.x across all GitHub workflows
- Fixed pre-commit hook configuration to properly handle file paths:
  - Updated lint-staged configuration to use eslint and prettier directly instead of through turbo
  - This resolves issues with file paths being passed to turbo commands

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
