import { Controller, Get } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { PrismaService } from "./prisma/prisma.service";

@ApiTags("health")
@Controller()
export class AppController {
  constructor(private readonly prismaService: PrismaService) {}

  @Get("health")
  @ApiOperation({ summary: "Health check endpoint" })
  @ApiResponse({ status: 200, description: "API is healthy" })
  health() {
    return {
      status: "ok",
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
    };
  }

  @Get("db-connection")
  @ApiOperation({ summary: "Database connection test endpoint" })
  @ApiResponse({
    status: 200,
    description: "Database connection is working",
    schema: {
      type: "object",
      properties: {
        status: { type: "string" },
        timestamp: { type: "string", format: "date-time" },
        counts: {
          type: "object",
          properties: {
            users: { type: "number" },
            tenants: { type: "number" },
            suppliers: { type: "number" },
            products: { type: "number" },
            orders: { type: "number" },
          },
        },
        databaseInfo: {
          type: "object",
          properties: {
            provider: { type: "string" },
            url: { type: "string" },
          },
        },
      },
    },
  })
  @ApiResponse({ status: 500, description: "Database connection failed" })
  async testDatabaseConnection() {
    try {
      // Test the connection by counting various entities
      const [userCount, tenantCount, supplierCount, productCount, orderCount] =
        await Promise.all([
          this.prismaService.client.user.count(),
          this.prismaService.client.tenant.count(),
          this.prismaService.client.supplier.count(),
          this.prismaService.client.product.count(),
          this.prismaService.client.order.count(),
        ]);

      // Get database connection info (masking sensitive parts)
      const dbUrl = process.env.DATABASE_URL || "";
      const maskedDbUrl = dbUrl.replace(/:([^:@]+)@/, ":****@");

      return {
        status: "connected",
        timestamp: new Date().toISOString(),
        counts: {
          users: userCount,
          tenants: tenantCount,
          suppliers: supplierCount,
          products: productCount,
          orders: orderCount,
        },
        databaseInfo: {
          provider: "postgresql", // Hardcoded since $databaseProvider is not available
          url: maskedDbUrl,
        },
      };
    } catch (error) {
      // Return error details but don't expose sensitive information
      const err = error as Error; // Type assertion for better type safety
      return {
        status: "error",
        timestamp: new Date().toISOString(),
        error: err.message || "Unknown error",
        // Only include code and meta if they exist
        ...((err as any).code && { code: (err as any).code }),
        ...((err as any).meta && { meta: (err as any).meta }),
      };
    }
  }
}
