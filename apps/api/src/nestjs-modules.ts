// Re-export NestJS modules to ensure consistent versions
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { ThrottlerModule } from "@nestjs/throttler";

export {
  ConfigModule,
  ConfigService,
  JwtModule,
  PassportModule,
  ThrottlerModule,
};
