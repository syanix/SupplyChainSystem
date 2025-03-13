import { Module } from "@nestjs/common";
import { TenantsController } from "./tenants.controller";
import { TenantsService } from "./tenants.service";
import { PrismaModule } from "../prisma/prisma.module";
import { TenantRepository } from "./repositories/tenant.repository";
import { TENANT_REPOSITORY } from "./repositories/tenant.repository.interface";

@Module({
  imports: [PrismaModule],
  controllers: [TenantsController],
  providers: [
    TenantsService,
    {
      provide: TENANT_REPOSITORY,
      useClass: TenantRepository,
    },
  ],
  exports: [TenantsService],
})
export class TenantsModule {}
