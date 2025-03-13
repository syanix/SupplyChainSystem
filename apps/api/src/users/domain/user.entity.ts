import { User as PrismaUser, UserRole } from "@supply-chain-system/shared";
import * as bcrypt from "bcrypt";

/**
 * User domain entity that encapsulates business logic
 */
export class UserEntity implements Omit<PrismaUser, "password"> {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  tenantId: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;

  // Password is private to prevent accidental exposure
  private _password: string;

  constructor(user: PrismaUser) {
    this.id = user.id;
    this.email = user.email;
    this.name = user.name;
    this.role = user.role as UserRole;
    this.tenantId = user.tenantId;
    this.isActive = user.isActive;
    this.createdAt = user.createdAt;
    this.updatedAt = user.updatedAt;
    this._password = user.password;
  }

  /**
   * Factory method to create a new user
   */
  static async create(data: {
    email: string;
    name: string;
    password: string;
    role: UserRole;
    tenantId: string;
    isActive?: boolean;
  }): Promise<UserEntity> {
    const hashedPassword = await bcrypt.hash(data.password, 10);

    return new UserEntity({
      id: "", // Will be set by the database
      email: data.email,
      name: data.name,
      password: hashedPassword,
      role: data.role,
      tenantId: data.tenantId,
      isActive: data.isActive ?? true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  /**
   * Check if the provided password matches the user's password
   */
  async validatePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this._password);
  }

  /**
   * Change the user's password
   */
  async changePassword(
    currentPassword: string,
    newPassword: string,
  ): Promise<boolean> {
    // Verify current password
    const isValid = await this.validatePassword(currentPassword);
    if (!isValid) {
      return false;
    }

    // Hash and set new password
    this._password = await bcrypt.hash(newPassword, 10);
    this.updatedAt = new Date();
    return true;
  }

  /**
   * Deactivate the user
   */
  deactivate(): void {
    this.isActive = false;
    this.updatedAt = new Date();
  }

  /**
   * Activate the user
   */
  activate(): void {
    this.isActive = true;
    this.updatedAt = new Date();
  }

  /**
   * Change the user's role
   */
  changeRole(newRole: UserRole): void {
    this.role = newRole;
    this.updatedAt = new Date();
  }

  /**
   * Convert to a plain object for persistence
   * @internal Used by repositories
   */
  toObject(): PrismaUser {
    return {
      id: this.id,
      email: this.email,
      name: this.name,
      password: this._password,
      role: this.role,
      tenantId: this.tenantId,
      isActive: this.isActive,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
