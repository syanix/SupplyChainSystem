import { Module, MiddlewareConsumer, RequestMethod } from "@nestjs/common";
import { TenantMiddleware } from "./common/middleware/tenant.middleware";
import { AuthModule } from "./auth/auth.module";
import { UsersModule } from "./users/users.module";
import { OrdersModule } from "./orders/orders.module";
import { SuppliersModule } from "./suppliers/suppliers.module";
import { ProductsModule } from "./products/products.module";
import { TenantsModule } from "./tenants/tenants.module";
import { DatabaseModule } from "./database/database.module";
import { ConfigModule, ConfigService, ThrottlerModule } from "./nestjs-modules";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AdminModule } from "./admin/admin.module";

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    // Database
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: "postgres",
        url: configService.get("DATABASE_URL"),
        entities: [__dirname + "/**/*.entity{.ts,.js}"],
        synchronize: configService.get("NODE_ENV") !== "production",
        ssl:
          configService.get("NODE_ENV") === "production"
            ? { rejectUnauthorized: false }
            : false,
      }),
    }),

    // Rate limiting
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => [
        {
          ttl: configService.get("THROTTLE_TTL", 60) * 1000,
          limit: configService.get("THROTTLE_LIMIT", 100),
        },
      ],
    }),

    // Feature modules
    AuthModule,
    UsersModule,
    OrdersModule,
    SuppliersModule,
    ProductsModule,
    TenantsModule,
    DatabaseModule,
    AdminModule,
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(TenantMiddleware)
      .exclude(
        { path: "auth/login", method: RequestMethod.POST },
        { path: "auth/register", method: RequestMethod.POST },
        { path: "tenants", method: RequestMethod.POST },
        { path: "admin/(.*)", method: RequestMethod.ALL },
      )
      .forRoutes("*");
  }
}
