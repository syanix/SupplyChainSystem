import { Injectable, OnModuleInit, OnModuleDestroy } from "@nestjs/common";
import { prisma } from "@supply-chain-system/database";

@Injectable()
export class PrismaService implements OnModuleInit, OnModuleDestroy {
  // Use the prisma client from the database package
  public client = prisma;

  async onModuleInit() {
    // The client is already connected in the database package
    // but we can add additional setup here if needed
  }

  async onModuleDestroy() {
    await this.client.$disconnect();
  }

  /**
   * Helper method to clean the database during testing
   */
  async cleanDatabase() {
    if (process.env.NODE_ENV !== "production") {
      // Add truncate logic for your tables here
      // This is useful for testing
    }
  }
}
