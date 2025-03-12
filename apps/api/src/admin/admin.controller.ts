import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  NotFoundException,
  Query,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from "@nestjs/swagger";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { SuperAdminGuard } from "../common/guards/super-admin.guard";
import { TenantsService } from "../tenants/tenants.service";
import { UsersService } from "../users/users.service";
import { CreateTenantDto } from "../tenants/dto/create-tenant.dto";
import { UpdateTenantDto } from "../tenants/dto/update-tenant.dto";
import { CreateUserDto } from "../users/dto/create-user.dto";
import { UpdateUserDto } from "../users/dto/update-user.dto";

@ApiTags("admin")
@Controller("admin")
@UseGuards(JwtAuthGuard, SuperAdminGuard)
@ApiBearerAuth()
export class AdminController {
  constructor(
    private readonly tenantsService: TenantsService,
    private readonly usersService: UsersService,
  ) {}

  // Tenant management endpoints
  @Get("tenants")
  @ApiOperation({ summary: "Get all tenants (Super Admin only)" })
  @ApiResponse({ status: 200, description: "List of all tenants" })
  async getAllTenants() {
    return this.tenantsService.findAll();
  }

  @Get("tenants/:id")
  @ApiOperation({ summary: "Get tenant by ID (Super Admin only)" })
  @ApiResponse({ status: 200, description: "Tenant details" })
  @ApiResponse({ status: 404, description: "Tenant not found" })
  async getTenantById(@Param("id") id: string) {
    return this.tenantsService.findOne(id);
  }

  @Post("tenants")
  @ApiOperation({ summary: "Create a new tenant (Super Admin only)" })
  @ApiResponse({ status: 201, description: "Tenant created successfully" })
  async createTenant(@Body() createTenantDto: CreateTenantDto) {
    return this.tenantsService.create(createTenantDto);
  }

  @Patch("tenants/:id")
  @ApiOperation({ summary: "Update a tenant (Super Admin only)" })
  @ApiResponse({ status: 200, description: "Tenant updated successfully" })
  @ApiResponse({ status: 404, description: "Tenant not found" })
  async updateTenant(
    @Param("id") id: string,
    @Body() updateTenantDto: UpdateTenantDto,
  ) {
    return this.tenantsService.update(id, updateTenantDto);
  }

  @Delete("tenants/:id")
  @ApiOperation({ summary: "Delete a tenant (Super Admin only)" })
  @ApiResponse({ status: 200, description: "Tenant deleted successfully" })
  @ApiResponse({ status: 404, description: "Tenant not found" })
  async deleteTenant(@Param("id") id: string) {
    return this.tenantsService.remove(id);
  }

  // User management endpoints (across all tenants)
  @Get("users")
  @ApiOperation({
    summary: "Get all users across all tenants (Super Admin only)",
  })
  @ApiResponse({ status: 200, description: "List of all users" })
  @ApiQuery({
    name: "role",
    required: false,
    description: "Filter by user role",
  })
  @ApiQuery({
    name: "isActive",
    required: false,
    description: "Filter by active status",
  })
  @ApiQuery({
    name: "tenantId",
    required: false,
    description: "Filter by tenant ID",
  })
  async getAllUsers(
    @Query("role") role?: string,
    @Query("isActive") isActive?: string,
    @Query("tenantId") tenantId?: string,
  ) {
    const options = {
      ...(role && { role }),
      ...(isActive !== undefined && { isActive: isActive === "true" }),
      ...(tenantId && { tenantId }),
    };

    return this.usersService.findAllUsers(options);
  }

  @Get("users/:id")
  @ApiOperation({ summary: "Get user by ID (Super Admin only)" })
  @ApiResponse({ status: 200, description: "User details" })
  @ApiResponse({ status: 404, description: "User not found" })
  async getUserById(@Param("id") id: string) {
    return this.usersService.findOneWithTenant(id);
  }

  @Post("users")
  @ApiOperation({ summary: "Create a new user (Super Admin only)" })
  @ApiResponse({ status: 201, description: "User created successfully" })
  async createUser(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Patch("users/:id")
  @ApiOperation({ summary: "Update a user (Super Admin only)" })
  @ApiResponse({ status: 200, description: "User updated successfully" })
  @ApiResponse({ status: 404, description: "User not found" })
  async updateUser(
    @Param("id") id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete("users/:id")
  @ApiOperation({ summary: "Delete a user (Super Admin only)" })
  @ApiResponse({ status: 200, description: "User deleted successfully" })
  @ApiResponse({ status: 404, description: "User not found" })
  async deleteUser(@Param("id") id: string) {
    return this.usersService.remove(id);
  }
}
