import { Injectable, Inject } from "@nestjs/common";
import { CreateSupplierDto } from "./dto/create-supplier.dto";
import { UpdateSupplierDto } from "./dto/update-supplier.dto";
import {
  ISupplierRepository,
  SUPPLIER_REPOSITORY,
} from "./repositories/supplier.repository.interface";

@Injectable()
export class SuppliersService {
  constructor(
    @Inject(SUPPLIER_REPOSITORY)
    private readonly supplierRepository: ISupplierRepository,
  ) {}

  async create(createSupplierDto: CreateSupplierDto, tenantId: string) {
    return this.supplierRepository.create(createSupplierDto, tenantId);
  }

  async findAll(tenantId: string) {
    return this.supplierRepository.findAll(tenantId);
  }

  async findOne(id: string, tenantId: string) {
    return this.supplierRepository.findById(id, tenantId);
  }

  async update(
    id: string,
    updateSupplierDto: UpdateSupplierDto,
    tenantId: string,
  ) {
    return this.supplierRepository.update(id, updateSupplierDto, tenantId);
  }

  async remove(id: string, tenantId: string) {
    return this.supplierRepository.delete(id, tenantId);
  }
}
