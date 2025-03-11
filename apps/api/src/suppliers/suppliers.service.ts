import {
  Injectable,
  NotFoundException,
  ConflictException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, DataSource } from "typeorm";
import { Supplier } from "./entities/supplier.entity";
import { SupplierContact } from "./entities/supplier-contact.entity";
import { CreateSupplierDto } from "./dto/create-supplier.dto";
import { UpdateSupplierDto } from "./dto/update-supplier.dto";

@Injectable()
export class SuppliersService {
  constructor(
    @InjectRepository(Supplier)
    private suppliersRepository: Repository<Supplier>,
    @InjectRepository(SupplierContact)
    private supplierContactsRepository: Repository<SupplierContact>,
    private dataSource: DataSource,
  ) {}

  async create(
    createSupplierDto: CreateSupplierDto,
    tenantId: string,
  ): Promise<Supplier> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Create the supplier
      const supplier = queryRunner.manager.create(Supplier, {
        ...createSupplierDto,
        tenantId,
        contacts: [],
      });

      // Save the supplier to get an ID
      const savedSupplier = await queryRunner.manager.save(supplier);

      // Process supplier contacts if provided
      if (createSupplierDto.contacts && createSupplierDto.contacts.length > 0) {
        for (const contactDto of createSupplierDto.contacts) {
          const contact = queryRunner.manager.create(SupplierContact, {
            ...contactDto,
            supplierId: savedSupplier.id,
          });

          await queryRunner.manager.save(contact);
        }
      }

      await queryRunner.commitTransaction();

      return this.findOne(savedSupplier.id, tenantId);
    } catch (error: any) {
      await queryRunner.rollbackTransaction();
      throw new ConflictException(
        `Failed to create supplier: ${error?.message || "Unknown error"}`,
      );
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(tenantId: string): Promise<Supplier[]> {
    try {
      return await this.suppliersRepository.find({
        where: { tenantId },
        relations: ["contacts"],
        order: { name: "ASC" },
      });
    } catch (error) {
      // If the contacts relation fails, try without it
      console.error("Error fetching suppliers with contacts:", error);
      return await this.suppliersRepository.find({
        where: { tenantId },
        order: { name: "ASC" },
      });
    }
  }

  async findOne(id: string, tenantId: string): Promise<Supplier> {
    try {
      const supplier = await this.suppliersRepository.findOne({
        where: { id, tenantId },
        relations: ["contacts"],
      });

      if (!supplier) {
        throw new NotFoundException(`Supplier with ID ${id} not found`);
      }

      return supplier;
    } catch (error) {
      // If the error is a NotFoundException, rethrow it
      if (error instanceof NotFoundException) {
        throw error;
      }

      // If the contacts relation fails, try without it
      console.error("Error fetching supplier with contacts:", error);
      const supplier = await this.suppliersRepository.findOne({
        where: { id, tenantId },
      });

      if (!supplier) {
        throw new NotFoundException(`Supplier with ID ${id} not found`);
      }

      return supplier;
    }
  }

  async update(
    id: string,
    updateSupplierDto: UpdateSupplierDto,
    tenantId: string,
  ): Promise<Supplier> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Find the supplier
      const supplier = await this.findOne(id, tenantId);

      // Update supplier properties
      const updatedSupplier = {
        ...supplier,
        ...updateSupplierDto,
      };

      // Remove contacts property if it exists to avoid TypeORM issues
      if (updatedSupplier.contacts) {
        const _contacts = [...updatedSupplier.contacts];
        updatedSupplier.contacts = undefined;
      }

      // Save updated supplier
      await queryRunner.manager.save(Supplier, updatedSupplier);

      // Handle supplier contacts if provided
      if (updateSupplierDto.contacts && updateSupplierDto.contacts.length > 0) {
        // Remove existing contacts
        await queryRunner.manager.delete(SupplierContact, { supplierId: id });

        // Add new contacts
        for (const contactDto of updateSupplierDto.contacts) {
          const contact = queryRunner.manager.create(SupplierContact, {
            ...contactDto,
            supplierId: id,
          });

          await queryRunner.manager.save(contact);
        }
      }

      await queryRunner.commitTransaction();

      return this.findOne(id, tenantId);
    } catch (error: any) {
      await queryRunner.rollbackTransaction();
      throw new ConflictException(
        `Failed to update supplier: ${error?.message || "Unknown error"}`,
      );
    } finally {
      await queryRunner.release();
    }
  }

  async remove(id: string, tenantId: string): Promise<void> {
    const supplier = await this.findOne(id, tenantId);
    await this.suppliersRepository.remove(supplier);
  }
}
