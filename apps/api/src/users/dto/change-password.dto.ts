import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, MinLength } from "class-validator";

export class ChangePasswordDto {
  @ApiProperty({
    description: "Current password",
    example: "currentPassword123",
  })
  @IsNotEmpty({ message: "Current password is required" })
  @IsString({ message: "Current password must be a string" })
  currentPassword: string;

  @ApiProperty({
    description: "New password",
    example: "newPassword123",
  })
  @IsNotEmpty({ message: "New password is required" })
  @IsString({ message: "New password must be a string" })
  @MinLength(6, { message: "New password must be at least 6 characters long" })
  newPassword: string;
}
