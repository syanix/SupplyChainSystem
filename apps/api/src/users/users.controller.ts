import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UnauthorizedException,
  BadRequestException,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from "@nestjs/swagger";
import { UsersService } from "./users.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { ChangePasswordDto } from "./dto/change-password.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { GetUser } from "../common/decorators/get-user.decorator";
import * as bcrypt from "bcrypt";

@ApiTags("users")
@Controller("users")
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({ summary: "Create a new user" })
  @ApiResponse({ status: 201, description: "User created successfully" })
  @ApiResponse({ status: 400, description: "Bad request" })
  create(
    @Body() createUserDto: CreateUserDto,
    @GetUser("tenantId") tenantId: string,
  ) {
    // Ensure the user is created within the same tenant as the authenticated user
    createUserDto.tenantId = tenantId;
    return this.usersService.create(createUserDto);
  }

  @Get()
  @ApiOperation({ summary: "Get all users for the current tenant" })
  @ApiResponse({ status: 200, description: "Users retrieved successfully" })
  findAll(@GetUser("tenantId") tenantId: string) {
    return this.usersService.findAll(tenantId);
  }

  @Get("profile/me")
  @ApiOperation({ summary: "Get current user profile" })
  @ApiResponse({ status: 200, description: "Profile retrieved successfully" })
  async getProfile(@GetUser("id") userId: string) {
    // Get user with tenant relation
    return this.usersService.findOneWithTenant(userId);
  }

  @Patch("profile")
  @ApiOperation({ summary: "Update current user profile" })
  @ApiResponse({ status: 200, description: "Profile updated successfully" })
  @ApiResponse({ status: 404, description: "User not found" })
  updateProfile(
    @GetUser("id") userId: string,
    @Body() updateUserDto: UpdateUserDto,
    @GetUser("tenantId") tenantId: string,
  ) {
    // Ensure the tenant ID cannot be changed
    if (updateUserDto.tenantId) {
      updateUserDto.tenantId = tenantId;
    }
    return this.usersService.update(userId, updateUserDto);
  }

  @Post("change-password")
  @ApiOperation({ summary: "Change user password" })
  @ApiResponse({ status: 200, description: "Password changed successfully" })
  @ApiResponse({ status: 401, description: "Current password is incorrect" })
  @ApiResponse({ status: 400, description: "Invalid password format" })
  async changePassword(
    @GetUser("id") userId: string,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    const user = await this.usersService.findOne(userId);

    // Verify current password
    const isPasswordValid = await bcrypt.compare(
      changePasswordDto.currentPassword,
      user.password || "",
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException("Current password is incorrect");
    }

    // Validate new password (you can add more validation rules)
    if (changePasswordDto.newPassword.length < 6) {
      throw new BadRequestException(
        "New password must be at least 6 characters long",
      );
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(changePasswordDto.newPassword, 10);

    // Update user with new password
    await this.usersService.update(userId, { password: hashedPassword });

    return { message: "Password changed successfully" };
  }

  @Get(":id")
  @ApiOperation({ summary: "Get a user by ID" })
  @ApiResponse({ status: 200, description: "User retrieved successfully" })
  @ApiResponse({ status: 404, description: "User not found" })
  findOne(@Param("id") id: string, @GetUser("tenantId") _tenantId: string) {
    return this.usersService.findOne(id);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update a user" })
  @ApiResponse({ status: 200, description: "User updated successfully" })
  @ApiResponse({ status: 404, description: "User not found" })
  update(
    @Param("id") id: string,
    @Body() updateUserDto: UpdateUserDto,
    @GetUser("tenantId") tenantId: string,
  ) {
    // Ensure the tenant ID cannot be changed
    if (updateUserDto.tenantId) {
      updateUserDto.tenantId = tenantId;
    }
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete a user" })
  @ApiResponse({ status: 200, description: "User deleted successfully" })
  @ApiResponse({ status: 404, description: "User not found" })
  remove(@Param("id") id: string, @GetUser("tenantId") _tenantId: string) {
    return this.usersService.remove(id);
  }
}
