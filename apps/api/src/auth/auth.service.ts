import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
  NotFoundException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UsersService } from "../users/users.service";
import { TenantsService } from "../tenants/tenants.service";
import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";
import { JwtPayload } from "./interfaces/jwt-payload.interface";
import * as bcrypt from "bcrypt";
import { UserRole, User } from "@supply-chain-system/shared";

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly tenantsService: TenantsService,
  ) {}

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    // Find user by email with password
    const user = await this.usersService.getUserWithPasswordByEmail(email);

    if (!user) {
      throw new UnauthorizedException("Invalid credentials");
    }

    // Verify password - use type assertion to access password
    const isPasswordValid = await bcrypt.compare(
      password,
      (user as User & { password: string }).password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException("Invalid credentials");
    }

    // Get tenant information
    const userTenantId = user?.tenantId || "";
    if (!userTenantId) {
      throw new UnauthorizedException("User has no associated tenant");
    }

    const tenant = await this.tenantsService.findOne(userTenantId || "");

    // Generate JWT token
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      roles: [user.role.toLowerCase()],
      tenantId: userTenantId,
      tenantName: tenant?.name || "Unknown",
    };

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        tenantId: userTenantId,
      },
      tenant: {
        id: tenant?.id,
        name: tenant?.name,
        slug: tenant?.slug,
      },
      accessToken: this.jwtService.sign(payload),
    };
  }

  async register(registerDto: RegisterDto) {
    const { email, password, firstName, lastName, tenantId, companyName } =
      registerDto;

    // Check if user already exists
    const existingUser = await this.usersService.findByEmail(email);

    if (existingUser) {
      throw new ConflictException("User with this email already exists");
    }

    // Validate tenant
    let userTenantId = tenantId;

    if (!tenantId && companyName) {
      // Create new tenant if tenant ID is not provided but company name is
      const newTenant = await this.tenantsService.create({
        name: companyName,
        isActive: true,
      });
      userTenantId = newTenant.id;
    } else if (!tenantId && !companyName) {
      throw new BadRequestException(
        "Either tenant ID or company name must be provided",
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const newUser = await this.usersService.create({
      email,
      password: hashedPassword,
      name: `${firstName} ${lastName}`,
      role: UserRole.STAFF,
      tenantId: userTenantId,
    });

    // Get tenant information
    const tenant = await this.tenantsService.findOne(userTenantId);

    // Generate JWT token
    const payload: JwtPayload = {
      sub: newUser.id,
      email: newUser.email,
      roles: [newUser.role.toLowerCase()],
      tenantId: userTenantId,
      tenantName: tenant?.name || "Unknown",
    };

    return {
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role,
        tenantId: userTenantId,
      },
      tenant: {
        id: tenant?.id,
        name: tenant?.name,
        slug: tenant?.slug,
      },
      accessToken: this.jwtService.sign(payload),
    };
  }

  /**
   * Validate a user with email and password
   * @param email The user's email
   * @param password The user's password
   * @returns The user without password
   */
  async validateUser(
    email: string,
    password: string,
  ): Promise<Omit<User, "password">>;

  /**
   * Validate a user from a JWT payload
   * @param payload The JWT payload
   * @returns The user without password
   */
  async validateUser(
    payload: JwtPayload,
  ): Promise<Omit<User, "password"> | null>;

  /**
   * Implementation of the validateUser method
   */
  async validateUser(
    emailOrPayload: string | JwtPayload,
    password?: string,
  ): Promise<Omit<User, "password"> | null> {
    // If the first parameter is a string, it's an email
    if (typeof emailOrPayload === "string" && password) {
      const email = emailOrPayload;
      const user = await this.usersService.getUserWithPasswordByEmail(email);

      if (!user) {
        throw new UnauthorizedException("Invalid credentials");
      }

      // Check if user is active
      if (user.isActive === false) {
        throw new UnauthorizedException("User is inactive");
      }

      const isPasswordValid = await bcrypt.compare(
        password,
        (user as User & { password: string }).password,
      );

      if (!isPasswordValid) {
        throw new UnauthorizedException("Invalid credentials");
      }

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password: _password, ...result } = user as User & {
        password: string;
      };
      return result;
    }
    // If the first parameter is an object, it's a JWT payload
    else if (typeof emailOrPayload === "object") {
      const payload = emailOrPayload;
      // Find user by ID from the JWT payload
      try {
        const user = await this.usersService.findOne(payload.sub);

        // Check if user is active
        if (user.isActive === false) {
          return null;
        }

        return user;
      } catch (error) {
        // If user not found, return null
        if (error instanceof NotFoundException) {
          return null;
        }
        throw error;
      }
    }

    return null;
  }
}
