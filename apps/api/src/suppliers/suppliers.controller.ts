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
import { SuppliersService } from "./suppliers.service";
import { CreateSupplierDto } from "./dto/create-supplier.dto";
import { UpdateSupplierDto } from "./dto/update-supplier.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { GetUser } from "../common/decorators/get-user.decorator";

@ApiTags("suppliers")
@Controller("suppliers")
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class SuppliersController {
  constructor(private readonly suppliersService: SuppliersService) {}

  @Post()
  @ApiOperation({ summary: "Create a new supplier" })
  @ApiResponse({ status: 201, description: "Supplier created successfully" })
  @ApiResponse({ status: 400, description: "Bad request" })
  create(
    @Body() createSupplierDto: CreateSupplierDto,
    @GetUser("tenantId") tenantId: string,
  ) {
    return this.suppliersService.create(createSupplierDto, tenantId);
  }

  @Get()
  @ApiOperation({ summary: "Get all suppliers for the current tenant" })
  @ApiResponse({ status: 200, description: "Suppliers retrieved successfully" })
  findAll(@GetUser("tenantId") tenantId: string) {
    return this.suppliersService.findAll(tenantId);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get a supplier by ID" })
  @ApiResponse({ status: 200, description: "Supplier retrieved successfully" })
  @ApiResponse({ status: 404, description: "Supplier not found" })
  findOne(@Param("id") id: string, @GetUser("tenantId") tenantId: string) {
    return this.suppliersService.findOne(id, tenantId);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update a supplier" })
  @ApiResponse({ status: 200, description: "Supplier updated successfully" })
  @ApiResponse({ status: 404, description: "Supplier not found" })
  update(
    @Param("id") id: string,
    @Body() updateSupplierDto: UpdateSupplierDto,
    @GetUser("tenantId") tenantId: string,
  ) {
    return this.suppliersService.update(id, updateSupplierDto, tenantId);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete a supplier" })
  @ApiResponse({ status: 200, description: "Supplier deleted successfully" })
  @ApiResponse({ status: 404, description: "Supplier not found" })
  remove(@Param("id") id: string, @GetUser("tenantId") tenantId: string) {
    return this.suppliersService.remove(id, tenantId);
  }
}
