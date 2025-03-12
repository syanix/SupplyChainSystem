import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { ConfigService } from "@nestjs/config";
import { AuthService } from "../auth.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get("JWT_SECRET"),
    });
  }

  async validate(payload: any) {
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
      roles: payload.roles,
      role: mainRole, // Add single role property for backward compatibility
      tenantId: payload.tenantId,
      tenantName: payload.tenantName,
    };
  }
}
