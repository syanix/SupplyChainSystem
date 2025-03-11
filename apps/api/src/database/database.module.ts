import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DatabaseSeeder } from "./database.seeder";
import { User } from "../users/entities/user.entity";
import { Tenant } from "../tenants/entities/tenant.entity";
import { UsersModule } from "../users/users.module";
import { TenantsModule } from "../tenants/tenants.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Tenant]),
    UsersModule,
    TenantsModule,
  ],
  providers: [DatabaseSeeder],
  exports: [DatabaseSeeder],
})
export class DatabaseModule {}
