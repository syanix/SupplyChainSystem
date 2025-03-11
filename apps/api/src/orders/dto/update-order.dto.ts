import { PartialType, ApiPropertyOptional } from "@nestjs/swagger";
import { CreateOrderDto, CreateOrderItemDto } from "./create-order.dto";
import { Type } from "class-transformer";
import { IsArray, IsOptional, ValidateNested } from "class-validator";

export class UpdateOrderDto extends PartialType(CreateOrderDto) {
  @ApiPropertyOptional({
    type: [CreateOrderItemDto],
    description: "Order items",
  })
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  items?: CreateOrderItemDto[];
}
