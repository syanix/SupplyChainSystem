import { ApiProperty } from "@nestjs/swagger";
import {
  IsEmail,
  IsNotEmpty,
  MinLength,
  IsOptional,
  IsUUID,
} from "class-validator";

export class RegisterDto {
  @ApiProperty({
    example: "user@example.com",
    description: "The email of the user",
  })
  @IsEmail({}, { message: "Please provide a valid email address" })
  @IsNotEmpty({ message: "Email is required" })
  email: string;

  @ApiProperty({
    example: "password123",
    description: "The password of the user",
  })
  @IsNotEmpty({ message: "Password is required" })
  @MinLength(6, { message: "Password must be at least 6 characters long" })
  password: string;

  @ApiProperty({
    example: "John",
    description: "The first name of the user",
  })
  @IsNotEmpty({ message: "First name is required" })
  firstName: string;

  @ApiProperty({
    example: "Doe",
    description: "The last name of the user",
  })
  @IsNotEmpty({ message: "Last name is required" })
  lastName: string;

  @ApiProperty({
    example: "123e4567-e89b-12d3-a456-426614174000",
    description: "The ID of the tenant",
    required: false,
  })
  @IsOptional()
  @IsUUID(4, { message: "Tenant ID must be a valid UUID" })
  tenantId?: string;

  @ApiProperty({
    example: "Acme Inc.",
    description: "The name of the company (for creating a new tenant)",
    required: false,
  })
  @IsOptional()
  companyName?: string;
}
