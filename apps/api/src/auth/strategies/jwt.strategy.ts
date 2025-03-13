import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { ConfigService } from "@nestjs/config";
import { AuthService } from "../auth.service";
import { JwtPayload } from "../interfaces/jwt-payload.interface";
import { User, UserRole } from "@supply-chain-system/shared";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>("JWT_SECRET"),
    });
  }

  async validate(payload: JwtPayload): Promise<Omit<User, "password">> {
    const user = await this.authService.validateUser(payload);

    if (!user) {
      throw new UnauthorizedException("Invalid token");
    }

    // Get the main role (first one in the array or default to empty string)
    const mainRole =
      Array.isArray(payload.roles) && payload.roles.length > 0
        ? payload.roles[0].toUpperCase()
        : "";

    return {
      id: payload.sub,
      email: payload.email,
      name: user?.name || payload.email,
      role: mainRole as UserRole,
      tenantId: payload.tenantId,
      isActive: user?.isActive !== false,
      createdAt: user?.createdAt || new Date(),
      updatedAt: user?.updatedAt || new Date(),
    };
  }
}
