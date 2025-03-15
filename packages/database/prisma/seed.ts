import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcrypt";
import * as dotenv from "dotenv";
import * as path from "path";
import * as fs from "fs";

// Load environment variables from various locations
// Try to load from the current directory first
dotenv.config();

// Then try to load from the database package directory
dotenv.config({ path: path.resolve(__dirname, "../.env") });

// Then try to load from the project root
dotenv.config({ path: path.resolve(__dirname, "../../../.env") });

// Check if DATABASE_URL is set
if (!process.env.DATABASE_URL) {
  console.error("ERROR: DATABASE_URL environment variable is not set!");
  console.error("Please set it before running the seed script.");

  // Check if .env files exist in expected locations
  const envPaths = [
    path.resolve(__dirname, "../.env"),
    path.resolve(__dirname, "../../../.env"),
  ];

  console.error("\nChecking for .env files:");
  envPaths.forEach((envPath) => {
    const exists = fs.existsSync(envPath);
    console.error(`- ${envPath}: ${exists ? "EXISTS" : "MISSING"}`);

    if (exists) {
      try {
        const content = fs.readFileSync(envPath, "utf8");
        const hasDbUrl = content.includes("DATABASE_URL=");
        console.error(`  - Contains DATABASE_URL: ${hasDbUrl ? "YES" : "NO"}`);
      } catch (err: any) {
        console.error(`  - Error reading file: ${err.message}`);
      }
    }
  });

  process.exit(1);
}

console.log(
  "Using DATABASE_URL:",
  process.env.DATABASE_URL.replace(/:([^:@]+)@/, ":****@"),
);

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Create a default tenant
  const defaultTenant = await prisma.tenant.create({
    data: {
      name: "Default Company",
      slug: "default-company",
      description: "Default company for development",
      isActive: true,
    },
  });

  console.log("Created default tenant:", defaultTenant.id);

  // Create a super admin user
  const hashedPassword = await bcrypt.hash("Admin123!", 10);
  const superAdmin = await prisma.user.create({
    data: {
      email: "admin@example.com",
      name: "System Administrator",
      password: hashedPassword,
      role: "SUPER_ADMIN",
      tenantId: defaultTenant.id,
      isActive: true,
    },
  });

  console.log("Created super admin user:", superAdmin.id);

  // Create a default supplier
  const defaultSupplier = await prisma.supplier.create({
    data: {
      name: "ABC Supplies",
      description: "Default supplier for development",
      email: "contact@abcsupplies.com",
      phone: "123-456-7890",
      address: "123 Main St",
      city: "Anytown",
      state: "CA",
      country: "USA",
      status: "ACTIVE",
      tenantId: defaultTenant.id,
      contacts: {
        create: [
          {
            name: "John Doe",
            position: "Sales Manager",
            email: "john@abcsupplies.com",
            phone: "123-456-7890",
            isPrimary: true,
          },
        ],
      },
    },
  });

  console.log("Created default supplier:", defaultSupplier.id);

  // Create some products
  const products = await Promise.all([
    prisma.product.create({
      data: {
        name: "Product 1",
        description: "Description for Product 1",
        price: 19.99,
        cost: 10.0,
        stockQuantity: 100,
        sku: "SKU-001",
        category: "Category 1",
        supplierId: defaultSupplier.id,
        tenantId: defaultTenant.id,
      },
    }),
    prisma.product.create({
      data: {
        name: "Product 2",
        description: "Description for Product 2",
        price: 29.99,
        cost: 15.0,
        stockQuantity: 50,
        sku: "SKU-002",
        category: "Category 2",
        supplierId: defaultSupplier.id,
        tenantId: defaultTenant.id,
      },
    }),
  ]);

  console.log("Created products:", products.map((p) => p.id).join(", "));

  console.log("Database seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
