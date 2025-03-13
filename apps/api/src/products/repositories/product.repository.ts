import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { Product } from "@supply-chain-system/shared";
import { IProductRepository } from "./product.repository.interface";
import { CreateProductDto } from "../dto/create-product.dto";
import { UpdateProductDto } from "../dto/update-product.dto";

// Define a type for Prisma product
type PrismaProduct = {
  id: string;
  name: string;
  description?: string;
  price: number;
  sku: string;
  stockQuantity: number;
  imageUrl?: string;
  supplierId?: string;
  tenantId?: string;
  createdAt: Date;
  updatedAt: Date;
  [key: string]: unknown;
};

@Injectable()
export class ProductRepository implements IProductRepository {
  constructor(private prisma: PrismaService) {}

  // Helper method to map Prisma product to shared Product type
  private mapPrismaProductToSharedProduct(
    prismaProduct: PrismaProduct,
  ): Product {
    // Explicitly map the Prisma product to the shared Product type
    return {
      id: prismaProduct.id,
      name: prismaProduct.name,
      description: prismaProduct.description,
      price: prismaProduct.price,
      sku: prismaProduct.sku,
      unit: "each", // Default unit since it's required in the shared type
      stock: prismaProduct.stockQuantity || 0, // Map stockQuantity to stock
      imageUrl: prismaProduct.imageUrl,
      supplierId: prismaProduct.supplierId,
      tenantId: prismaProduct.tenantId,
      createdAt: prismaProduct.createdAt,
      updatedAt: prismaProduct.updatedAt,
    };
  }

  async findAll(tenantId: string): Promise<Product[]> {
    const products = await this.prisma.client.product.findMany({
      where: { tenantId },
      include: { supplier: true },
    });

    return products.map((product) =>
      this.mapPrismaProductToSharedProduct(product as PrismaProduct),
    );
  }

  async findById(id: string, tenantId: string): Promise<Product | null> {
    const product = await this.prisma.client.product.findFirst({
      where: {
        id,
        tenantId,
      },
      include: { supplier: true },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    return this.mapPrismaProductToSharedProduct(product as PrismaProduct);
  }

  async findBySku(sku: string, tenantId: string): Promise<Product | null> {
    const product = await this.prisma.client.product.findFirst({
      where: {
        sku,
        tenantId,
      },
      include: { supplier: true },
    });

    if (!product) {
      return null;
    }

    return this.mapPrismaProductToSharedProduct(product as PrismaProduct);
  }

  async create(data: CreateProductDto, tenantId: string): Promise<Product> {
    // Ensure required fields are present
    if (!data.sku) {
      // Generate a unique SKU if not provided
      data.sku = `SKU-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    }

    const product = await this.prisma.client.product.create({
      data: {
        name: data.name,
        description: data.description,
        price: data.price,
        cost: data.cost || 0,
        stockQuantity: data.stockQuantity || 0,
        sku: data.sku,
        barcode: data.barcode,
        imageUrl: data.imageUrl,
        isActive: data.isActive ?? true,
        category: data.category,
        attributes: data.attributes ? JSON.stringify(data.attributes) : null,
        tenant: {
          connect: { id: tenantId },
        },
        supplier: data.supplierId
          ? {
              connect: { id: data.supplierId },
            }
          : undefined,
      },
      include: { supplier: true },
    });

    return this.mapPrismaProductToSharedProduct(product as PrismaProduct);
  }

  async update(
    id: string,
    data: UpdateProductDto,
    tenantId: string,
  ): Promise<Product> {
    // First check if product exists
    await this.findById(id, tenantId);

    const updateData: Record<string, unknown> = { ...data };

    // Handle supplier connection/disconnection
    if (data.supplierId) {
      updateData.supplier = {
        connect: { id: data.supplierId },
      };
      delete updateData.supplierId;
    } else if (data.supplierId === null) {
      updateData.supplier = {
        disconnect: true,
      };
      delete updateData.supplierId;
    }

    const product = await this.prisma.client.product.update({
      where: { id },
      data: updateData,
      include: { supplier: true },
    });

    return this.mapPrismaProductToSharedProduct(product as PrismaProduct);
  }

  async delete(id: string, tenantId: string): Promise<void> {
    // First check if product exists
    await this.findById(id, tenantId);

    await this.prisma.client.product.delete({
      where: { id },
    });
  }
}
