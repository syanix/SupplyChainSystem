import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from "@nestjs/swagger";
import { OrdersService } from "./orders.service";
import { CreateOrderDto } from "./dto/create-order.dto";
import { UpdateOrderDto } from "./dto/update-order.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { GetUser } from "../common/decorators/get-user.decorator";
import { OrderStatus } from "@supply-chain-system/shared";

@ApiTags("orders")
@Controller("orders")
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @ApiOperation({ summary: "Create a new order" })
  @ApiResponse({ status: 201, description: "Order created successfully" })
  @ApiResponse({ status: 400, description: "Bad request" })
  create(
    @Body() createOrderDto: CreateOrderDto,
    @GetUser("id") userId: string,
    @GetUser("tenantId") tenantId: string,
  ) {
    return this.ordersService.create(createOrderDto, userId, tenantId);
  }

  @Get()
  @ApiOperation({ summary: "Get all orders for the current tenant" })
  @ApiResponse({ status: 200, description: "Orders retrieved successfully" })
  @ApiQuery({ name: "status", enum: OrderStatus, required: false })
  findAll(
    @GetUser("tenantId") tenantId: string,
    @Query("status") status?: OrderStatus,
  ) {
    return this.ordersService.findAll(tenantId, status);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get an order by ID" })
  @ApiResponse({ status: 200, description: "Order retrieved successfully" })
  @ApiResponse({ status: 404, description: "Order not found" })
  findOne(@Param("id") id: string, @GetUser("tenantId") tenantId: string) {
    return this.ordersService.findOne(id, tenantId);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update an order" })
  @ApiResponse({ status: 200, description: "Order updated successfully" })
  @ApiResponse({ status: 404, description: "Order not found" })
  update(
    @Param("id") id: string,
    @Body() updateOrderDto: UpdateOrderDto,
    @GetUser("tenantId") tenantId: string,
  ) {
    return this.ordersService.update(id, updateOrderDto, tenantId);
  }

  @Patch(":id/status")
  @ApiOperation({ summary: "Update order status" })
  @ApiResponse({
    status: 200,
    description: "Order status updated successfully",
  })
  @ApiResponse({ status: 404, description: "Order not found" })
  updateStatus(
    @Param("id") id: string,
    @Body("status") status: OrderStatus,
    @GetUser("tenantId") tenantId: string,
  ) {
    return this.ordersService.updateStatus(id, status, tenantId);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete an order" })
  @ApiResponse({ status: 200, description: "Order deleted successfully" })
  @ApiResponse({ status: 404, description: "Order not found" })
  remove(@Param("id") id: string, @GetUser("tenantId") tenantId: string) {
    return this.ordersService.remove(id, tenantId);
  }
}
