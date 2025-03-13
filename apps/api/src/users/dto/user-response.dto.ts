import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { UserRole } from "@supply-chain-system/shared";

export class UserResponseDto {
  @ApiProperty({ description: "User ID" })
  id: string;

  @ApiProperty({ description: "User email" })
  email: string;

  @ApiProperty({ description: "User name" })
  name: string;

  @ApiProperty({ enum: UserRole, description: "User role" })
  role: UserRole;

  @ApiPropertyOptional({ description: "Tenant ID" })
  tenantId?: string;

  @ApiProperty({ description: "Whether the user is active", default: true })
  isActive: boolean;

  @ApiProperty({ description: "User creation date" })
  createdAt: Date;

  @ApiProperty({ description: "User last update date" })
  updatedAt: Date;
}
