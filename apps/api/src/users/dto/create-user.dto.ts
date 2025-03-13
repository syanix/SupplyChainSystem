import { ApiProperty } from "@nestjs/swagger";
import {
  IsEmail,
  IsNotEmpty,
  MinLength,
  IsUUID,
  IsIn,
  IsOptional,
  IsBoolean,
  Matches,
} from "class-validator";
import { UserRole } from "@supply-chain-system/shared";

export class CreateUserDto {
  @ApiProperty({
    example: "user@example.com",
    description: "The email of the user",
  })
  @IsEmail({}, { message: "Please provide a valid email address" })
  @IsNotEmpty({ message: "Email is required" })
  email: string;

  @ApiProperty({
    example: "Password123!",
    description:
      "The password of the user (min 6 chars, must include uppercase, lowercase, number, and special character)",
  })
  @IsNotEmpty({ message: "Password is required" })
  @MinLength(6, { message: "Password must be at least 6 characters long" })
  @Matches(/(?=.*[a-z])/, {
    message: "Password must contain at least one lowercase letter",
  })
  @Matches(/(?=.*[A-Z])/, {
    message: "Password must contain at least one uppercase letter",
  })
  @Matches(/(?=.*\d)/, { message: "Password must contain at least one number" })
  @Matches(/(?=.*[@$!%*?&])/, {
    message: "Password must contain at least one special character (@$!%*?&)",
  })
  password: string;

  @ApiProperty({
    example: "John Doe",
    description: "The full name of the user",
  })
  @IsNotEmpty({ message: "Name is required" })
  name: string;

  @ApiProperty({
    example: "STAFF",
    description: "The role of the user",
    enum: UserRole,
    default: UserRole.STAFF,
  })
  @IsIn(Object.values(UserRole), {
    message: "Role must be one of: SUPER_ADMIN, ADMIN, MANAGER, STAFF",
  })
  role: UserRole;

  @ApiProperty({
    example: "123e4567-e89b-12d3-a456-426614174000",
    description: "The ID of the tenant",
  })
  @IsNotEmpty({ message: "Tenant ID is required" })
  @IsUUID(4, { message: "Tenant ID must be a valid UUID" })
  tenantId: string;

  @ApiProperty({
    example: true,
    description: "Whether the user is active",
    required: false,
    default: true,
  })
  @IsOptional()
  @IsBoolean({ message: "isActive must be a boolean" })
  isActive?: boolean;
}
