#!/usr/bin/env node

/**
 * Script to reset a remote database using Prisma
 * This will:
 * 1. Drop all tables in the database
 * 2. Apply all migrations
 * 3. Seed the database with initial data
 *
 * Usage:
 * DATABASE_URL=your_remote_db_url node scripts/reset-remote-db.js
 */

const { execSync } = require("child_process");
const path = require("path");
const fs = require("fs");

// Configuration
const DATABASE_URL = process.env.DATABASE_URL;
const PROJECT_ROOT = path.resolve(__dirname, "..");
const PRISMA_SCHEMA_PATH = path.resolve(
  PROJECT_ROOT,
  "packages/database/prisma/schema.prisma",
);
const SQL_SEED_PATH = path.resolve(__dirname, "./seed-production.sql");
const PRISMA_CLI_PATH = path.resolve(PROJECT_ROOT, "node_modules/.bin/prisma");

// Validate environment
if (!DATABASE_URL) {
  console.error("Error: DATABASE_URL environment variable is required");
  console.error(
    "Usage: DATABASE_URL=your_remote_db_url node scripts/reset-remote-db.js",
  );
  process.exit(1);
}

if (!fs.existsSync(PRISMA_SCHEMA_PATH)) {
  console.error(`Error: Prisma schema not found at ${PRISMA_SCHEMA_PATH}`);
  process.exit(1);
}

// Check if local Prisma CLI exists
if (!fs.existsSync(PRISMA_CLI_PATH)) {
  console.error(`Error: Prisma CLI not found at ${PRISMA_CLI_PATH}`);
  console.error('Please run "npm install" to install dependencies');
  process.exit(1);
}

// Find executable paths
function findExecutablePath(command) {
  try {
    return execSync(`which ${command}`, { encoding: "utf8" }).trim();
  } catch (error) {
    // Try common locations
    const commonPaths = [
      "/usr/bin",
      "/usr/local/bin",
      `${process.env.HOME}/.nvm/versions/node/v23.9.0/bin`,
      `${process.env.HOME}/.nvm/versions/node/v22.8.0/bin`,
      `${process.env.HOME}/.nvm/versions/node/*/bin`,
      `${process.env.HOME}/.npm-global/bin`,
      "/opt/homebrew/bin",
    ];

    for (const basePath of commonPaths) {
      const fullPath = path.join(basePath, command);
      if (fs.existsSync(fullPath)) {
        return fullPath;
      }
    }

    return null;
  }
}

// Find Node.js path
const NODE_PATH = findExecutablePath("node");
if (!NODE_PATH) {
  console.error("Error: Node.js executable not found. Please install Node.js.");
  process.exit(1);
}

console.log(`Using Node.js at: ${NODE_PATH}`);
console.log(`Using Prisma CLI at: ${PRISMA_CLI_PATH}`);

// Helper function to run commands
function runCommand(command, options = {}) {
  try {
    console.log(`Running: ${command}`);
    return execSync(command, {
      stdio: "inherit",
      env: {
        ...process.env,
        PATH: `${path.dirname(NODE_PATH)}:${process.env.PATH}`,
        ...options.env,
      },
      ...options,
    });
  } catch (error) {
    if (options.ignoreError) {
      console.warn(`Command failed but continuing: ${command}`);
      return null;
    }
    console.error(`Command failed: ${command}`);
    console.error(error.message);
    process.exit(1);
  }
}

