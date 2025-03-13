/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { User, UserRole } from "@supply-chain-system/shared";
import { IUserRepository } from "./user.repository.interface";
import { CreateUserDto } from "../dto/create-user.dto";
import { UpdateUserDto } from "../dto/update-user.dto";
/* eslint-enable @typescript-eslint/no-unused-vars */

// Define a type for Prisma user
type PrismaUser = {
  id: string;
  email: string;
  name: string;
  password: string;
  role: string;
  tenantId?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  [key: string]: unknown;
};

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(private prisma: PrismaService) {}

  // Helper method to map Prisma user to shared User type
  private mapPrismaUserToSharedUser(prismaUser: PrismaUser): User {
    // Explicitly map the Prisma user to the shared User type
    return {
      ...prismaUser,
      role: prismaUser.role as UserRole,
      // Ensure tenantId is a string (empty string if undefined)
      tenantId: prismaUser.tenantId || "",
    };
  }

  async findAll(tenantId?: string): Promise<User[]> {
    const users = await this.prisma.client.user.findMany({
      where: tenantId ? { tenantId } : {},
      orderBy: { name: "asc" },
    });

    return users.map(this.mapPrismaUserToSharedUser);
  }

  async findByFilters(filters: {
    role?: UserRole;
    isActive?: boolean;
    tenantId?: string;
  }): Promise<User[]> {
    const users = await this.prisma.client.user.findMany({
      where: {
        ...(filters.role && { role: filters.role }),
        ...(filters.isActive !== undefined && { isActive: filters.isActive }),
        ...(filters.tenantId && { tenantId: filters.tenantId }),
      },
      orderBy: { name: "asc" },
    });

    return users.map(this.mapPrismaUserToSharedUser);
  }

  async findById(id: string, tenantId?: string): Promise<User | null> {
    const user = await this.prisma.client.user.findUnique({
      where: {
        id,
        ...(tenantId && { tenantId }),
      },
    });

    return user ? this.mapPrismaUserToSharedUser(user) : null;
  }

  async findByIdWithTenant(id: string): Promise<User | null> {
    const user = await this.prisma.client.user.findUnique({
      where: { id },
      include: { tenant: true },
    });

    return user ? this.mapPrismaUserToSharedUser(user) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.client.user.findUnique({
      where: { email },
    });

    return user ? this.mapPrismaUserToSharedUser(user) : null;
  }

  async create(data: {
    email: string;
    name: string;
    password: string;
    role: UserRole;
    isActive?: boolean;
    tenantId?: string;
  }): Promise<User> {
    const { tenantId, ...userData } = data;

    const user = await this.prisma.client.user.create({
      data: {
        ...userData,
        ...(tenantId && {
          tenant: {
            connect: { id: tenantId },
          },
        }),
      },
    });

    return this.mapPrismaUserToSharedUser(user);
  }

  async update(
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
  ): Promise<User> {
    const { tenantId, ...updateData } = data;

    // First check if the user exists with the given tenantId filter
    if (filterTenantId) {
      const existingUser = await this.findById(id, filterTenantId);
      if (!existingUser) {
        throw new NotFoundException(
          `User with ID ${id} not found in tenant ${filterTenantId}`,
        );
      }
    }

    const user = await this.prisma.client.user.update({
      where: {
        id,
        ...(filterTenantId && { tenantId: filterTenantId }),
      },
      data: {
        ...updateData,
        ...(tenantId && {
          tenant: {
            connect: { id: tenantId },
          },
        }),
      },
    });

    return this.mapPrismaUserToSharedUser(user);
  }

  async delete(id: string): Promise<User> {
    const user = await this.prisma.client.user.delete({
      where: { id },
    });

    return this.mapPrismaUserToSharedUser(user);
  }
}
