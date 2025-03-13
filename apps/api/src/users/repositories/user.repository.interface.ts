import { User, UserRole } from "@supply-chain-system/shared";

export interface IUserRepository {
  findAll(tenantId?: string): Promise<User[]>;

  findByFilters(filters: {
    role?: UserRole;
    isActive?: boolean;
    tenantId?: string;
  }): Promise<User[]>;

  findById(id: string, tenantId?: string): Promise<User | null>;

  findByIdWithTenant(id: string): Promise<User | null>;

  findByEmail(email: string): Promise<User | null>;

  create(data: {
    email: string;
    name: string;
    password: string;
    role: UserRole;
    isActive?: boolean;
    tenantId?: string;
  }): Promise<User>;

  update(
    id: string,
    data: Partial<{
      email: string;
      name: string;
      password: string;
      role: UserRole;
      isActive: boolean;
      tenantId: string;
    }>,
    filterTenantId?: string,
  ): Promise<User>;

  delete(id: string): Promise<User>;
}

export const USER_REPOSITORY = "USER_REPOSITORY";
