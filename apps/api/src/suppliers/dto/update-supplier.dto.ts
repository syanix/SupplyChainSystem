import { ApiPropertyOptional, PartialType } from "@nestjs/swagger";
import {
  CreateSupplierDto,
  CreateSupplierContactDto,
} from "./create-supplier.dto";
import { Type } from "class-transformer";
import { IsArray, IsOptional, ValidateNested } from "class-validator";

export class UpdateSupplierDto extends PartialType(CreateSupplierDto) {
  @ApiPropertyOptional({
    type: [CreateSupplierContactDto],
    description: "Contacts of the supplier",
  })
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreateSupplierContactDto)
  contacts?: CreateSupplierContactDto[];
}
