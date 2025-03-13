import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { Order, OrderItem, OrderStatus } from "@supply-chain-system/shared";
import { IOrderRepository } from "./order.repository.interface";
import { CreateOrderDto } from "../dto/create-order.dto";
import { UpdateOrderDto } from "../dto/update-order.dto";

// Define types for Prisma models
type PrismaOrderItem = {
  id: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  notes?: string | null;
  product: {
    id: string;
    name: string;
    sku: string;
    [key: string]: unknown;
  };
  createdAt: Date;
  updatedAt: Date;
  [key: string]: unknown;
};

type PrismaOrder = {
  id: string;
  orderNumber: string;
  status: string;
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
  subtotal: number;
  taxAmount: number;
  shippingCost: number;
  totalAmount: number;
  userId: string;
  tenantId: string;
  customerId?: string;
  supplierId?: string;
  items: PrismaOrderItem[];
  createdAt: Date;
  updatedAt: Date;
  [key: string]: unknown;
};

@Injectable()
export class OrderRepository implements IOrderRepository {
  constructor(private prisma: PrismaService) {}

  // Helper method to map Prisma order item to shared OrderItem type
  private mapPrismaOrderItemToSharedOrderItem(
    item: PrismaOrderItem,
    orderId: string,
  ): OrderItem {
    return {
      id: item.id,
      orderId: orderId,
      productId: item.product.id,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      totalPrice: item.totalPrice,
      notes: item.notes || undefined,
      product: item.product,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    };
  }

  // Helper method to map Prisma order to shared Order type
  private mapPrismaOrderToSharedOrder(prismaOrder: PrismaOrder): Order {
    // Explicitly map all required properties
    const order: Order = {
      id: prismaOrder.id,
      orderNumber: prismaOrder.orderNumber,
      status: prismaOrder.status as OrderStatus,
      orderDate: prismaOrder.orderDate,
      expectedDeliveryDate: prismaOrder.expectedDeliveryDate,
      actualDeliveryDate: prismaOrder.actualDeliveryDate,
      shippingAddress: prismaOrder.shippingAddress,
      billingAddress: prismaOrder.billingAddress,
      notes: prismaOrder.notes,
      paymentMethod: prismaOrder.paymentMethod,
      paymentStatus: prismaOrder.paymentStatus,
      trackingNumber: prismaOrder.trackingNumber,
      supplierOrderReference: prismaOrder.supplierOrderReference,
      subtotal: prismaOrder.subtotal,
      taxAmount: prismaOrder.taxAmount,
      shippingCost: prismaOrder.shippingCost,
      totalAmount: prismaOrder.totalAmount,
      userId: prismaOrder.userId,
      customerId: prismaOrder.customerId,
      supplierId: prismaOrder.supplierId,
      tenantId: prismaOrder.tenantId,
      items: prismaOrder.items.map((item) =>
        this.mapPrismaOrderItemToSharedOrderItem(item, prismaOrder.id),
      ),
      createdAt: prismaOrder.createdAt,
      updatedAt: prismaOrder.updatedAt,
    };

    return order;
  }

