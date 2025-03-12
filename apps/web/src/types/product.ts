export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  cost: number;
  stockQuantity: number;
  sku: string;
  barcode?: string;
  imageUrl?: string;
  isActive: boolean;
  tenantId: string;
  supplierId: string;
  category?: string;
  attributes?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateProductRequest {
  name: string;
  description?: string;
  price: number;
  sku: string;
  stock: number;
}

export interface UpdateProductRequest {
  name?: string;
  description?: string;
  price?: number;
  sku?: string;
  stock?: number;
}
