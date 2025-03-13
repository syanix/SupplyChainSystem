/**
 * Base product interface with common properties
 */
export interface BaseProduct {
  name: string;
  sku: string;
  description?: string;
  price: number;
  unit: string;
  imageUrl?: string;
  supplierId?: string;
}

/**
 * Complete product interface with all properties
 */
export interface Product extends BaseProduct {
  id: string;
  stock: number;
  tenantId?: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Type for creating a new product
 */
export type CreateProductRequest = BaseProduct & {
  stock: number;
};

/**
 * Type for updating an existing product
 */
export type UpdateProductRequest = Partial<BaseProduct> & {
  stock?: number;
};

/**
 * Type for product response in API
 */
export type ProductResponse = Product;
