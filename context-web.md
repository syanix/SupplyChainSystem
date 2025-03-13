# Web Frontend Context

This document contains detailed information about the web frontend of the Supply Chain System project. For a high-level overview of the entire project, see [main context](./context.md).

## Overview

The web frontend is built with Next.js 15 and provides the user interface for the Supply Chain System. It includes dashboards, order management interfaces, supplier management, and administrative tools.

## Architecture

- **Framework**: Next.js 15 with App Router
- **State Management**: React Context API and SWR for data fetching
- **Styling**: Tailwind CSS with custom components
- **Authentication**: NextAuth.js integrated with our API
- **Deployment**: Vercel with pre-built artifacts

## Recent Changes

- Updated robots.txt to block all search engine indexing:
  - Added comprehensive rules to disallow all web crawlers
  - Explicitly blocked major search engine bots (Google, Bing, Yahoo, etc.)
  - Removed sitemap reference to prevent discovery
  - This ensures the application remains private and not indexed by search engines
- Fixed TypeScript issues with Next.js 15 page params:
  - Converted client components to use server components for params handling
  - Properly handling params as Promises in server components
  - Removing invalid tenant prop from Layout component usage
- Implemented pre-built artifacts deployment strategy:
  - Added `--prebuilt` flag to Vercel deployments
  - This improves deployment speed and consistency across environments
- Fixed Vercel deployment configuration:
  - Removed `alias-domains` parameter from GitHub Actions workflow
  - This parameter should only be added once you have domains set up and ready to use
  - Keeping the `root-directory: .` parameter to ensure correct path resolution
- Fixed Vercel deployment path issues:
  - Added `root-directory: .` parameter to the Vercel GitHub Action configuration
  - This resolves the error where Vercel was looking for a non-existent path: `~/work/SupplyChainSystem/SupplyChainSystem/apps/web/apps/web`
  - The issue was caused by Vercel incorrectly combining the working-directory with the project path
- Added Vercel deployment configuration:
  - Created `vercel.json` with custom build command for the monorepo setup
  - Added security headers for enhanced application security
  - Disabled automatic GitHub deployments to align with our manual deployment workflow
  - Created `.vercelignore` to optimize deployment by excluding unnecessary files

## Directory Structure

```
apps/web/
├── app/                  # Next.js App Router
│   ├── (auth)/           # Authentication routes
│   ├── (dashboard)/      # Dashboard routes
│   ├── api/              # API routes
│   └── ...
├── components/           # React components
├── lib/                  # Utility functions
├── public/               # Static assets
│   ├── robots.txt        # Search engine crawling rules
│   └── ...
└── ...
```

## Key Components

- **Dashboard**: Main interface for users to view their data
- **Order Management**: Interface for creating and managing orders
- **Supplier Management**: Interface for managing suppliers
- **User Management**: Admin interface for managing users
- **Settings**: Interface for managing tenant settings

## Known Issues

- Several ESLint warnings need to be addressed:
  - Async client components (should be converted to use the pattern we implemented)
  - Missing React Hook dependencies
  - Usage of `<img>` elements instead of Next.js `<Image />` components
  - Explicit `any` types that should be replaced with more specific types
- Need to improve error handling in form submissions
- Need to add more comprehensive loading states
- Mobile responsiveness needs improvement in some areas

## Next Steps

- Implement comprehensive client-side validation
- Add more interactive data visualizations
- Improve accessibility compliance
- Implement comprehensive error boundaries
- Add end-to-end tests with Playwright
