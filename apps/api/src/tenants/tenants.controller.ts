import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from "@nestjs/swagger";
import { TenantsService } from "./tenants.service";
import { CreateTenantDto } from "./dto/create-tenant.dto";
import { UpdateTenantDto } from "./dto/update-tenant.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { GetUser } from "../common/decorators/get-user.decorator";

@ApiTags("tenants")
@Controller("tenants")
export class TenantsController {
  constructor(private readonly tenantsService: TenantsService) {}

  @Post()
  @ApiOperation({ summary: "Create a new tenant" })
  @ApiResponse({ status: 201, description: "Tenant created successfully" })
  @ApiResponse({ status: 400, description: "Bad request" })
  create(@Body() createTenantDto: CreateTenantDto) {
    return this.tenantsService.create(createTenantDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get all tenants" })
  @ApiResponse({ status: 200, description: "Tenants retrieved successfully" })
  findAll() {
    return this.tenantsService.findAll();
  }

  @Get(":id")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get a tenant by ID" })
  @ApiResponse({ status: 200, description: "Tenant retrieved successfully" })
  @ApiResponse({ status: 404, description: "Tenant not found" })
  findOne(@Param("id") id: string) {
    return this.tenantsService.findOne(id);
  }

  @Patch(":id")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Update a tenant" })
  @ApiResponse({ status: 200, description: "Tenant updated successfully" })
  @ApiResponse({ status: 404, description: "Tenant not found" })
  update(
    @Param("id") id: string,
    @Body() updateTenantDto: UpdateTenantDto,
    @GetUser("tenantId") userTenantId: string,
  ) {
    // Only allow users to update their own tenant
    if (id !== userTenantId) {
      throw new Error("You can only update your own tenant");
    }
    return this.tenantsService.update(id, updateTenantDto);
  }

  @Delete(":id")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Delete a tenant" })
  @ApiResponse({ status: 200, description: "Tenant deleted successfully" })
  @ApiResponse({ status: 404, description: "Tenant not found" })
  remove(@Param("id") id: string) {
    return this.tenantsService.remove(id);
  }
}
