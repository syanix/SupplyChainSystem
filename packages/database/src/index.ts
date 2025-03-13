import { PrismaClient } from "@prisma/client";

// Re-export all types from Prisma
export * from "@prisma/client";

// Create and export a singleton PrismaClient instance
const prisma = new PrismaClient({
  log:
    process.env.NODE_ENV === "development"
      ? ["query", "error", "warn"]
      : ["error"],
});

// Helper function to include tenant ID in all queries
export const withTenant = (tenantId: string) => {
  return {
    where: {
      tenantId,
    },
  };
};

// Export the prisma client as default and named export
export { prisma };
export default prisma;
