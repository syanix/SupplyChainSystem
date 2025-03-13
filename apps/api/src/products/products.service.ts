import { Injectable, Inject } from "@nestjs/common";
import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";
import {
  IProductRepository,
  PRODUCT_REPOSITORY,
} from "./repositories/product.repository.interface";

@Injectable()
export class ProductsService {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: IProductRepository,
  ) {}

  async create(createProductDto: CreateProductDto, tenantId: string) {
    return this.productRepository.create(createProductDto, tenantId);
  }

  async findAll(tenantId: string) {
    return this.productRepository.findAll(tenantId);
  }

  async findOne(id: string, tenantId: string) {
    return this.productRepository.findById(id, tenantId);
  }

  async findBySku(sku: string, tenantId: string) {
    return this.productRepository.findBySku(sku, tenantId);
  }

  async update(
    id: string,
    updateProductDto: UpdateProductDto,
    tenantId: string,
  ) {
    return this.productRepository.update(id, updateProductDto, tenantId);
  }

  async remove(id: string, tenantId: string) {
    return this.productRepository.delete(id, tenantId);
  }
}
