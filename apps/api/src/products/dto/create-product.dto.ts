import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from "class-validator";

export class CreateProductDto {
  @ApiProperty({ description: "Name of the product" })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ description: "Description of the product" })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: "Price of the product" })
  @IsNumber()
  @IsNotEmpty()
  price: number;

  @ApiPropertyOptional({ description: "Cost of the product", default: 0 })
  @IsNumber()
  @IsOptional()
  cost?: number = 0;

  @ApiPropertyOptional({
    description: "Stock quantity of the product",
    default: 0,
  })
  @IsNumber()
  @IsOptional()
  stockQuantity?: number = 0;

  @ApiPropertyOptional({
    description: "SKU (Stock Keeping Unit) of the product",
  })
  @IsString()
  @IsOptional()
  sku?: string;

  @ApiPropertyOptional({ description: "Barcode of the product" })
  @IsString()
  @IsOptional()
  barcode?: string;

  @ApiPropertyOptional({ description: "Image URL of the product" })
  @IsString()
  @IsOptional()
  imageUrl?: string;

  @ApiPropertyOptional({
    description: "Whether the product is active",
    default: true,
  })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean = true;

  @ApiProperty({ description: "ID of the supplier for this product" })
  @IsUUID()
  @IsNotEmpty()
  supplierId: string;

  @ApiPropertyOptional({ description: "Category of the product" })
  @IsString()
  @IsOptional()
  category?: string;

  @ApiPropertyOptional({
    description: "Custom attributes for the product",
    type: "object",
  })
  @IsOptional()
  attributes?: Record<string, unknown>;
}
