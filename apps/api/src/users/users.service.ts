import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "./entities/user.entity";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = this.usersRepository.create(createUserDto);
    return this.usersRepository.save(user);
  }

  async findAll(tenantId: string): Promise<User[]> {
    return this.usersRepository.find({
      where: { tenantId },
      order: { name: "ASC" },
    });
  }

  async findAllUsers(options?: {
    role?: string;
    isActive?: boolean;
    tenantId?: string;
  }): Promise<User[]> {
    try {
      const queryBuilder = this.usersRepository
        .createQueryBuilder("user")
        .leftJoinAndSelect("user.tenant", "tenant")
        .orderBy("user.name", "ASC");

      // Apply filters if provided
      if (options) {
        if (options.role) {
          queryBuilder.andWhere("user.role = :role", { role: options.role });
        }

        if (options.isActive !== undefined) {
          queryBuilder.andWhere("user.isActive = :isActive", {
            isActive: options.isActive,
          });
        }

        if (options.tenantId) {
          queryBuilder.andWhere("user.tenantId = :tenantId", {
            tenantId: options.tenantId,
          });
        }
      }

      return queryBuilder.getMany();
    } catch (error) {
      console.error("Error fetching all users:", error);
      // If the tenant relation fails, try without it
      return this.usersRepository.find({
        order: { name: "ASC" },
      });
    }
  }

  async findOne(id: string): Promise<User> {
    try {
      const user = await this.usersRepository.findOne({
        where: { id },
        relations: ["tenant"],
      });

      if (!user) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }

      return user;
    } catch (error) {
      console.error(`Error fetching user with ID ${id}:`, error);
      // If the tenant relation fails, try without it
      const user = await this.usersRepository.findOne({ where: { id } });

      if (!user) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }

      return user;
    }
  }

  async findOneWithTenant(id: string): Promise<User> {
    try {
      const user = await this.usersRepository.findOne({
        where: { id },
        relations: ["tenant"],
      });

      if (!user) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }

      return user;
    } catch (error) {
      console.error(`Error fetching user with tenant, ID ${id}:`, error);
      return this.findOne(id);
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({
      where: { email },
      relations: ["tenant"],
    });
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);

    // Update user properties
    Object.assign(user, updateUserDto);

    return this.usersRepository.save(user);
  }

  async remove(id: string): Promise<void> {
    const result = await this.usersRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
  }
}
