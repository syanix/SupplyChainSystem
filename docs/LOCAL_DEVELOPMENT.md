# Running the Supply Chain System Locally

This guide provides step-by-step instructions for setting up and running the Supply Chain System on your local machine for development and testing purposes.

## Table of Contents

1. [System Requirements](#system-requirements)
2. [Initial Setup](#initial-setup)
   - [Repository Setup](#repository-setup)
   - [Environment Configuration](#environment-configuration)
   - [Database Setup](#database-setup)
3. [Running the System](#running-the-system)
   - [Development Mode](#development-mode)
   - [Production Build](#production-build)
4. [Accessing the Application](#accessing-the-application)
5. [First-Time Setup](#first-time-setup)
   - [Using Pre-Seeded Admin User](#using-pre-seeded-admin-user)
   - [Creating Your First User](#creating-your-first-user)
   - [Setting Up Your Company](#setting-up-your-company)
6. [Development Workflow](#development-workflow)
7. [Troubleshooting](#troubleshooting)

## System Requirements

Before you begin, ensure your system meets the following requirements:

- **Node.js**: Version 18.0.0 or higher
- **npm**: Version 10.2.4 or higher (comes with Node.js)
- **Git**: For version control
- **Docker**: For containerized database (optional but recommended)
- **PostgreSQL**: Version 15 or higher (if not using Docker)
- **Operating System**: Windows, macOS, or Linux

## Initial Setup

### Repository Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/SupplyChainSystem.git
   cd SupplyChainSystem
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

   This will install all dependencies for:

   - Root project
   - API (NestJS backend)
   - Web application (Next.js frontend)
   - Shared packages (database, UI components, shared utilities)

### Environment Configuration

1. Create root `.env` file:

   ```bash
   cp .env.example .env
   ```

2. Create API environment file:

   ```bash
   cp apps/api/.env.example apps/api/.env
   ```

3. Create Web environment file:

   ```bash
   cp apps/web/.env.example apps/web/.env.local
   ```

4. Update the environment files with your specific configuration:

   **Root `.env`**:

   ```
   # Database connection
   DATABASE_URL="postgresql://username:password@localhost:5432/supply_chain_db?schema=public"
   ```

   **API `.env`**:

   ```
   PORT=3001
   DATABASE_URL="postgresql://username:password@localhost:5432/supply_chain_db?schema=public"
   JWT_SECRET="your-jwt-secret-key"
   JWT_EXPIRATION="24h"
   SUPABASE_URL="your-supabase-url"
   SUPABASE_KEY="your-supabase-key"
   RESEND_API_KEY="your-resend-api-key"
   ```

   **Web `.env.local`**:

   ```
   NEXT_PUBLIC_API_URL=http://localhost:3001
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET="your-nextauth-secret-key"
   ```

### Database Setup

#### Option 1: Using Docker (Recommended)

1. Start the PostgreSQL container:

   ```bash
   npm run db:up
   ```

   This command uses Docker Compose to start a PostgreSQL container with the following configuration:

   - PostgreSQL version: 15
   - Port: 5432
   - Username: postgres
   - Password: postgres
   - Database: supply_chain

2. Initialize the database with schema and seed data:

   ```bash
   npm run db:reinit
   ```

   This comprehensive command:

   - Resets the Docker containers
   - Drops and recreates the database
   - Runs all migrations
   - Seeds the database with initial data

3. Alternatively, you can run these steps individually:

   ```bash
   # Start the database containers
   npm run db:up

   # Run database migrations
   cd packages/database
   npm run db:migrate

   # Seed the database with initial data
   npm run db:seed
   ```

#### Option 2: Manual PostgreSQL Setup

1. Install PostgreSQL on your system
2. Create a new database:

   ```bash
   createdb supply_chain_db
   ```

3. Update the `DATABASE_URL` in your environment files with your PostgreSQL credentials
4. Run database migrations:

   ```bash
   cd packages/database
   npm run migrate:dev
   ```

5. Seed the database with initial data (optional):
   ```bash
   npm run db:seed
   ```

## Running the System

### Development Mode

To run the entire system in development mode with hot reloading:

```bash
# From the root directory
npm run dev
```

This starts:

- API server on http://localhost:3001
- Web application on http://localhost:3000
- Watch mode for all shared packages

### Running Individual Components

To run specific components separately:

```bash
# Run only the API
cd apps/api
npm run start:dev

# Run only the web app
cd apps/web
npm run dev
```

### Production Build

To create a production build:

```bash
# From the root directory
npm run build
```

To start the production build:

```bash
npm run start
```

## Accessing the Application

Once the system is running, you can access:

- **Web Application**: http://localhost:3000
- **API Documentation**: http://localhost:3001/api/docs (Swagger UI)
- **API Endpoints**: http://localhost:3001/api

## First-Time Setup

### Using Pre-Seeded Admin User

If you've run the database seeding script, you can log in with the pre-created admin user:

- **Email**: admin@example.com
- **Password**: Admin123!

This user has SUPER_ADMIN privileges and is associated with the "Default Company" tenant.

### Creating Your First User

If you prefer to create a new user instead of using the seeded admin:

1. Access the registration endpoint:

   ```
   POST http://localhost:3001/api/auth/register
   ```

2. Send a JSON payload:

   ```json
   {
     "email": "admin@example.com",
     "password": "securepassword",
     "firstName": "Admin",
     "lastName": "User",
     "companyName": "Your Company Name"
   }
   ```

   You can use tools like Postman, cURL, or the Swagger UI to make this request.

3. This creates:

   - A new tenant (company)
   - An admin user for that tenant

4. You can now log in to the web application at http://localhost:3000/auth/login with your credentials.

### Setting Up Your Company

After creating your admin user and logging in:

1. Navigate to the dashboard
2. Set up your company profile in the settings
3. Add products, suppliers, and other data as needed

## Development Workflow

### Code Quality Tools

The project includes several tools to maintain code quality:

1. **Linting**:

   ```bash
   npm run lint
   ```

2. **Type Checking**:

   ```bash
   npm run type-check
   ```

3. **Formatting**:

   ```bash
   npm run format
   ```

4. **Run All Checks**:
   ```bash
   npm run check
   ```

### Making Changes

1. Create a new branch for your feature or fix
2. Make your changes
3. Run the quality checks
4. Test your changes locally
5. Commit and push your changes
6. Create a pull request

## Troubleshooting

### Common Issues

1. **Port Conflicts**:

   - If ports 3000 or 3001 are already in use, modify them in the respective `.env` files

2. **Database Connection Issues**:

   - Verify PostgreSQL is running: `docker ps` or `pg_isready`
   - Check connection string in `.env` files
   - Ensure the database exists: `psql -l`

3. **Dependency Issues**:

   - Try cleaning and reinstalling: `rm -rf node_modules && npm install`
   - Check for version conflicts: `npm ls`

4. **Build Errors**:

   - Check for TypeScript errors: `npm run type-check`
   - Verify all required environment variables are set

5. **Node.js Version Issues**:
   - This project is optimized for Node.js v18 LTS
   - If you encounter `ERR_INTERNAL_ASSERTION` errors, try downgrading to Node.js v18

For more detailed troubleshooting information, please refer to the [Troubleshooting Guide](./TROUBLESHOOTING.md).

### Resetting the Database

If you need to reset the database completely:

```bash
# Complete database reinitialization (drops and recreates everything)
npm run db:reinit
```

For other database operations:

```bash
# Just reset the containers (preserves data)
npm run db:reset

# Just run the seed script
npm run db:seed
```

### Logs

Check the logs for more detailed error information:

- **API Logs**: Check the terminal where the API is running
- **Web Logs**: Check the terminal where the Next.js app is running
- **Database Logs**: `docker-compose logs postgres` (if using Docker)

## Additional Resources

- [User Management Guide](./USER_MANAGEMENT.md)
- [API Documentation](./API.md)
- [Architecture Overview](./ARCHITECTURE.md)
- [Deployment Guide](./DEPLOYMENT.md)

For more detailed information about specific components, refer to the README files in each package directory.
