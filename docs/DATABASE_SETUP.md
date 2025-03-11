# Database Setup Guide

This guide provides detailed instructions for setting up and configuring the PostgreSQL database for the Supply Chain Management System.

## Overview

The Supply Chain Management System uses PostgreSQL as its primary database, with a multi-tenant architecture to ensure proper data isolation between different businesses using the platform.

## Setup Options

There are two main options for setting up the database:

1. **Docker (Recommended)**: Using the provided Docker Compose configuration
2. **Manual Installation**: Installing PostgreSQL directly on your system

## Docker Setup (Recommended)

### Prerequisites

- Docker and Docker Compose installed on your system
- Git repository cloned to your local machine

### Steps

1. **Start the PostgreSQL container**:

   ```bash
   # Navigate to the project root
   cd supply-chain-system

   # Start the PostgreSQL container
   docker-compose up -d postgres

   # To start both PostgreSQL and pgAdmin
   docker-compose up -d
   ```

2. **Verify the container is running**:

   ```bash
   docker-compose ps
   ```

   You should see the `supply-chain-postgres` container running.

3. **Access pgAdmin** (optional):

   Open your browser and navigate to http://localhost:5050
   
   Login credentials:
   - Email: admin@example.com
   - Password: admin

4. **Add the PostgreSQL server in pgAdmin**:

   1. Right-click on "Servers" in the left panel and select "Create" > "Server..."
   2. In the "General" tab, enter "Supply Chain DB" as the name
   3. In the "Connection" tab, enter:
      - Host: postgres
      - Port: 5432
      - Maintenance database: postgres
      - Username: postgres
      - Password: postgres
   4. Click "Save"

## Manual PostgreSQL Installation

If you prefer to install PostgreSQL directly on your system:

1. **Download and install PostgreSQL**:
   - [PostgreSQL Downloads](https://www.postgresql.org/download/)
   - Choose the version for your operating system (version 15 recommended)

2. **Create a new database**:

   ```sql
   CREATE DATABASE supply_chain;
   ```

3. **Create a user and grant privileges**:

   ```sql
   CREATE USER supply_chain_user WITH PASSWORD 'your_password';
   GRANT ALL PRIVILEGES ON DATABASE supply_chain TO supply_chain_user;
   ```

4. **Update your environment variables**:

   ```
   DATABASE_URL="postgresql://supply_chain_user:your_password@localhost:5432/supply_chain"
   ```

## Database Schema and Migrations

The database schema is managed using Prisma ORM. The schema definition can be found in `packages/database/prisma/schema.prisma`.

### Applying Migrations

To apply the database schema and migrations:

```bash
# Navigate to the database package
cd packages/database

# Install dependencies
npm install

# Apply migrations
npx prisma migrate dev
```

### Generating Prisma Client

After applying migrations, generate the Prisma client:

```bash
npx prisma generate
```

## Multi-Tenant Architecture

The system uses a multi-tenant architecture with the following features:

1. **Tenant Isolation**: Each table includes a `tenant_id` column to ensure data isolation
2. **Row-Level Security (RLS)**: PostgreSQL RLS policies enforce tenant isolation at the database level
3. **Middleware Validation**: API requests are validated to ensure users can only access their tenant's data

## Database Backup and Restore

### Creating a Backup

```bash
# For Docker setup
docker exec supply-chain-postgres pg_dump -U postgres supply_chain > backup.sql

# For manual installation
pg_dump -U postgres supply_chain > backup.sql
```

### Restoring from Backup

```bash
# For Docker setup
cat backup.sql | docker exec -i supply-chain-postgres psql -U postgres -d supply_chain

# For manual installation
psql -U postgres -d supply_chain < backup.sql
```

## Troubleshooting

### Connection Issues

If you're having trouble connecting to the database:

1. **Check if PostgreSQL is running**:

   ```bash
   # For Docker setup
   docker-compose ps
   
   # For manual installation
   sudo systemctl status postgresql
   ```

2. **Verify connection parameters**:

   ```bash
   # For Docker setup
   docker exec supply-chain-postgres psql -U postgres -c "SELECT 1"
   
   # For manual installation
   psql -U postgres -c "SELECT 1"
   ```

3. **Check logs**:

   ```bash
   # For Docker setup
   docker-compose logs postgres
   
   # For manual installation
   sudo journalctl -u postgresql
   ```

### Reset Database

To completely reset the database:

```bash
# For Docker setup
docker-compose down
docker volume rm supply-chain-system_postgres_data
docker-compose up -d postgres

# For manual installation
dropdb -U postgres supply_chain
createdb -U postgres supply_chain
```

## Additional Resources

- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [Docker PostgreSQL Image](https://hub.docker.com/_/postgres) 