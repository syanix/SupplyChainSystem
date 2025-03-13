import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { Tenant } from "@supply-chain-system/shared";
import { ITenantRepository } from "./tenant.repository.interface";
import { CreateTenantDto } from "../dto/create-tenant.dto";
import { UpdateTenantDto } from "../dto/update-tenant.dto";

// Define a type for Prisma tenant
type PrismaTenant = {
  id: string;
  name: string;
  slug: string;
  description?: string;
  logo?: string;
  primaryColor?: string;
  secondaryColor?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  [key: string]: unknown;
};

@Injectable()
export class TenantRepository implements ITenantRepository {
  constructor(private prisma: PrismaService) {}

  // Helper method to map Prisma tenant to shared Tenant type
  private mapPrismaTenantToSharedTenant(prismaTenant: PrismaTenant): Tenant {
    // Explicitly map the Prisma tenant to the shared Tenant type
    return prismaTenant as Tenant;
  }

  async findAll(): Promise<Tenant[]> {
    const tenants = await this.prisma.client.tenant.findMany({
      orderBy: { name: "asc" },
    });

    return tenants.map((tenant) => this.mapPrismaTenantToSharedTenant(tenant));
  }

  async findById(id: string): Promise<Tenant | null> {
    const tenant = await this.prisma.client.tenant.findUnique({
      where: { id },
    });

    if (!tenant) {
      throw new NotFoundException(`Tenant with ID ${id} not found`);
    }

    return this.mapPrismaTenantToSharedTenant(tenant);
  }

  async findBySlug(slug: string): Promise<Tenant | null> {
    const tenant = await this.prisma.client.tenant.findUnique({
      where: { slug },
    });

    if (!tenant) {
      return null;
    }

    return this.mapPrismaTenantToSharedTenant(tenant);
  }

  async create(data: CreateTenantDto): Promise<Tenant> {
    // Generate slug from name if not provided
    const slug = data.slug || this.generateSlug(data.name);

    const tenant = await this.prisma.client.tenant.create({
      data: {
        ...data,
        slug,
      },
    });

    return this.mapPrismaTenantToSharedTenant(tenant);
  }

  async update(id: string, data: UpdateTenantDto): Promise<Tenant> {
    // First check if tenant exists
    await this.findById(id);

    // Generate slug from name if name is provided but slug is not
    const updateData = { ...data };
    if (data.name && !data.slug) {
      updateData.slug = this.generateSlug(data.name);
    }

    const tenant = await this.prisma.client.tenant.update({
      where: { id },
      data: updateData,
    });

    return this.mapPrismaTenantToSharedTenant(tenant);
  }

  async delete(id: string): Promise<void> {
    // First check if tenant exists
    await this.findById(id);

    await this.prisma.client.tenant.delete({
      where: { id },
    });
  }

  // Helper method to generate a slug from a name
  private generateSlug(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }
}