  async findAll(tenantId: string, status?: OrderStatus): Promise<Order[]> {
    const orders = await this.prisma.client.order.findMany({
      where: {
        tenantId,
        ...(status && { status }),
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return orders.map((order) =>
      this.mapPrismaOrderToSharedOrder(order as PrismaOrder),
    );
  }

  async findById(id: string, tenantId: string): Promise<Order | null> {
    const order = await this.prisma.client.order.findFirst({
      where: {
        id,
        tenantId,
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    return this.mapPrismaOrderToSharedOrder(order as PrismaOrder);
  }

  async create(
    data: CreateOrderDto,
    userId: string,
    tenantId: string,
  ): Promise<Order> {
    try {
      // Generate order number
      const orderNumber = `ORD-${Date.now()}-${Math.floor(
        Math.random() * 1000,
      )}`;

      // Calculate subtotal from items
      const orderItems = data.items || [];
      const subtotal = orderItems.reduce(
        (sum, item) => sum + item.quantity * (item.unitPrice || 0),
        0,
      );

      // Create order and items in a transaction
      const newOrder = await this.prisma.client.$transaction(async (tx) => {
        // First create the order
        const newOrder = await tx.order.create({
          data: {
            orderNumber,
            status: data.status || OrderStatus.DRAFT,
            orderDate: data.orderDate,
            expectedDeliveryDate: data.expectedDeliveryDate,
            shippingAddress: data.shippingAddress,
            billingAddress: data.billingAddress,
            notes: data.notes,
            paymentMethod: data.paymentMethod,
            paymentStatus: data.paymentStatus,
            trackingNumber: data.trackingNumber,
            supplierOrderReference: data.supplierOrderReference,
            subtotal,
            taxAmount: data.taxAmount || 0,
            shippingCost: data.shippingCost || 0,
            totalAmount:
              subtotal + (data.taxAmount || 0) + (data.shippingCost || 0),
            supplier: {
              connect: { id: data.supplierId },
            },
            user: {
              connect: { id: userId },
            },
            tenant: {
              connect: { id: tenantId },
            },
            items: {
              create: orderItems.map((item) => ({
                quantity: item.quantity,
                unitPrice: item.unitPrice || 0,
                totalPrice: item.quantity * (item.unitPrice || 0),
                notes: item.notes || null,
                product: {
                  connect: { id: item.productId },
                },
              })),
            },
          },
          include: {
            items: {
              include: {
                product: true,
              },
            },
          },
        });

        return newOrder;
      });

      return this.mapPrismaOrderToSharedOrder(newOrder as PrismaOrder);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      throw new BadRequestException(`Failed to create order: ${errorMessage}`);
    }
  }

  async update(
    id: string,
    data: UpdateOrderDto,
    tenantId: string,
  ): Promise<Order> {
    try {
      // First check if order exists
      await this.findById(id, tenantId);

      // Handle order update with items
      return await this.prisma.client.$transaction(async (tx) => {
        // If items are provided, update them
        if (data.items && data.items.length > 0) {
          // Calculate new subtotal
          const subtotal = data.items.reduce(
            (sum, item) => sum + item.quantity * (item.unitPrice || 0),
            0,
          );

          // Update order with new totals and replace items
          const updatedOrder = await tx.order.update({
            where: { id },
            data: {
              status: data.status,
              orderDate: data.orderDate,
              expectedDeliveryDate: data.expectedDeliveryDate,
              shippingAddress: data.shippingAddress,
              billingAddress: data.billingAddress,
              notes: data.notes,
              paymentMethod: data.paymentMethod,
              paymentStatus: data.paymentStatus,
              trackingNumber: data.trackingNumber,
              supplierOrderReference: data.supplierOrderReference,
              taxAmount: data.taxAmount,
              shippingCost: data.shippingCost,
              subtotal,
              totalAmount:
                subtotal + (data.taxAmount || 0) + (data.shippingCost || 0),
              items: {
                deleteMany: {},
                create: data.items.map((item) => ({
                  quantity: item.quantity,
                  unitPrice: item.unitPrice || 0,
                  totalPrice: item.quantity * (item.unitPrice || 0),
                  notes: item.notes || null,
                  product: {
                    connect: { id: item.productId },
                  },
                })),
              },
            },
            include: {
              items: {
                include: {
                  product: true,
                },
              },
            },
          });

          return this.mapPrismaOrderToSharedOrder(updatedOrder as PrismaOrder);
        } else {
          // Just update order details without changing items
          const { items: _items, ...orderData } = data;
          const updatedOrder = await tx.order.update({
            where: { id },
            data: orderData,
            include: {
              items: {
                include: {
                  product: true,
                },
              },
            },
          });

          return this.mapPrismaOrderToSharedOrder(updatedOrder as PrismaOrder);
        }
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      throw new BadRequestException(`Failed to update order: ${errorMessage}`);
    }
  }

  async updateStatus(
    id: string,
    status: OrderStatus,
    tenantId: string,
  ): Promise<Order> {
    try {
      // First check if order exists
      await this.findById(id, tenantId);

      const updatedOrder = await this.prisma.client.order.update({
        where: { id },
        data: { status },
        include: {
          items: {
            include: {
              product: true,
            },
          },
        },
      });

      return this.mapPrismaOrderToSharedOrder(updatedOrder as PrismaOrder);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      throw new BadRequestException(
        `Failed to update order status: ${errorMessage}`,
      );
    }
  }

  async delete(id: string, tenantId: string): Promise<void> {
    try {
      // First check if order exists
      await this.findById(id, tenantId);

      await this.prisma.client.$transaction(async (tx) => {
        // Delete order items first
        await tx.orderItem.deleteMany({
          where: { orderId: id },
        });

        // Then delete the order
        await tx.order.delete({
          where: { id },
        });
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      throw new BadRequestException(`Failed to delete order: ${errorMessage}`);
    }
  }
}
