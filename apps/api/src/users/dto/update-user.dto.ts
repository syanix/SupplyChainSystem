import { ApiProperty, PartialType } from "@nestjs/swagger";
import { CreateUserDto } from "./create-user.dto";
import {
  IsOptional,
  IsUUID,
  IsBoolean,
  MinLength,
  Matches,
} from "class-validator";

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiProperty({
    example: "123e4567-e89b-12d3-a456-426614174000",
    description: "The ID of the tenant",
    required: false,
  })
  @IsOptional()
  @IsUUID(4, { message: "Tenant ID must be a valid UUID" })
  tenantId?: string;

  @ApiProperty({
    example: true,
    description: "Whether the user is active",
    required: false,
  })
  @IsOptional()
  @IsBoolean({ message: "isActive must be a boolean" })
  isActive?: boolean;

  @ApiProperty({
    example: "Password123!",
    description:
      "The new password for the user (min 6 chars, must include uppercase, lowercase, number, and special character)",
    required: false,
  })
  @IsOptional()
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
  password?: string;
}
