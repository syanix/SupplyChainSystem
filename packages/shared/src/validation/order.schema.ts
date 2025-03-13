import { z } from "zod";
import {
  OrderStatus,
  Order,
  CreateOrderRequest,
  UpdateOrderRequest,
} from "../types";

/**
 * Zod schema for order status
 */
export const orderStatusSchema = z.enum([
  OrderStatus.DRAFT,
  OrderStatus.PENDING,
  OrderStatus.PROCESSING,
  OrderStatus.CONFIRMED,
  OrderStatus.SHIPPED,
  OrderStatus.DELIVERED,
  OrderStatus.CANCELLED,
]);

/**
 * Zod schema for base order item
 */
export const baseOrderItemSchema = z.object({
  productId: z.string().uuid(),
  quantity: z.number().int().positive("Quantity must be positive"),
  unitPrice: z.number().nonnegative("Unit price cannot be negative"),
  notes: z.string().optional().nullable(),
});

/**
 * Zod schema for complete order item
 */
export const orderItemSchema = baseOrderItemSchema.extend({
  id: z.string().uuid(),
  orderId: z.string().uuid(),
  totalPrice: z.number().nonnegative("Total price cannot be negative"),
  product: z.any(), // TODO: Replace with proper product schema
  createdAt: z.date(),
  updatedAt: z.date(),
});

/**
 * Zod schema for base order
 */
export const baseOrderSchema = z.object({
  status: orderStatusSchema,
  orderDate: z.date(),
  expectedDeliveryDate: z.date().optional().nullable(),
  actualDeliveryDate: z.date().optional().nullable(),
  shippingAddress: z.string().optional().nullable(),
  billingAddress: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
  paymentMethod: z.string().optional().nullable(),
  paymentStatus: z.string().optional().nullable(),
  trackingNumber: z.string().optional().nullable(),
  supplierOrderReference: z.string().optional().nullable(),
  taxAmount: z.number().nonnegative("Tax amount cannot be negative"),
  shippingCost: z.number().nonnegative("Shipping cost cannot be negative"),
  supplierId: z.string().uuid(),
  customerId: z.string().uuid().optional().nullable(),
});

/**
 * Zod schema for complete order
 */
export const orderSchema = baseOrderSchema.extend({
  id: z.string().uuid(),
  orderNumber: z.string(),
  subtotal: z.number().nonnegative("Subtotal cannot be negative"),
  totalAmount: z.number().nonnegative("Total amount cannot be negative"),
  userId: z.string().uuid(),
  tenantId: z.string().uuid(),
  items: z.array(orderItemSchema),
  createdAt: z.date(),
  updatedAt: z.date(),
});

/**
 * Zod schema for creating an order item
 */
export const createOrderItemSchema = z.object({
  productId: z.string().uuid(),
  quantity: z.number().int().positive("Quantity must be positive"),
  notes: z.string().optional().nullable(),
});

/**
 * Zod schema for creating an order
 */
export const createOrderSchema = baseOrderSchema
  .omit({ supplierId: true })
  .extend({
    items: z.array(createOrderItemSchema),
    supplierId: z.string().uuid(),
  });

/**
 * Zod schema for updating an order
 */
export const updateOrderSchema = baseOrderSchema.partial().extend({
  items: z.array(createOrderItemSchema).optional(),
});

/**
 * Type inference from Zod schemas
 */
export type OrderStatusSchema = z.infer<typeof orderStatusSchema>;
export type BaseOrderItemSchema = z.infer<typeof baseOrderItemSchema>;
export type OrderItemSchema = z.infer<typeof orderItemSchema>;
export type BaseOrderSchema = z.infer<typeof baseOrderSchema>;
export type OrderSchema = z.infer<typeof orderSchema>;
export type CreateOrderItemSchema = z.infer<typeof createOrderItemSchema>;
export type CreateOrderSchema = z.infer<typeof createOrderSchema>;
export type UpdateOrderSchema = z.infer<typeof updateOrderSchema>;

/**
 * Validation functions
 */
export const validateOrder = (data: unknown): Order => {
  return orderSchema.parse(data) as Order;
};

export const validateCreateOrder = (data: unknown): CreateOrderRequest => {
  return createOrderSchema.parse(data) as CreateOrderRequest;
};

export const validateUpdateOrder = (data: unknown): UpdateOrderRequest => {
  return updateOrderSchema.parse(data) as UpdateOrderRequest;
};

export const validatePartialOrder = (data: unknown): Partial<Order> => {
  return orderSchema.partial().parse(data) as Partial<Order>;
};
