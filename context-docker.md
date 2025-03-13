# Docker Environment Context

This document provides context about the Docker environment setup for the Supply Chain System project.

## Overview

We've set up two Docker environments to facilitate development and testing:

1. **Local Development Environment**: A Docker Compose setup for day-to-day development with hot reloading
2. **Fly.io Simulation Environment**: A Docker setup that mirrors the Fly.io production environment

## Local Development Environment

The local development environment is defined in `docker-compose.yml` and uses the following components:

- **PostgreSQL**: A PostgreSQL 15 database container
- **API**: A NestJS API container built using `Dockerfile.dev`

### Key Features

- **Hot Reloading**: Changes to the source code are immediately reflected in the running application
- **Volume Mounting**: Source code is mounted into the container to enable hot reloading
- **Development Mode**: The API runs in development mode with enhanced logging and debugging
- **Health Checks**: PostgreSQL has health checks to ensure it's ready before starting the API

### Configuration

The environment variables for the local development environment are defined in `docker-compose.yml`:

```yaml
environment:
  - NODE_ENV=development
  - PORT=3001
  - DATABASE_URL=postgres://postgres:postgres@postgres:5432/supply_chain_system
```

## Fly.io Simulation Environment

The Fly.io simulation environment is defined in `scripts/simulate-fly-deploy.sh` and uses the following components:

- **PostgreSQL**: A PostgreSQL 15 database container
- **API**: A NestJS API container built using the production `Dockerfile`

### Key Features

- **Production Mode**: The API runs in production mode with optimized settings
- **No Volume Mounting**: The container uses the built code, just like in production
- **Network Isolation**: Containers run in a dedicated Docker network to simulate Fly.io's networking
- **Production Configuration**: Environment variables match those used in production

### Configuration

The environment variables for the Fly.io simulation environment are set in `scripts/simulate-fly-deploy.sh`:

```bash
-e NODE_ENV=production
-e PORT=3001
-e DATABASE_URL=postgres://postgres:postgres@fly-postgres:5432/supply_chain_system
```

## Dockerfiles

### Dockerfile.dev (Development)

The development Dockerfile (`apps/api/Dockerfile.dev`) is optimized for development:

- Installs all dependencies, including development dependencies
- Uses `npm install` instead of `npm ci` for faster installation
- Runs the application in development mode with hot reloading

### Dockerfile (Production)

The production Dockerfile (`apps/api/Dockerfile`) is optimized for production:

- Installs only production dependencies using `npm ci`
- Builds the application for production
- Sets the `NODE_ENV` environment variable to `production`
- Runs the application in production mode

## Scripts

We've created several scripts to manage the Docker environments:

- `scripts/local-test.sh`: Starts the local development environment
- `scripts/simulate-fly-deploy.sh`: Simulates a Fly.io deployment
- `scripts/cleanup.sh`: Cleans up all Docker containers and networks

## Best Practices

1. **Always test in the Fly.io simulation environment before deploying**:

   ```bash
   ./scripts/simulate-fly-deploy.sh
   ```

2. **Check logs if you encounter issues**:

   ```bash
   # For the development environment
   docker-compose logs -f api

   # For the Fly.io simulation
   docker logs -f fly-api
   ```

3. **Clean up when you're done**:

   ```bash
   ./scripts/cleanup.sh
   ```

4. **Update both Dockerfiles when making changes to dependencies**:
   - Update `apps/api/Dockerfile` for production
   - Update `apps/api/Dockerfile.dev` for development

## Troubleshooting

### Common Issues

1. **Database connection errors**:

   - Ensure PostgreSQL is running and healthy
   - Verify the `DATABASE_URL` environment variable is correct
   - Check if the database exists and has the correct schema

2. **API fails to start**:

   - Check the logs for error messages
   - Verify all required environment variables are set
   - Ensure the database is accessible

3. **Changes not reflected in the development environment**:

   - Ensure the volume mounts are correctly configured
   - Restart the container if necessary
   - Check if the file watcher is working correctly

4. **Production build fails**:

   - Check for TypeScript errors
   - Verify all dependencies are correctly installed
   - Ensure the build script is correctly configured

5. **Prisma OpenSSL errors**:
   - Prisma requires OpenSSL 1.1.x to function properly
   - Both Dockerfiles include `apk add --no-cache openssl openssl-dev libc6-compat` to install the required dependencies
   - If you encounter OpenSSL errors, ensure these packages are installed in your Docker image
