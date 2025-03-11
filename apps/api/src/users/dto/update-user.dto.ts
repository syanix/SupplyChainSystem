import { ApiProperty, PartialType } from "@nestjs/swagger";
import { CreateUserDto } from "./create-user.dto";
import { IsOptional, IsUUID } from "class-validator";

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiProperty({
    example: "123e4567-e89b-12d3-a456-426614174000",
    description: "The ID of the tenant",
    required: false,
  })
  @IsOptional()
  @IsUUID(4, { message: "Tenant ID must be a valid UUID" })
  tenantId?: string;
}
