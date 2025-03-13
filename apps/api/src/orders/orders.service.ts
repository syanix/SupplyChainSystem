import { Injectable, Inject } from "@nestjs/common";
import { OrderStatus } from "@supply-chain-system/shared";
import { CreateOrderDto } from "./dto/create-order.dto";
import { UpdateOrderDto } from "./dto/update-order.dto";
import {
  IOrderRepository,
  ORDER_REPOSITORY,
} from "./repositories/order.repository.interface";

@Injectable()
export class OrdersService {
  constructor(
    @Inject(ORDER_REPOSITORY)
    private orderRepository: IOrderRepository,
  ) {}

  async create(
    createOrderDto: CreateOrderDto,
    userId: string,
    tenantId: string,
  ) {
    return this.orderRepository.create(createOrderDto, userId, tenantId);
  }

  async findAll(tenantId: string, status?: OrderStatus) {
    return this.orderRepository.findAll(tenantId, status);
  }

  async findOne(id: string, tenantId: string) {
    return this.orderRepository.findById(id, tenantId);
  }

  async update(id: string, updateOrderDto: UpdateOrderDto, tenantId: string) {
    return this.orderRepository.update(id, updateOrderDto, tenantId);
  }

  async updateStatus(id: string, status: OrderStatus, tenantId: string) {
    return this.orderRepository.updateStatus(id, status, tenantId);
  }

  async remove(id: string, tenantId: string) {
    return this.orderRepository.delete(id, tenantId);
  }
}
