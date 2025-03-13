import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { Supplier, SupplierStatus } from "@supply-chain-system/shared";
import { ISupplierRepository } from "./supplier.repository.interface";
import { CreateSupplierDto } from "../dto/create-supplier.dto";
import { UpdateSupplierDto } from "../dto/update-supplier.dto";

// Define a type for Prisma supplier
type PrismaSupplier = {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  website?: string;
  address?: string;
  description?: string;
  logo?: string;
  isActive?: boolean;
  tenantId: string;
  createdAt: Date;
  updatedAt: Date;
  contacts?: Array<{
    id: string;
    name: string;
    email?: string;
    phone?: string;
    position?: string;
    isPrimary: boolean;
    supplierId: string;
    createdAt: Date;
    updatedAt: Date;
  }>;
  [key: string]: unknown;
};

@Injectable()
export class SupplierRepository implements ISupplierRepository {
  constructor(private prisma: PrismaService) {}

  // Helper method to map Prisma supplier to shared Supplier type
  private mapPrismaSupplierToSharedSupplier(
    prismaSupplier: PrismaSupplier,
  ): Supplier {
    // Explicitly map the Prisma supplier to the shared Supplier type
    return {
      id: prismaSupplier.id,
      name: prismaSupplier.name,
      email: prismaSupplier.email || "",
      phone: prismaSupplier.phone || "",
      address: prismaSupplier.address || "",
      contacts: prismaSupplier.contacts?.map((contact) => ({
        name: contact.name,
        email: contact.email || "",
        phone: contact.phone || "",
      })),
      tenantId: prismaSupplier.tenantId,
      status: prismaSupplier.isActive
        ? SupplierStatus.ACTIVE
        : SupplierStatus.INACTIVE,
      createdAt: prismaSupplier.createdAt,
      updatedAt: prismaSupplier.updatedAt,
    };
  }

  async findAll(tenantId: string): Promise<Supplier[]> {
    const suppliers = await this.prisma.client.supplier.findMany({
      where: { tenantId },
      include: { contacts: true },
      orderBy: { name: "asc" },
    });

    return suppliers.map((supplier) =>
      this.mapPrismaSupplierToSharedSupplier(supplier as PrismaSupplier),
    );
  }

  async findById(id: string, tenantId: string): Promise<Supplier | null> {
    const supplier = await this.prisma.client.supplier.findFirst({
      where: {
        id,
        tenantId,
      },
      include: { contacts: true },
    });

    if (!supplier) {
      throw new NotFoundException(`Supplier with ID ${id} not found`);
    }

    return this.mapPrismaSupplierToSharedSupplier(supplier as PrismaSupplier);
  }

  async create(data: CreateSupplierDto, tenantId: string): Promise<Supplier> {
    // Ensure address is provided as it's required in the Prisma schema
    const address = data.address || "";

    const supplier = await this.prisma.client.supplier.create({
      data: {
        name: data.name,
        description: data.description,
        email: data.email,
        phone: data.phone,
        website: data.website,
        address: address,
        city: data.city,
        state: data.state,
        postalCode: data.postalCode,
        country: data.country,
        status: data.status || SupplierStatus.ACTIVE,
        taxId: data.taxId,
        paymentTerms: data.paymentTerms,
        notes: data.notes,
        customFields: data.attributes ? JSON.stringify(data.attributes) : null,
        tenant: {
          connect: { id: tenantId },
        },
        ...(data.contacts &&
          data.contacts.length > 0 && {
            contacts: {
              create: data.contacts,
            },
          }),
      },
      include: { contacts: true },
    });

    return this.mapPrismaSupplierToSharedSupplier(supplier as PrismaSupplier);
  }

  async update(
    id: string,
    data: UpdateSupplierDto,
    tenantId: string,
  ): Promise<Supplier> {
    // First check if supplier exists
    await this.findById(id, tenantId);

    const { contacts, ...supplierData } = data;

    // Handle contacts update if provided
    if (contacts) {
      // Delete existing contacts and create new ones
      await this.prisma.client.supplierContact.deleteMany({
        where: { supplierId: id },
      });

      // Create new contacts
      if (contacts.length > 0) {
        for (const contact of contacts) {
          await this.prisma.client.supplierContact.create({
            data: {
              ...contact,
              supplier: {
                connect: { id },
              },
            },
          });
        }
      }
    }

    // Update supplier data
    const supplier = await this.prisma.client.supplier.update({
      where: { id },
      data: supplierData,
      include: { contacts: true },
    });

    return this.mapPrismaSupplierToSharedSupplier(supplier as PrismaSupplier);
  }

  async delete(id: string, tenantId: string): Promise<void> {
    // First check if supplier exists
    await this.findById(id, tenantId);

    // Delete supplier (contacts will be deleted automatically due to cascade)
    await this.prisma.client.supplier.delete({
      where: { id },
    });
  }
}
