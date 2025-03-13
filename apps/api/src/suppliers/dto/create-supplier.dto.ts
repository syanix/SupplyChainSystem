import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
  IsArray,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from "class-validator";
import { SupplierStatus } from "@supply-chain-system/shared";

export class CreateSupplierContactDto {
  @ApiProperty({ description: "Name of the contact person" })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ description: "Position of the contact person" })
  @IsString()
  @IsOptional()
  position?: string;

  @ApiPropertyOptional({ description: "Email of the contact person" })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({ description: "Phone number of the contact person" })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiPropertyOptional({ description: "Mobile number of the contact person" })
  @IsString()
  @IsOptional()
  mobile?: string;

  @ApiPropertyOptional({ description: "Notes about the contact person" })
  @IsString()
  @IsOptional()
  notes?: string;

  @ApiPropertyOptional({
    description: "Whether this is the primary contact",
    default: true,
  })
  @IsOptional()
  isPrimary?: boolean = true;
}

export class CreateSupplierDto {
  @ApiProperty({ description: "Name of the supplier" })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ description: "Description of the supplier" })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ description: "Email of the supplier" })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({ description: "Phone number of the supplier" })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiPropertyOptional({ description: "Website of the supplier" })
  @IsString()
  @IsOptional()
  website?: string;

  @ApiPropertyOptional({ description: "Address of the supplier" })
  @IsString()
  @IsOptional()
  address?: string;

  @ApiPropertyOptional({ description: "City of the supplier" })
  @IsString()
  @IsOptional()
  city?: string;

  @ApiPropertyOptional({ description: "State/Province of the supplier" })
  @IsString()
  @IsOptional()
  state?: string;

  @ApiPropertyOptional({ description: "Postal code of the supplier" })
  @IsString()
  @IsOptional()
  postalCode?: string;

  @ApiPropertyOptional({ description: "Country of the supplier" })
  @IsString()
  @IsOptional()
  country?: string;

  @ApiPropertyOptional({
    enum: SupplierStatus,
    default: SupplierStatus.ACTIVE,
    description: "Status of the supplier",
  })
  @IsEnum(SupplierStatus)
  @IsOptional()
  status?: SupplierStatus = SupplierStatus.ACTIVE;

  @ApiPropertyOptional({ description: "Tax ID of the supplier" })
  @IsString()
  @IsOptional()
  taxId?: string;

  @ApiPropertyOptional({ description: "Payment terms of the supplier" })
  @IsString()
  @IsOptional()
  paymentTerms?: string;

  @ApiPropertyOptional({ description: "Notes about the supplier" })
  @IsString()
  @IsOptional()
  notes?: string;

  @ApiPropertyOptional({
    description: "Custom attributes for the supplier",
    type: "object",
  })
  @IsOptional()
  attributes?: Record<string, unknown>;

  @ApiPropertyOptional({
    type: [CreateSupplierContactDto],
    description: "Contacts of the supplier",
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateSupplierContactDto)
  @IsOptional()
  contacts?: CreateSupplierContactDto[];
}
