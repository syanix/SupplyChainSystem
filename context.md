# Supply Chain System Project Context

This document tracks the progress and context of the Supply Chain System project.

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

- Fixed GitHub Actions formatting check:
  - Updated all Prettier commands to use `npx prettier` instead of direct `prettier` calls
  - This resolves the "command not found" error in GitHub Actions
- Improved code quality checks:
  - Updated the `check` script to directly include Prettier format checking alongside linting and type checking
  - Maintained the `format` script for writing formatting changes
  - Updated GitHub Actions workflow to use Prettier directly for format checking
- Fixed GitHub Actions build errors related to TypeScript type checking:
  - Updated the build sequence to ensure shared packages are built before type checking
  - Added a new `build:packages` script to build only the shared packages
  - Modified the `type-check` task in turbo.json to depend on the `build` task
  - Standardized Node.js version to 20.x across all GitHub workflows
- Fixed pre-commit hook configuration to properly handle file paths:
  - Updated lint-staged configuration to use eslint and prettier directly instead of through turbo
  - This resolves issues with file paths being passed to turbo commands
- Fixed TypeScript issues with Next.js 15 page params by:
  - Converting client components to use server components for params handling
  - Properly handling params as Promises in server components
  - Removing invalid tenant prop from Layout component usage
- Fixed user role handling in the admin section
- Updated the `UpdateUserDto` to include the `isActive` field
- Corrected the field name from `active` to `isActive` in the user entity
- Set up CI/CD workflows for automated testing and deployment
- Created deployment configurations for Fly.io (staging and production)
- Implemented pre-commit hooks for code quality checks (linting, formatting, TypeScript)
- Added dedicated GitHub workflow for pull request code quality validation
- Created proper type definitions for Next.js 15 page params

### CI/CD Setup

- Implemented GitHub Actions workflows for:
  - Main CI/CD pipeline (testing, staging deployment, production deployment)
  - Database migrations workflow
  - Deployment dashboard
  - Pull request code quality checks
- Created Fly.io configuration files for staging and production environments
- Added comprehensive documentation for the CI/CD setup
- Set up pre-commit hooks using Husky and lint-staged

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

- Need to ensure proper tenant isolation in all database queries
- Need to optimize database performance for large datasets
- Need to implement comprehensive error handling throughout the application
- Several ESLint warnings need to be addressed:
  - Async client components (should be converted to use the pattern we implemented)
  - Missing React Hook dependencies
  - Usage of `<img>` elements instead of Next.js `<Image />` components
  - Explicit `any` types that should be replaced with more specific types

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
