import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
  IsArray,
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from "class-validator";
import { OrderStatus } from "@supply-chain-system/shared";

export class CreateOrderItemDto {
  @ApiProperty({ description: "Product ID" })
  @IsUUID()
  @IsNotEmpty()
  productId: string;

  @ApiProperty({ description: "Quantity of the product" })
  @IsNumber()
  @IsNotEmpty()
  quantity: number;

  @ApiPropertyOptional({ description: "Unit price of the product" })
  @IsNumber()
  @IsOptional()
  unitPrice?: number;

  @ApiPropertyOptional({ description: "Notes for the order item" })
  @IsString()
  @IsOptional()
  notes?: string;
}

export class CreateOrderDto {
  @ApiPropertyOptional({
    enum: OrderStatus,
    default: OrderStatus.DRAFT,
    description: "Status of the order",
  })
  @IsEnum(OrderStatus)
  @IsOptional()
  status?: OrderStatus = OrderStatus.DRAFT;

  @ApiProperty({ description: "Order date", type: Date })
  @IsDate()
  @Type(() => Date)
  orderDate: Date;

  @ApiPropertyOptional({ description: "Expected delivery date", type: Date })
  @IsDate()
  @IsOptional()
  @Type(() => Date)
  expectedDeliveryDate?: Date;

  @ApiPropertyOptional({ description: "Shipping address" })
  @IsString()
  @IsOptional()
  shippingAddress?: string;

  @ApiPropertyOptional({ description: "Billing address" })
  @IsString()
  @IsOptional()
  billingAddress?: string;

  @ApiPropertyOptional({ description: "Notes for the order" })
  @IsString()
  @IsOptional()
  notes?: string;

  @ApiPropertyOptional({ description: "Payment method" })
  @IsString()
  @IsOptional()
  paymentMethod?: string;

  @ApiPropertyOptional({ description: "Payment status" })
  @IsString()
  @IsOptional()
  paymentStatus?: string;

  @ApiPropertyOptional({ description: "Tracking number" })
  @IsString()
  @IsOptional()
  trackingNumber?: string;

  @ApiPropertyOptional({ description: "Supplier order reference" })
  @IsString()
  @IsOptional()
  supplierOrderReference?: string;

  @ApiProperty({ type: [CreateOrderItemDto], description: "Order items" })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  items: CreateOrderItemDto[];
}
