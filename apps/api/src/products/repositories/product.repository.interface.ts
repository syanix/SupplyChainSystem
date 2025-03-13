import { Product } from "@supply-chain-system/shared";
import { CreateProductDto } from "../dto/create-product.dto";
import { UpdateProductDto } from "../dto/update-product.dto";

export interface IProductRepository {
  findAll(tenantId: string): Promise<Product[]>;
  findById(id: string, tenantId: string): Promise<Product | null>;
  findBySku(sku: string, tenantId: string): Promise<Product | null>;
  create(data: CreateProductDto, tenantId: string): Promise<Product>;
  update(
    id: string,
    data: UpdateProductDto,
    tenantId: string,
  ): Promise<Product>;
  delete(id: string, tenantId: string): Promise<void>;
}

export const PRODUCT_REPOSITORY = "PRODUCT_REPOSITORY";
