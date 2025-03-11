import { PrismaClient } from '@prisma/client';
export * from '@prisma/client';
export const prisma = new PrismaClient();
// Helper function to include tenant ID in all queries
export const withTenant = (tenantId) => {
    return {
        where: {
            tenantId,
        },
    };
};
