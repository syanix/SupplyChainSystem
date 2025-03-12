export interface Product {
  id: string;
  name: string;
  sku: string;
  description?: string;
  price: number;
  unit: string;
  stock: number;
  imageUrl?: string;
  supplierId?: string;
  tenantId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateProductRequest {
  name: string;
  sku: string;
  description?: string;
  price: number;
  unit: string;
  stock: number;
  imageUrl?: string;
  supplierId?: string;
}

export interface UpdateProductRequest {
  name?: string;
  sku?: string;
  description?: string;
  price?: number;
  unit?: string;
  stock?: number;
  imageUrl?: string;
}
