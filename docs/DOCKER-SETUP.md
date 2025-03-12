# Supply Chain Management System - Docker Setup Guide

This document provides instructions for setting up the Supply Chain Management System using Docker, specifically focusing on the PostgreSQL database setup.

## Prerequisites

- Docker >= 20.10.0
- Docker Compose >= 2.0.0

## PostgreSQL Docker Setup

### Using Docker Compose

The project includes a `docker-compose.yml` file in the root directory that configures PostgreSQL for local development.

#### 1. Start PostgreSQL Container

To start the PostgreSQL database container:

```bash
# From the project root directory
docker-compose up -d
```

This command starts PostgreSQL in detached mode with the following configuration:

- PostgreSQL version: 15
- Container name: supply_chain_db
- Port: 5432 (mapped to host)
- User: username
- Password: password
- Database: supply_chain_db

#### 2. Verify Container Status

Check if the container is running properly:

```bash
docker-compose ps
```

You should see the `supply_chain_db` container listed as running.

#### 3. Access PostgreSQL

You can connect to the PostgreSQL instance using any PostgreSQL client with these credentials:

```
Host: localhost
Port: 5432
Username: username
Password: password
Database: supply_chain_db
```

Or connect using the command line:

```bash
docker exec -it supply_chain_db psql -U username -d supply_chain_db
```

#### 4. Stop PostgreSQL Container

To stop the PostgreSQL container:

```bash
docker-compose down
```

To stop and remove volumes (this will delete all data):

```bash
docker-compose down -v
```

### Environment Configuration

The Docker Compose setup uses the same database connection string as specified in the project's `.env` files:

```
DATABASE_URL="postgresql://username:password@localhost:5432/supply_chain_db?schema=public"
```

This ensures consistency between your Docker setup and application configuration.

## Database Initialization

After starting the PostgreSQL container, you need to initialize the database schema:

```bash
# From the project root directory
cd packages/database
npm run migrate:dev
```

Optionally, seed the database with initial data:

```bash
npm run db:seed
```

## Troubleshooting

### Common Issues

1. **Port conflicts**

   - If port 5432 is already in use, modify the port mapping in `docker-compose.yml`

2. **Container not starting**

   - Check Docker logs: `docker-compose logs postgres`

3. **Connection refused**

   - Ensure the container is running: `docker-compose ps`
   - Verify network settings: `docker network ls`

4. **Data persistence issues**
   - Check volume configuration: `docker volume ls`

## Advanced Configuration

### Customizing PostgreSQL Settings

To customize PostgreSQL configuration, you can add a custom `postgresql.conf` file:

1. Create a `postgres/` directory in the project root
2. Add your custom `postgresql.conf` file
3. Update the `docker-compose.yml` to mount this file:

```yaml
volumes:
  - ./postgres/postgresql.conf:/etc/postgresql/postgresql.conf
  - postgres_data:/var/lib/postgresql/data
command: postgres -c 'config_file=/etc/postgresql/postgresql.conf'
```

### Using Environment Variables

For better security in production environments, consider using environment variables instead of hardcoded credentials:

1. Create a `.env` file in the project root:

```
POSTGRES_USER=username
POSTGRES_PASSWORD=password
POSTGRES_DB=supply_chain_db
```

2. Update the `docker-compose.yml` to use these variables:

```yaml
environment:
  POSTGRES_USER: ${POSTGRES_USER}
  POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
  POSTGRES_DB: ${POSTGRES_DB}
```

## Integration with Development Workflow

For a streamlined development workflow, you can add the following scripts to your `package.json`:

```json
"scripts": {
  "db:up": "docker-compose up -d",
  "db:down": "docker-compose down",
  "db:reset": "docker-compose down -v && docker-compose up -d"
}
```

This allows you to easily manage the database container with npm commands.
