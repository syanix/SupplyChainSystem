import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsOptional, IsBoolean } from "class-validator";

export class CreateTenantDto {
  @ApiProperty({
    example: "Acme Inc.",
    description: "The name of the tenant",
  })
  @IsNotEmpty({ message: "Tenant name is required" })
  @IsString({ message: "Tenant name must be a string" })
  name: string;

  @ApiProperty({
    example: "A global supply chain company",
    description: "The description of the tenant",
    required: false,
  })
  @IsOptional()
  @IsString({ message: "Description must be a string" })
  description?: string;

  @ApiProperty({
    example: true,
    description: "Whether the tenant is active",
    default: true,
  })
  @IsOptional()
  @IsBoolean({ message: "isActive must be a boolean" })
  isActive?: boolean;

  @ApiProperty({
    example: "https://example.com/logo.png",
    description: "The URL of the tenant logo",
    required: false,
  })
  @IsOptional()
  @IsString({ message: "Logo URL must be a string" })
  logo?: string;

  @ApiProperty({
    example: "#1976D2",
    description: "The primary color of the tenant theme",
    required: false,
  })
  @IsOptional()
  @IsString({ message: "Primary color must be a string" })
  primaryColor?: string;

  @ApiProperty({
    example: "#BBDEFB",
    description: "The secondary color of the tenant theme",
    required: false,
  })
  @IsOptional()
  @IsString({ message: "Secondary color must be a string" })
  secondaryColor?: string;
}
