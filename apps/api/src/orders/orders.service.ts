import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, DataSource } from "typeorm";
import { Order } from "./entities/order.entity";
import { OrderStatus } from "@supply-chain-system/shared";
import { OrderItem } from "./entities/order-item.entity";
import { CreateOrderDto } from "./dto/create-order.dto";
import { UpdateOrderDto } from "./dto/update-order.dto";

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private orderItemsRepository: Repository<OrderItem>,
    private dataSource: DataSource,
  ) {}

  async create(
    createOrderDto: CreateOrderDto,
    userId: string,
    tenantId: string,
  ): Promise<Order> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Generate a unique order number
      const orderNumber = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

      // Create the order
      const order = queryRunner.manager.create(Order, {
        ...createOrderDto,
        orderNumber,
        userId,
        tenantId,
        subtotal: 0,
        taxAmount: 0,
        shippingCost: 0,
        totalAmount: 0,
      });

      // Save the order to get an ID
      const savedOrder = await queryRunner.manager.save(order);

      // Process order items
      let subtotal = 0;
      const orderItems = [];

      for (const item of createOrderDto.items) {
        const orderItem = queryRunner.manager.create(OrderItem, {
          orderId: savedOrder.id,
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: item.unitPrice || 0,
          totalPrice: (item.unitPrice || 0) * item.quantity,
          notes: item.notes,
        });

        const savedItem = await queryRunner.manager.save(orderItem);
        orderItems.push(savedItem);
        subtotal += savedItem.totalPrice;
      }

      // Update order totals
      savedOrder.subtotal = subtotal;
      savedOrder.totalAmount =
        subtotal + (savedOrder.taxAmount || 0) + (savedOrder.shippingCost || 0);
      await queryRunner.manager.save(savedOrder);

      await queryRunner.commitTransaction();

      return this.findOne(savedOrder.id, tenantId);
    } catch (error: any) {
      await queryRunner.rollbackTransaction();
      throw new BadRequestException(
        `Failed to create order: ${error?.message || "Unknown error"}`,
      );
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(tenantId: string, status?: OrderStatus): Promise<Order[]> {
    const query = this.ordersRepository
      .createQueryBuilder("order")
      .leftJoinAndSelect("order.items", "items")
      .where("order.tenantId = :tenantId", { tenantId });

    if (status) {
      query.andWhere("order.status = :status", { status });
    }

    return query.orderBy("order.createdAt", "DESC").getMany();
  }

  async findOne(id: string, tenantId: string): Promise<Order> {
    const order = await this.ordersRepository.findOne({
      where: { id, tenantId },
      relations: ["items", "items.product"],
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    return order;
  }

  async update(
    id: string,
    updateOrderDto: UpdateOrderDto,
    tenantId: string,
  ): Promise<Order> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Find the order
      const order = await this.findOne(id, tenantId);

      // Update order properties
      const updatedOrder = {
        ...order,
        ...updateOrderDto,
      };

      // Save updated order
      await queryRunner.manager.save(Order, updatedOrder);

      // Handle order items if provided
      if (updateOrderDto.items && updateOrderDto.items.length > 0) {
        // Remove existing items
        await queryRunner.manager.delete(OrderItem, { orderId: id });

        // Add new items
        let subtotal = 0;
        for (const item of updateOrderDto.items) {
          const orderItem = queryRunner.manager.create(OrderItem, {
            orderId: id,
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: item.unitPrice || 0,
            totalPrice: (item.unitPrice || 0) * item.quantity,
            notes: item.notes,
          });

          const savedItem = await queryRunner.manager.save(orderItem);
          subtotal += savedItem.totalPrice;
        }

        // Update order totals
        updatedOrder.subtotal = subtotal;
        updatedOrder.totalAmount =
          subtotal +
          (updatedOrder.taxAmount || 0) +
          (updatedOrder.shippingCost || 0);
        await queryRunner.manager.save(Order, updatedOrder);
      }

      await queryRunner.commitTransaction();

      return this.findOne(id, tenantId);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new BadRequestException(
        `Failed to update order: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    } finally {
      await queryRunner.release();
    }
  }

  async updateStatus(
    id: string,
    status: OrderStatus,
    tenantId: string,
  ): Promise<Order> {
    const order = await this.findOne(id, tenantId);
    order.status = status;
    return this.ordersRepository.save(order);
  }

  async remove(id: string, tenantId: string): Promise<void> {
    const order = await this.findOne(id, tenantId);
    await this.ordersRepository.remove(order);
  }
}
