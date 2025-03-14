# Database Management Scripts

This directory contains scripts for managing the Supply Chain System database.

## Reset Remote Database

The `reset-remote-db.sh` and `reset-remote-db.js` scripts allow you to reset and seed a remote database using Prisma or direct SQL commands.

### Features

- Drops all tables in the database (or recreates the schema if Prisma fails)
- Applies all Prisma migrations
- Seeds the database with initial data (using Prisma seed or SQL script as fallback)
- Includes safety confirmation to prevent accidental resets

### Prerequisites

- Node.js and npm installed
- PostgreSQL client (`psql`) installed
- Prisma CLI installed (`npm install -g prisma`)
- Database connection URL

### Usage

```bash
# Using the shell script (recommended)
./scripts/reset-remote-db.sh "postgresql://username:password@hostname:port/database"

# Skip confirmation (for CI/CD pipelines)
./scripts/reset-remote-db.sh "postgresql://username:password@hostname:port/database" --force

# Using the Node.js script directly
DATABASE_URL="postgresql://username:password@hostname:port/database" node scripts/reset-remote-db.js
```

### Troubleshooting

If you encounter issues with the scripts:

1. Make sure both scripts are executable:

   ```bash
   chmod +x scripts/reset-remote-db.js scripts/reset-remote-db.sh
   ```

2. Check that Node.js and PostgreSQL client are installed and in your PATH:

   ```bash
   which node
   which psql
   ```

3. If using NVM, make sure you're using the correct Node.js version:

   ```bash
   nvm use
   ```

4. Verify your database connection URL is correct and the database server is accessible.

## SQL Seed Script

The `seed-production.sql` script contains SQL commands to seed the database with initial data. This is used as a fallback when the Prisma seed fails.

### Contents

- Creates multiple tenants (Default Company, Tech Solutions, Global Manufacturing)
- Creates users with different roles (Super Admin, Admin, Manager)
- Creates suppliers with contacts
- Creates products for each supplier
- Creates orders with order items

### Manual Execution

You can run the SQL seed script directly using `psql`:

```bash
psql -h hostname -p port -U username -d database -f scripts/seed-production.sql
```
