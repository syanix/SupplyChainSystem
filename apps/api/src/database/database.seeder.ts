import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "../users/entities/user.entity";
import { Tenant } from "../tenants/entities/tenant.entity";
import * as bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";

@Injectable()
export class DatabaseSeeder implements OnModuleInit {
  private readonly logger = new Logger(DatabaseSeeder.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Tenant)
    private readonly tenantRepository: Repository<Tenant>,
  ) {}

  async onModuleInit() {
    try {
      this.logger.log("Starting database seeding...");

      // Create tenant first
      let tenant: Tenant | null = null;
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

  private async seedDefaultTenant(): Promise<Tenant> {
    const defaultTenantName = "Default Organization";
    const defaultTenantSlug = "default-organization";

    try {
      // First try to find the tenant using a simple query to avoid schema mismatches
      const existingTenantQuery = await this.tenantRepository.query(
        `SELECT id, name FROM tenants WHERE name = $1 LIMIT 1`,
        [defaultTenantName],
      );

      if (existingTenantQuery && existingTenantQuery.length > 0) {
        this.logger.log(`Default tenant already exists: ${defaultTenantName}`);
        return existingTenantQuery[0];
      }

      // Generate UUID in JavaScript
      const tenantId = uuidv4();

      // Create tenant with a simple query
      const result = await this.tenantRepository.query(
        `INSERT INTO tenants (id, name, slug, "isActive", "createdAt", "updatedAt") 
         VALUES ($1, $2, $3, true, NOW(), NOW()) 
         ON CONFLICT (name) DO UPDATE SET "updatedAt" = NOW() 
         RETURNING id, name`,
        [tenantId, defaultTenantName, defaultTenantSlug],
      );

      if (result && result.length > 0) {
        this.logger.log(`Default tenant created: ${defaultTenantName}`);
        return result[0];
      }

      throw new Error(`Could not create default tenant: ${defaultTenantName}`);
    } catch (error: unknown) {
      this.logger.error(
        `Failed to seed default tenant: ${error instanceof Error ? error.message : String(error)}`,
      );
      throw error;
    }
  }

  private async seedDefaultAdmin(tenant: Tenant): Promise<void> {
    const defaultEmail = "superadmin@superadmin.com";
    const defaultName = "Super Admin";
    const defaultRole = "SUPER_ADMIN"; // Single role as enum value
    const defaultPassword = "tmY8!R>d:;y5+B{q"; // Default password for admin

    try {
      // First check if user exists using a simple query
      const existingUserQuery = await this.userRepository.query(
        `SELECT id, email FROM users WHERE email = $1 LIMIT 1`,
        [defaultEmail],
      );

      if (existingUserQuery && existingUserQuery.length > 0) {
        this.logger.log(`Default admin user already exists: ${defaultEmail}`);
        return;
      }

      // Generate UUID in JavaScript
      const userId = uuidv4();

      // Hash the password
      const hashedPassword = await bcrypt.hash(defaultPassword, 10);

      // Create user with a simple query that matches the actual database schema
      await this.userRepository.query(
        `INSERT INTO users (id, email, name, role, password, "tenantId", "isActive", "createdAt", "updatedAt") 
         VALUES ($1, $2, $3, $4, $5, $6, true, NOW(), NOW()) 
         ON CONFLICT (email) DO NOTHING`,
        [
          userId,
          defaultEmail,
          defaultName,
          defaultRole,
          hashedPassword,
          tenant.id,
        ],
      );

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
