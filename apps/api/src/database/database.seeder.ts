import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { UsersService } from "../users/users.service";
import { TenantsService } from "../tenants/tenants.service";
import { UserRole } from "@supply-chain-system/shared";

@Injectable()
export class DatabaseSeeder implements OnModuleInit {
  private readonly logger = new Logger(DatabaseSeeder.name);

  constructor(
    private readonly usersService: UsersService,
    private readonly tenantsService: TenantsService,
  ) {}

  async onModuleInit() {
    try {
      this.logger.log("Starting database seeding...");

      // Create tenant first
      let tenant = null;
      try {
        tenant = await this.seedDefaultTenant();
      } catch (tenantError: unknown) {
        this.logger.error(
          "Failed to create default tenant, cannot proceed with user creation",
        );
        return;
      }

      // Then create admin user if tenant was created
      if (tenant && tenant.id) {
        try {
          await this.seedDefaultAdmin(tenant);
        } catch (userError: unknown) {
          this.logger.error("Failed to create default admin user");
        }
      }

      this.logger.log("Database seeding completed");
    } catch (error: unknown) {
      this.logger.error(
        "Failed to seed database",
        error instanceof Error ? error.stack : String(error),
      );
    }
  }

  private async seedDefaultTenant() {
    const defaultTenantName = "Default Organization";

    try {
      // First try to find the tenant by name
      const tenants = await this.tenantsService.findAll();
      const existingTenant = tenants.find((t) => t.name === defaultTenantName);

      if (existingTenant) {
        this.logger.log(`Default tenant already exists: ${defaultTenantName}`);
        return existingTenant;
      }

      // Create the tenant using the service
      const newTenant = await this.tenantsService.create({
        name: defaultTenantName,
        description: "Default organization for the system",
        isActive: true,
      });

      this.logger.log(`Default tenant created: ${defaultTenantName}`);
      return newTenant;
    } catch (error: unknown) {
      this.logger.error(
        `Failed to seed default tenant: ${error instanceof Error ? error.message : String(error)}`,
      );
      throw error;
    }
  }

  private async seedDefaultAdmin(tenant) {
    const defaultEmail = "superadmin@superadmin.com";
    const defaultName = "Super Admin";
    const defaultPassword = "tmY8!R>d:;y5+B{q"; // Default password for admin

    try {
      // Check if user exists
      const existingUser = await this.usersService.findByEmail(defaultEmail);

      if (existingUser) {
        this.logger.log(`Default admin user already exists: ${defaultEmail}`);
        return;
      }

      // Create user using the service
      await this.usersService.create({
        email: defaultEmail,
        name: defaultName,
        password: defaultPassword,
        role: UserRole.SUPER_ADMIN,
        tenantId: tenant.id,
        isActive: true,
      });

      this.logger.log(
        `Default admin user created: ${defaultEmail} with password: ${defaultPassword}`,
      );
    } catch (error: unknown) {
      this.logger.error(
        `Failed to seed default admin: ${error instanceof Error ? error.message : String(error)}`,
      );
      throw error;
    }
  }
}
