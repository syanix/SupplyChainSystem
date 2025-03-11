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

### Connection Refused

**Error:**

```
Error: connect ECONNREFUSED 127.0.0.1:5432
```

**Solutions:**

1. **Ensure PostgreSQL is running:**

   ```bash
   # If using Docker
   docker ps | grep postgres

   # If using local PostgreSQL
   pg_isready
   ```

2. **Check connection string:**
   Verify your `.env` file has the correct DATABASE_URL:

   ```
   DATABASE_URL="postgresql://username:password@localhost:5432/supply_chain_db?schema=public"
   ```

3. **Restart PostgreSQL:**

   ```bash
   # If using Docker
   docker-compose restart postgres

   # If using local PostgreSQL
   sudo service postgresql restart  # Linux
   brew services restart postgresql  # macOS
   ```

### Authentication Failed

**Error:**

```
Error: password authentication failed for user "username"
```

**Solutions:**

1. **Check credentials:**
   Verify the username and password in your DATABASE_URL match your PostgreSQL configuration.

2. **Reset PostgreSQL container:**
   ```bash
   npm run db:reset
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
