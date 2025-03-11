import { Injectable, NestMiddleware } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";
import { ConfigService } from "@nestjs/config";

// Extend the Express Request interface using module augmentation
declare module "express" {
  interface Request {
    tenantId?: string;
  }
}

@Injectable()
export class TenantMiddleware implements NestMiddleware {
  constructor(private configService: ConfigService) {}

  use(req: Request, res: Response, next: NextFunction) {
    // Get tenant from header, query, or subdomain
    let tenantId = req.headers["x-tenant-id"] as string;

    if (!tenantId && req.query.tenantId) {
      tenantId = req.query.tenantId as string;
    }

    if (!tenantId) {
      // Extract from subdomain if needed
      const host = req.headers.host;
      if (host && host.includes(".")) {
        const subdomain = host.split(".")[0];
        if (subdomain !== "www" && subdomain !== "api") {
          // You might want to validate or map this subdomain to a tenant ID
          tenantId = subdomain;
        }
      }
    }

    if (tenantId) {
      req.tenantId = tenantId;
    }

    next();
  }
}
