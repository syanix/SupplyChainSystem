import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";
import { Product } from "./entities/product.entity";
import { v4 as uuidv4 } from "uuid";

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async create(
    createProductDto: CreateProductDto,
    tenantId: string,
  ): Promise<Product> {
    const product = this.productRepository.create({
      id: uuidv4(),
      ...createProductDto,
      tenantId,
    });
    return this.productRepository.save(product);
  }

  async findAll(tenantId: string): Promise<Product[]> {
    return this.productRepository.find({
      where: { tenantId },
      order: { createdAt: "DESC" },
    });
  }

  async findOne(id: string, tenantId: string): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { id, tenantId },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    return product;
  }

  async update(
    id: string,
    updateProductDto: UpdateProductDto,
    tenantId: string,
  ): Promise<Product> {
    const product = await this.findOne(id, tenantId);

    Object.assign(product, updateProductDto);

    return this.productRepository.save(product);
  }

  async remove(id: string, tenantId: string): Promise<void> {
    const product = await this.findOne(id, tenantId);

    await this.productRepository.remove(product);
  }
}
