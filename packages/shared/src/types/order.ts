export enum OrderStatus {
  DRAFT = "DRAFT",
  PENDING = "PENDING",
  PROCESSING = "PROCESSING",
  CONFIRMED = "CONFIRMED",
  SHIPPED = "SHIPPED",
  DELIVERED = "DELIVERED",
  CANCELLED = "CANCELLED",
}

/**
 * Base order item interface with common properties
 */
export interface BaseOrderItem {
  productId: string;
  quantity: number;
  unitPrice: number;
  notes?: string;
}

/**
 * Complete order item interface with all properties
 */
export interface OrderItem extends BaseOrderItem {
  id: string;
  orderId: string;
  totalPrice: number;
  product?: any; // TODO: Replace with proper Product type
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Base order interface with common properties
 */
export interface BaseOrder {
  status: OrderStatus;
  orderDate: Date;
  expectedDeliveryDate?: Date;
  actualDeliveryDate?: Date;
  shippingAddress?: string;
  billingAddress?: string;
  notes?: string;
  paymentMethod?: string;
  paymentStatus?: string;
  trackingNumber?: string;
  supplierOrderReference?: string;
  taxAmount: number;
  shippingCost: number;
  supplierId: string;
  customerId?: string;
}

/**
 * Complete order interface with all properties
 */
export interface Order extends BaseOrder {
  id: string;
  orderNumber: string;
  subtotal: number;
  totalAmount: number;
  userId: string;
  tenantId: string;
  items: OrderItem[];
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Type for creating a new order
 */
export type CreateOrderRequest = Omit<BaseOrder, "supplierId"> & {
  items: Omit<BaseOrderItem, "unitPrice">[];
  supplierId: string;
};

/**
 * Type for updating an existing order
 */
export type UpdateOrderRequest = Partial<BaseOrder> & {
  items?: Omit<BaseOrderItem, "unitPrice">[];
};

/**
 * Type for order response in API
 */
export type OrderResponse = Order;
