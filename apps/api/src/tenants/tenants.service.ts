import { Injectable, Inject } from "@nestjs/common";
import { CreateTenantDto } from "./dto/create-tenant.dto";
import { UpdateTenantDto } from "./dto/update-tenant.dto";
import {
  ITenantRepository,
  TENANT_REPOSITORY,
} from "./repositories/tenant.repository.interface";

@Injectable()
export class TenantsService {
  constructor(
    @Inject(TENANT_REPOSITORY)
    private readonly tenantRepository: ITenantRepository,
  ) {}

  async create(createTenantDto: CreateTenantDto) {
    return this.tenantRepository.create(createTenantDto);
  }

  async findAll() {
    return this.tenantRepository.findAll();
  }

  async findOne(id: string) {
    return this.tenantRepository.findById(id);
  }

  async findBySlug(slug: string) {
    return this.tenantRepository.findBySlug(slug);
  }

  async update(id: string, updateTenantDto: UpdateTenantDto) {
    return this.tenantRepository.update(id, updateTenantDto);
  }

  async remove(id: string) {
    return this.tenantRepository.delete(id);
  }
}
