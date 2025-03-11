import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, MinLength, IsString } from "class-validator";

export class LoginDto {
  @ApiProperty({
    example: "user@example.com",
    description: "The email of the user",
  })
  @IsEmail({}, { message: "Please provide a valid email address" })
  @IsNotEmpty({ message: "Email is required" })
  email: string = "";

  @ApiProperty({
    example: "password123",
    description: "The password of the user",
  })
  @IsString()
  @IsNotEmpty({ message: "Password is required" })
  @MinLength(6, { message: "Password must be at least 6 characters long" })
  password: string = "";
}
