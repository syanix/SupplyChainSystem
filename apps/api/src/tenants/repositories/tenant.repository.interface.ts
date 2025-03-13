import { Tenant } from "@supply-chain-system/shared";
import { CreateTenantDto } from "../dto/create-tenant.dto";
import { UpdateTenantDto } from "../dto/update-tenant.dto";

export interface ITenantRepository {
  findAll(): Promise<Tenant[]>;
  findById(id: string): Promise<Tenant | null>;
  findBySlug(slug: string): Promise<Tenant | null>;
  create(data: CreateTenantDto): Promise<Tenant>;
  update(id: string, data: UpdateTenantDto): Promise<Tenant>;
  delete(id: string): Promise<void>;
}

export const TENANT_REPOSITORY = "TENANT_REPOSITORY";
