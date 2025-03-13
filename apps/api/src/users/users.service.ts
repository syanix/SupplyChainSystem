import {
  Injectable,
  NotFoundException,
  Inject,
  BadRequestException,
} from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import * as bcrypt from "bcrypt";
import { UserRole, User } from "@supply-chain-system/shared";
import {
  IUserRepository,
  USER_REPOSITORY,
} from "./repositories/user.repository.interface";

// Type for user response without password
type UserResponse = Omit<User, "password">;

@Injectable()
export class UsersService {
  constructor(
    @Inject(USER_REPOSITORY)
    private userRepository: IUserRepository,
  ) {}

  /**
   * Find all users, optionally filtered by tenant
   */
  async findAll(tenantId?: string): Promise<UserResponse[]> {
    const users = await this.userRepository.findAll(tenantId);
    return users.map(this.excludePassword);
  }

  /**
   * Find users by various filters
   */
  async findAllUsers(options?: {
    role?: UserRole;
    isActive?: boolean;
    tenantId?: string;
  }): Promise<UserResponse[]> {
    const users = await this.userRepository.findByFilters(options || {});
    return users.map(this.excludePassword);
  }

  /**
   * Find a user by ID, with optional tenant filtering
   * @throws NotFoundException if user not found
   */
  async findOne(id: string, tenantId?: string): Promise<UserResponse> {
    const user = await this.userRepository.findById(id, tenantId);

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return this.excludePassword(user);
  }

  /**
   * Find a user by ID and include tenant information
   * @throws NotFoundException if user not found
   */
  async findOneWithTenant(id: string): Promise<UserResponse> {
    const user = await this.userRepository.findByIdWithTenant(id);

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return this.excludePassword(user);
  }

  /**
   * Find a user by email
   */
  async findByEmail(email: string): Promise<UserResponse | null> {
    const user = await this.userRepository.findByEmail(email);
    return user ? this.excludePassword(user) : null;
  }

  /**
   * Get a user with password for authentication purposes
   * @internal Used only by auth service
   */
  async getUserWithPasswordByEmail(email: string): Promise<User | null> {
    return this.userRepository.findByEmail(email);
  }

  /**
   * Create a new user
   */
  async create(
    createUserDto: CreateUserDto,
    tenantId?: string,
  ): Promise<UserResponse> {
    // Hash the password before saving
    const hashedPassword = await this.hashPassword(createUserDto.password);

    const user = await this.userRepository.create({
      email: createUserDto.email,
      name: createUserDto.name,
      password: hashedPassword,
      role: createUserDto.role,
      isActive: createUserDto.isActive,
      tenantId: tenantId || createUserDto.tenantId,
    });

    return this.excludePassword(user);
  }

  /**
   * Update an existing user
   * @throws NotFoundException if user not found
   */
  async update(
    id: string,
    updateUserDto: UpdateUserDto,
    tenantId?: string,
  ): Promise<UserResponse> {
    // If password is provided, hash it
    if (updateUserDto.password) {
      updateUserDto.password = await this.hashPassword(updateUserDto.password);
    }

    try {
      const updatedUser = await this.userRepository.update(
        id,
        updateUserDto,
        tenantId,
      );
      return this.excludePassword(updatedUser);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(
        `Failed to update user: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  }

  /**
   * Delete a user
   * @throws NotFoundException if user not found
   */
  async remove(id: string, tenantId?: string): Promise<void> {
    // Verify user exists
    await this.findOne(id, tenantId);

    await this.userRepository.delete(id);
  }

  /**
   * Hash a password using bcrypt
   * @private
   */
  private async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  /**
   * Exclude password from user object
   * @private
   */
  private excludePassword(user: User): UserResponse {
    // Destructure and rename to avoid unused variable warning
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithoutPassword } = user as User & {
      password: string;
    };
    return userWithoutPassword;
  }
}
