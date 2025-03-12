# PostgreSQL Setup Guide

This guide provides instructions for setting up PostgreSQL for the Supply Chain Management System using Docker.

## Prerequisites

- Docker and Docker Compose installed on your system
- Git repository cloned to your local machine

## Setup Instructions

### 1. Using Docker Compose

The easiest way to set up PostgreSQL is using the provided Docker Compose configuration:

```bash
# Start the PostgreSQL container
docker-compose up -d postgres

# To start both PostgreSQL and pgAdmin
docker-compose up -d
```

This will start a PostgreSQL server with the following configuration:

- **Host**: localhost
- **Port**: 5432
- **Username**: postgres
- **Password**: postgres
- **Database**: supply_chain

### 2. Accessing pgAdmin

The Docker Compose configuration also includes pgAdmin, a web-based administration tool for PostgreSQL:

- **URL**: http://localhost:5050
- **Email**: admin@example.com
- **Password**: admin

Once logged in, you can add a new server with the following details:

1. In the "General" tab:

   - **Name**: Supply Chain DB

2. In the "Connection" tab:
   - **Host**: postgres
   - **Port**: 5432
   - **Maintenance database**: postgres
   - **Username**: postgres
   - **Password**: postgres

### 3. Database Schema

The database schema is managed using Prisma ORM. The schema definition can be found in `packages/database/prisma/schema.prisma`.

To apply the schema to your database:

```bash
# Navigate to the database package
cd packages/database

# Install dependencies
npm install

# Apply migrations
npx prisma migrate dev
```

### 4. Environment Configuration

Make sure to update your environment variables to connect to the PostgreSQL database:

```
# .env file
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/supply_chain"
```

## Troubleshooting

### Connection Issues

If you're having trouble connecting to the database, try the following:

1. Ensure the Docker containers are running:

   ```bash
   docker-compose ps
   ```

2. Check the container logs:

   ```bash
   docker-compose logs postgres
   ```

3. Verify the PostgreSQL service is healthy:
   ```bash
   docker exec supply-chain-postgres pg_isready -U postgres
   ```

### Data Persistence

The PostgreSQL data is persisted in a Docker volume named `postgres_data`. If you need to reset the database completely:

```bash
# Stop the containers
docker-compose down

# Remove the volumes
docker volume rm supply-chain-system_postgres_data supply-chain-system_pgadmin_data

# Start the containers again
docker-compose up -d
```

## Manual PostgreSQL Installation

If you prefer to install PostgreSQL directly on your system instead of using Docker:

1. Download and install PostgreSQL from the [official website](https://www.postgresql.org/download/)
2. Create a new database named `supply_chain`
3. Update your environment variables to point to your local PostgreSQL installation

## Additional Resources

- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [Docker PostgreSQL Image](https://hub.docker.com/_/postgres)
