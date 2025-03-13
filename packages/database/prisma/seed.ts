import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcrypt";

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
