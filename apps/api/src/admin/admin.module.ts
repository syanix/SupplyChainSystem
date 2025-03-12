import { Module } from "@nestjs/common";
import { AdminController } from "./admin.controller";
import { TenantsModule } from "../tenants/tenants.module";
import { UsersModule } from "../users/users.module";

@Module({
  imports: [TenantsModule, UsersModule],
  controllers: [AdminController],
})
export class AdminModule {}
