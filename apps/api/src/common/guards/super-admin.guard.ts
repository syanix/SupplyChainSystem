import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";

@Injectable()
export class SuperAdminGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException("User not found in request");
    }

    // Check if user has SUPER_ADMIN role
    // First check if roles array exists
    if (user.roles && Array.isArray(user.roles)) {
      // Check if SUPER_ADMIN is in the roles array (case insensitive)
      const isSuperAdmin = user.roles.some(
        (role) =>
          typeof role === "string" && role.toUpperCase() === "SUPER_ADMIN",
      );

      if (!isSuperAdmin) {
        throw new ForbiddenException(
          "Only Super Admins can access this resource",
        );
      }
    }
    // Fallback to single role property if roles array doesn't exist
    else if (user.role !== "SUPER_ADMIN") {
      throw new ForbiddenException(
        "Only Super Admins can access this resource",
      );
    }

    return true;
  }
}
