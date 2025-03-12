# CI/CD Setup for Supply Chain System

This document outlines the CI/CD workflows and deployment configurations for the Supply Chain System project.

## Workflows

### Main CI/CD Pipeline (`main.yml`)

The main CI/CD pipeline handles testing, building, and deploying the application to both staging and production environments.

**Triggers:**

- Push to `main`, `staging`, or `development` branches
- Pull requests to these branches

**Jobs:**

1. **Code Quality**: Runs type checking, linting, and formatting checks
2. **Test**: Runs tests and builds the application
3. **Deploy to Staging**: Deploys to staging environment when changes are pushed to the `staging` branch
4. **Deploy to Production**: Deploys to production environment when changes are pushed to the `main` branch

### Pull Request Checks (`pull-request.yml`)

This workflow runs code quality checks on pull requests to ensure code meets the project's standards.

**Triggers:**

- Pull requests to `main`, `staging`, or `development` branches

**Jobs:**

1. **Code Quality**: Runs type checking, linting, and formatting checks
2. **Test**: Runs tests and builds the application

### Database Migrations (`database-migrations.yml`)

This workflow manages database migrations for both staging and production environments.

**Triggers:**

- Push to `main` or `staging` branches with changes in the Prisma directory
- Manual trigger via GitHub Actions UI

**Jobs:**

1. **Migrate Staging**: Applies migrations to the staging database
2. **Migrate Production**: Applies migrations to the production database

### Deployment Dashboard (`deployment-dashboard.yml`)

This workflow updates a deployment dashboard hosted on GitHub Pages.

**Triggers:**

- Completion of the main CI/CD pipeline

**Jobs:**

1. **Update Dashboard**: Generates deployment data and publishes it to GitHub Pages

## Deployment Configurations

### Fly.io Configurations

The application is deployed to Fly.io using the following configuration files:

- **Production**: `apps/api/fly.toml`
- **Staging**: `apps/api/fly.staging.toml`

These files define:

- Application name
- Region
- Environment variables
- HTTP service configuration
- Health checks

## Environment Variables and Secrets

The following secrets need to be configured in GitHub:

- `FLY_API_TOKEN`: API token for Fly.io deployments
- `VERCEL_TOKEN`: API token for Vercel deployments
- `VERCEL_ORG_ID`: Organization ID for Vercel
- `VERCEL_PROJECT_ID`: Project ID for Vercel
- `SLACK_WEBHOOK_URL`: Webhook URL for Slack notifications
- `DATABASE_URL_STAGING`: Connection string for staging database
- `DATABASE_URL_PRODUCTION`: Connection string for production database

## Deployment Process

1. Changes are pushed to a branch
2. CI/CD pipeline runs tests
3. If tests pass and the branch is `staging` or `main`, deployment occurs
4. Database migrations are applied if there are changes to the Prisma schema
5. Deployment dashboard is updated with the latest deployment information

## Rollback Procedure

For production deployments, a health check is performed after deployment. If the health check fails, the deployment is automatically rolled back to the previous version.

## Manual Deployments

In case of emergency, manual deployments can be triggered using the GitHub Actions UI by selecting the appropriate workflow and clicking "Run workflow".

## Pre-commit Hooks

The project uses Husky and lint-staged to run code quality checks before commits:

1. **TypeScript Type Checking**: Ensures all TypeScript code is type-safe
2. **ESLint**: Checks for code quality issues and enforces coding standards
3. **Prettier**: Ensures consistent code formatting

These hooks are automatically installed when running `npm install` due to the `prepare` script in package.json.