// Main function
async function main() {
  console.log("Starting database reset process...");
  console.log(`Using database: ${DATABASE_URL.split("@")[1]}`);

  // Confirm with user
  if (process.argv.indexOf("--force") === -1) {
    console.log(
      "\n⚠️  WARNING: This will RESET your database, DELETING ALL DATA! ⚠️",
    );
    console.log("To skip this confirmation, run with --force flag\n");

    const readline = require("readline").createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    await new Promise((resolve) => {
      readline.question('Type "RESET" to confirm: ', (answer) => {
        if (answer !== "RESET") {
          console.log("Operation cancelled.");
          process.exit(0);
        }
        readline.close();
        resolve();
      });
    });
  }

  // Step 1: Reset the database (drop all tables)
  console.log("\n--- Step 1: Resetting database ---");
  try {
    // Use direct command with NODE_PATH to ensure node is found
    runCommand(
      `${NODE_PATH} ${PRISMA_CLI_PATH} migrate reset --force --schema=${PRISMA_SCHEMA_PATH}`,
      {
        env: { DATABASE_URL },
      },
    );
  } catch (error) {
    console.warn("Prisma migrate reset failed, trying alternative approach...");

    // Try to drop schema directly with SQL
    try {
      const dbUrlMatch = DATABASE_URL.match(
        /postgresql:\/\/([^:]+):([^@]+)@([^:]+):([^/]+)\/(.+)/,
      );
      if (!dbUrlMatch) {
        throw new Error("Invalid DATABASE_URL format");
      }

      const [, DB_USER, DB_PASS, DB_HOST, DB_PORT, DB_NAME] = dbUrlMatch;

      // Create a temporary .pgpass file for passwordless connection
      const pgpassPath = path.resolve(__dirname, ".pgpass.tmp");
      fs.writeFileSync(
        pgpassPath,
        `${DB_HOST}:${DB_PORT}:${DB_NAME}:${DB_USER}:${DB_PASS}`,
      );
      fs.chmodSync(pgpassPath, "0600");

      try {
        // Drop and recreate schema
        const dropSchemaSQL = `
          DROP SCHEMA IF EXISTS supply_chain CASCADE;
          CREATE SCHEMA supply_chain;
        `;

        const tempSQLPath = path.resolve(__dirname, ".drop_schema.tmp.sql");
        fs.writeFileSync(tempSQLPath, dropSchemaSQL);

        const PSQL_PATH = findExecutablePath("psql") || "psql";
        runCommand(
          `PGPASSFILE=${pgpassPath} ${PSQL_PATH} -h ${DB_HOST} -p ${DB_PORT} -U ${DB_USER} -d ${DB_NAME} -f ${tempSQLPath}`,
        );
        console.log("Schema dropped and recreated successfully!");

        // Clean up
        fs.unlinkSync(tempSQLPath);
      } finally {
        // Clean up
        if (fs.existsSync(pgpassPath)) {
          fs.unlinkSync(pgpassPath);
        }
      }
    } catch (sqlError) {
      console.error("Failed to reset database with SQL approach:", sqlError);
      throw error; // Re-throw the original error
    }
  }

  // Step 2: Apply migrations
  console.log("\n--- Step 2: Applying migrations ---");
  runCommand(
    `${NODE_PATH} ${PRISMA_CLI_PATH} migrate deploy --schema=${PRISMA_SCHEMA_PATH}`,
    {
      env: { DATABASE_URL },
    },
  );

  // Step 3: Seed the database
  console.log("\n--- Step 3: Seeding database ---");

  // Try using Prisma seed first
  try {
    runCommand(
      `${NODE_PATH} ${PRISMA_CLI_PATH} db seed --schema=${PRISMA_SCHEMA_PATH}`,
      {
        env: { DATABASE_URL },
      },
    );
    console.log("Database seeded successfully using Prisma seed!");
  } catch (error) {
    console.warn("Prisma seed failed, falling back to SQL seed script...");

    // Extract connection details from DATABASE_URL
    const dbUrlMatch = DATABASE_URL.match(
      /postgresql:\/\/([^:]+):([^@]+)@([^:]+):([^/]+)\/(.+)/,
    );
    if (!dbUrlMatch) {
      console.error("Error: Invalid DATABASE_URL format");
      process.exit(1);
    }

    const [, DB_USER, DB_PASS, DB_HOST, DB_PORT, DB_NAME] = dbUrlMatch;

    // Create a temporary .pgpass file for passwordless connection
    const pgpassPath = path.resolve(__dirname, ".pgpass.tmp");
    fs.writeFileSync(
      pgpassPath,
      `${DB_HOST}:${DB_PORT}:${DB_NAME}:${DB_USER}:${DB_PASS}`,
    );
    fs.chmodSync(pgpassPath, "0600");

    try {
      // Find psql path
      const PSQL_PATH = findExecutablePath("psql") || "psql";

      // Run the SQL seed script
      runCommand(
        `PGPASSFILE=${pgpassPath} ${PSQL_PATH} -h ${DB_HOST} -p ${DB_PORT} -U ${DB_USER} -d ${DB_NAME} -f ${SQL_SEED_PATH}`,
      );
      console.log("Database seeded successfully using SQL script!");
    } finally {
      // Clean up
      if (fs.existsSync(pgpassPath)) {
        fs.unlinkSync(pgpassPath);
      }
    }
  }

  console.log("\n✅ Database reset and seeded successfully!");
}

main().catch((error) => {
  console.error("Error during database reset:", error);
  process.exit(1);
});
