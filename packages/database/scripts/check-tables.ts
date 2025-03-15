import { PrismaClient } from "@prisma/client";
import * as dotenv from "dotenv";
import * as path from "path";

// Load environment variables
dotenv.config();
dotenv.config({ path: path.resolve(__dirname, "../.env") });
dotenv.config({ path: path.resolve(__dirname, "../../../.env") });

const prisma = new PrismaClient();

async function checkTables() {
  console.log("Checking database tables...");
  console.log("Using DATABASE_URL:", process.env.DATABASE_URL?.replace(/:([^:@]+)@/, ":****@"));

  try {
    // Get counts for each table
    const [
      tenantCount,
      userCount,
      supplierCount,
      productCount,
      orderCount,
      supplierContactCount,
    ] = await Promise.all([
      prisma.tenant.count(),
      prisma.user.count(),
      prisma.supplier.count(),
      prisma.product.count(),
      prisma.order.count(),
      prisma.supplierContact.count(),
    ]);

    console.log("\nTable Counts:");
    console.log("=============");
    console.log(`Tenants: ${tenantCount}`);
    console.log(`Users: ${userCount}`);
    console.log(`Suppliers: ${supplierCount}`);
    console.log(`Products: ${productCount}`);
    console.log(`Orders: ${orderCount}`);
    console.log(`Supplier Contacts: ${supplierContactCount}`);

    // Get schema information using raw SQL
    console.log("\nSchema Information:");
    console.log("===================");
    
    // Get list of tables in the schema
    const tables = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'supply_chain'
      ORDER BY table_name;
    `;
    
    console.log("Tables in schema:", tables);
    
    // Get sample data from each table
    if (tenantCount > 0) {
      const tenant = await prisma.tenant.findFirst();
      console.log("\nSample Tenant:", tenant);
    }
    
    if (userCount > 0) {
      const user = await prisma.user.findFirst({
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          tenantId: true,
          isActive: true,
          createdAt: true,
          // Exclude password for security
        }
      });
      console.log("\nSample User:", user);
    }
    
    if (productCount > 0) {
      const product = await prisma.product.findFirst();
      console.log("\nSample Product:", product);
    }

    console.log("\nDatabase check completed successfully!");
  } catch (error) {
    console.error("Error checking database:", error);
  } finally {
    await prisma.$disconnect();
  }
}

checkTables().catch(console.error); 