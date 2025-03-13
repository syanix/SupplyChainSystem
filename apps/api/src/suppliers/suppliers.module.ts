import { Module } from "@nestjs/common";
import { SuppliersController } from "./suppliers.controller";
import { SuppliersService } from "./suppliers.service";
import { PrismaModule } from "../prisma/prisma.module";
import { SupplierRepository } from "./repositories/supplier.repository";
import { SUPPLIER_REPOSITORY } from "./repositories/supplier.repository.interface";

@Module({
  imports: [PrismaModule],
  controllers: [SuppliersController],
  providers: [
    SuppliersService,
    {
      provide: SUPPLIER_REPOSITORY,
      useClass: SupplierRepository,
    },
  ],
  exports: [SuppliersService],
})
export class SuppliersModule {}
