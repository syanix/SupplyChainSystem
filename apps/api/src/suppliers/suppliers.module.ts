import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SuppliersController } from "./suppliers.controller";
import { SuppliersService } from "./suppliers.service";
import { Supplier } from "./entities/supplier.entity";
import { SupplierContact } from "./entities/supplier-contact.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Supplier, SupplierContact])],
  controllers: [SuppliersController],
  providers: [SuppliersService],
  exports: [SuppliersService],
})
export class SuppliersModule {}
