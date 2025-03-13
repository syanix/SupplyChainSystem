import { Order, OrderStatus } from "@supply-chain-system/shared";
import { CreateOrderDto } from "../dto/create-order.dto";
import { UpdateOrderDto } from "../dto/update-order.dto";

export interface IOrderRepository {
  findAll(tenantId: string, status?: OrderStatus): Promise<Order[]>;
  findById(id: string, tenantId: string): Promise<Order | null>;
  create(
    data: CreateOrderDto,
    userId: string,
    tenantId: string,
  ): Promise<Order>;
  update(id: string, data: UpdateOrderDto, tenantId: string): Promise<Order>;
  updateStatus(
    id: string,
    status: OrderStatus,
    tenantId: string,
  ): Promise<Order>;
  delete(id: string, tenantId: string): Promise<void>;
}

export const ORDER_REPOSITORY = "ORDER_REPOSITORY";
