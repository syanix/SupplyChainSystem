# Troubleshooting Guide

This guide provides solutions for common issues you might encounter when setting up and running the Supply Chain System.

## Table of Contents

1. [API Startup Issues](#api-startup-issues)
2. [Database Connection Issues](#database-connection-issues)
3. [Web Application Issues](#web-application-issues)
4. [Authentication Issues](#authentication-issues)
5. [Build and Deployment Issues](#build-and-deployment-issues)

## API Startup Issues

### Node.js Internal Assertion Error

**Error:**

```
Error [ERR_INTERNAL_ASSERTION]: This is caused by either a bug in Node.js or incorrect usage of Node.js internals.
Please open an issue with this stack trace at https://github.com/nodejs/node/issues
```

**Causes:**

- Node.js version incompatibility (especially with Node.js v22+)
- ESM/CommonJS module conflicts
- Incompatible dependencies

**Solutions:**

1. **Downgrade Node.js version:**
   The most reliable solution is to use Node.js v18 LTS, which is the recommended version for this project.

   Using nvm (Node Version Manager):

   ```bash
   nvm install 18
   nvm use 18
   ```

   Or download directly from [Node.js website](https://nodejs.org/en/download/).

2. **Clear node_modules and reinstall:**

   ```bash
   rm -rf node_modules
   rm package-lock.json
   npm install
   ```

3. **Check for ESM/CommonJS conflicts:**
   If you've modified any files, ensure you're not mixing ESM (`import`/`export`) and CommonJS (`require`/`module.exports`) syntax inappropriately.

4. **Update tsconfig.json:**
   Ensure your `tsconfig.json` has the correct module settings:

   ```json
   {
     "compilerOptions": {
       "module": "CommonJS",
       "esModuleInterop": true
     }
   }
   ```

5. **Check NestJS configuration:**
   Ensure your `nest-cli.json` is properly configured:
   ```json
   {
     "collection": "@nestjs/schematics",
     "sourceRoot": "src",
     "compilerOptions": {
       "deleteOutDir": true
     }
   }
   ```

## Database Connection Issues

### Cannot Connect to PostgreSQL

**Error:**

```
Error: connect ECONNREFUSED 127.0.0.1:5432
```

**Causes:**

- PostgreSQL is not running
- PostgreSQL is running on a different port
- Incorrect connection string

**Solutions:**

1. **Verify PostgreSQL is running:**

   ```bash
   # For Docker setup
   docker ps | grep postgres

   # For manual installation
   pg_isready
   ```

2. **Check connection string in .env files:**

   Ensure your DATABASE_URL is correct:

   ```
   DATABASE_URL="postgresql://postgres:postgres@localhost:5432/supply_chain"
   ```

3. **Restart PostgreSQL:**

   ```bash
   # For Docker setup
   npm run db:reset

   # For manual installation
   sudo systemctl restart postgresql
   ```

### Database Schema Issues

**Error:**

```
PrismaClientInitializationError: Schema Error: Error in schema.prisma:
```

**Causes:**

- Outdated Prisma schema
- Failed migrations
- Database schema doesn't match Prisma schema

**Solutions:**

1. **Completely reinitialize the database:**

   ```bash
   npm run db:reinit
   ```

   This will:

   - Reset the Docker containers
   - Drop and recreate the database
   - Run all migrations
   - Seed the database with initial data

2. **Run migrations manually:**

   ```bash
   cd packages/database
   npx prisma migrate dev
   ```

3. **Generate Prisma client:**

   ```bash
   cd packages/database
   npx prisma generate
   ```

### Prisma Migration Error: Database Schema Not Empty

**Error:**

```
Error: P3005
The database schema is not empty. Read more about how to baseline an existing production database: https://pris.ly/d/migrate-baseline
```

**Causes:**

- Trying to run migrations on a database that already has tables
- Previous migrations failed to complete properly

**Solutions:**

1. **Drop and recreate the database:**

   ```bash
   # Using our script
   npm run db:reinit

   # Or manually with Docker
   docker exec -it supply-chain-postgres bash -c "psql -U postgres -c 'DROP DATABASE IF EXISTS supply_chain;' && psql -U postgres -c 'CREATE DATABASE supply_chain;'"
   ```

2. **Reset Prisma migrations:**

   ```bash
   cd packages/database
   npx prisma migrate reset --force
   ```

## Web Application Issues

### Next.js Build Errors

**Error:**

```
Error: Cannot find module '@supply-chain-system/ui'
```

**Solutions:**

1. **Build shared packages first:**

   ```bash
   cd packages/ui
   npm run build
   cd ../shared
   npm run build
   ```

2. **Check workspace configuration:**
   Ensure your `package.json` has the correct workspace configuration:
   ```json
   "workspaces": [
     "apps/*",
     "packages/*"
   ]
   ```

### API Connection Issues

**Error:**

```
FetchError: Failed to fetch API
```

**Solutions:**

1. **Ensure API is running:**
   Check that the API server is running on the correct port.

2. **Check CORS configuration:**
   Verify the API's CORS settings allow requests from your frontend.

3. **Verify environment variables:**
   Check that `NEXT_PUBLIC_API_URL` is set correctly in your `.env.local` file.

## Authentication Issues

### JWT Token Issues

**Error:**

```
Error: Invalid token
```

**Solutions:**

1. **Check JWT secret:**
   Ensure the `JWT_SECRET` in your API's `.env` file matches the one used for token generation.

2. **Verify token expiration:**
   Check the `JWT_EXPIRATION` setting in your API's `.env` file.

3. **Clear browser cookies:**
   Try clearing your browser cookies and logging in again.

## Build and Deployment Issues

### Turbo Build Failures

**Error:**

```
Error: Task dependencies failed
```

**Solutions:**

1. **Build packages in correct order:**

   ```bash
   npm run build --filter=@supply-chain-system/shared
   npm run build --filter=@supply-chain-system/database
   npm run build --filter=@supply-chain-system/ui
   npm run build --filter=api
   npm run build --filter=web
   ```

2. **Check Turbo configuration:**
   Verify your `turbo.json` has the correct pipeline configuration.

### TypeScript Errors

**Error:**

```
TS2307: Cannot find module '...' or its corresponding type declarations.
```

**Solutions:**

1. **Regenerate TypeScript declarations:**

   ```bash
   npm run build
   ```

2. **Check TypeScript configuration:**
   Verify your `tsconfig.json` has the correct paths configuration.

**Error:**

```
File '/path/to/file.ts' is not under 'rootDir' '/path/to/src'. 'rootDir' is expected to contain all source files.
```

**Causes:**

- Files outside the `rootDir` are being included in the TypeScript compilation
- Conflicting `include` patterns in `tsconfig.json`

**Solutions:**

1. **Create a separate TypeScript configuration for specific files:**

   If you have files like Prisma seed scripts that need to be compiled separately:

   ```bash
   # Create a separate tsconfig file (e.g., tsconfig.seed.json)
   {
     "extends": "../../tsconfig.json",
     "compilerOptions": {
       "rootDir": ".",
       "module": "CommonJS"
     },
     "include": ["prisma/**/*"]
   }
   ```

   Then update your script to use this configuration:

   ```json
   "db:seed": "ts-node --project tsconfig.seed.json prisma/seed.ts"
   ```

2. **Adjust your directory structure:**
   Move files to be within the `rootDir` specified in your `tsconfig.json`.

3. **Update your `rootDir` setting:**
   Change the `rootDir` to a common ancestor directory that includes all source files.

## Still Having Issues?

If you're still experiencing problems after trying these solutions:

1. Check the project's GitHub issues to see if others have encountered the same problem
2. Search for the specific error message online
3. Reach out to the development team for assistance

Remember to include:

- The exact error message
- Steps to reproduce the issue
- Your environment details (OS, Node.js version, npm version)
- Any changes you've made to the codebase
