import { Supplier } from "@supply-chain-system/shared";
import { CreateSupplierDto } from "../dto/create-supplier.dto";
import { UpdateSupplierDto } from "../dto/update-supplier.dto";

export interface ISupplierRepository {
  findAll(tenantId: string): Promise<Supplier[]>;
  findById(id: string, tenantId: string): Promise<Supplier | null>;
  create(data: CreateSupplierDto, tenantId: string): Promise<Supplier>;
  update(
    id: string,
    data: UpdateSupplierDto,
    tenantId: string,
  ): Promise<Supplier>;
  delete(id: string, tenantId: string): Promise<void>;
}

export const SUPPLIER_REPOSITORY = "SUPPLIER_REPOSITORY";
