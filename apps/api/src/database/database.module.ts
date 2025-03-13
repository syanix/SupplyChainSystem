import { Module } from "@nestjs/common";
import { DatabaseSeeder } from "./database.seeder";
import { UsersModule } from "../users/users.module";
import { TenantsModule } from "../tenants/tenants.module";
import { PrismaModule } from "../prisma/prisma.module";

@Module({
  imports: [PrismaModule, UsersModule, TenantsModule],
  providers: [DatabaseSeeder],
  exports: [DatabaseSeeder],
})
export class DatabaseModule {}
