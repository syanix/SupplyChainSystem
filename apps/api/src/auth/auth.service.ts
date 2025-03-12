import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UsersService } from "../users/users.service";
import { TenantsService } from "../tenants/tenants.service";
import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";
import { JwtPayload } from "./interfaces/jwt-payload.interface";
import * as bcrypt from "bcrypt";

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly tenantsService: TenantsService,
  ) {}

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    // Find user by email
    const user = await this.usersService.findByEmail(email);

    if (!user) {
      throw new UnauthorizedException("Invalid credentials");
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password || "");

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
      role: "STAFF",
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

  async validateUser(payload: JwtPayload) {
    return this.usersService.findOne(payload.sub);
  }
}
