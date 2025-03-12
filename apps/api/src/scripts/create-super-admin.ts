import { NestFactory } from "@nestjs/core";
import { AppModule } from "../app.module";
import { UsersService } from "../users/users.service";
import { TenantsService } from "../tenants/tenants.service";
import { Tenant } from "../tenants/entities/tenant.entity";
import { User } from "../users/entities/user.entity";
import { Repository } from "typeorm";
import { getRepositoryToken } from "@nestjs/typeorm";
import * as bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  try {
    const usersService = app.get(UsersService);
    const userRepository = app.get<Repository<User>>(getRepositoryToken(User));
    const tenantRepository = app.get<Repository<Tenant>>(
      getRepositoryToken(Tenant),
    );

    // Check if a system tenant exists, if not create one
    let systemTenant;
    try {
      // Try to find the system tenant
      systemTenant = await tenantRepository.findOne({
        where: { name: "System" },
      });

      if (!systemTenant) {
        // Create a system tenant with explicit ID and slug
        const tenantId = uuidv4();

        // Create the tenant directly using the repository to set all required fields
        systemTenant = await tenantRepository.save({
          id: tenantId,
          name: "System",
          slug: "system",
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        });

        console.log("System tenant created:", systemTenant);
      } else {
        console.log("System tenant already exists:", systemTenant);
      }
    } catch (error) {
      console.error("Error finding/creating system tenant:", error);
      return;
    }

    // Create a super admin user
    const email = "superadmin@example.com";
    const password = "superadmin123"; // This should be changed after first login

    // Check if super admin already exists
    const existingUser = await userRepository.findOne({
      where: { email },
    });

    if (existingUser) {
      console.log("Super admin user already exists");
      return;
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the super admin user with explicit ID
    const userId = uuidv4();
    const superAdmin = await userRepository.save({
      id: userId,
      email,
      password: hashedPassword,
      name: "Super Admin",
      role: "SUPER_ADMIN",
      tenantId: systemTenant.id,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    console.log("Super admin user created:", {
      id: superAdmin.id,
      email: superAdmin.email,
      name: superAdmin.name,
      role: superAdmin.role,
    });

    console.log("Please change the password after first login!");
  } catch (error) {
    console.error("Error creating super admin user:", error);
  } finally {
    await app.close();
  }
}

bootstrap();
