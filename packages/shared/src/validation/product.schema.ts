import { z } from "zod";
import { Product, CreateProductRequest, UpdateProductRequest } from "../types";

/**
 * Zod schema for base product
 */
export const baseProductSchema = z.object({
  name: z.string().min(1, "Name is required"),
  sku: z.string().min(1, "SKU is required"),
  description: z.string().optional(),
  price: z.number().positive("Price must be positive"),
  unit: z.string().min(1, "Unit is required"),
  imageUrl: z.string().url().optional().nullable(),
  supplierId: z.string().uuid().optional().nullable(),
});

/**
 * Zod schema for complete product
 */
export const productSchema = baseProductSchema.extend({
  id: z.string().uuid(),
  stock: z.number().int().nonnegative("Stock cannot be negative"),
  tenantId: z.string().uuid().optional().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

/**
 * Zod schema for creating a product
 */
export const createProductSchema = baseProductSchema.extend({
  stock: z.number().int().nonnegative("Stock cannot be negative"),
});

/**
 * Zod schema for updating a product
 */
export const updateProductSchema = baseProductSchema.partial().extend({
  stock: z.number().int().nonnegative("Stock cannot be negative").optional(),
});

/**
 * Type inference from Zod schemas
 */
export type BaseProductSchema = z.infer<typeof baseProductSchema>;
export type ProductSchema = z.infer<typeof productSchema>;
export type CreateProductSchema = z.infer<typeof createProductSchema>;
export type UpdateProductSchema = z.infer<typeof updateProductSchema>;

/**
 * Validation functions
 */
export const validateProduct = (data: unknown): Product => {
  return productSchema.parse(data) as Product;
};

export const validateCreateProduct = (data: unknown): CreateProductRequest => {
  return createProductSchema.parse(data) as CreateProductRequest;
};

export const validateUpdateProduct = (data: unknown): UpdateProductRequest => {
  return updateProductSchema.parse(data) as UpdateProductRequest;
};

export const validatePartialProduct = (data: unknown): Partial<Product> => {
  return productSchema.partial().parse(data) as Partial<Product>;
};
