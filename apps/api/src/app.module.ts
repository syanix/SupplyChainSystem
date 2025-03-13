import { Module, MiddlewareConsumer, RequestMethod } from "@nestjs/common";
import { TenantMiddleware } from "./common/middleware/tenant.middleware";
import { AuthModule } from "./auth/auth.module";
import { UsersModule } from "./users/users.module";
import { OrdersModule } from "./orders/orders.module";
import { SuppliersModule } from "./suppliers/suppliers.module";
import { ProductsModule } from "./products/products.module";
import { TenantsModule } from "./tenants/tenants.module";
import { ConfigModule, ConfigService, ThrottlerModule } from "./nestjs-modules";
import { AdminModule } from "./admin/admin.module";
import { AppController } from "./app.controller";
import { PrismaModule } from "./prisma/prisma.module";

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    // Database - Prisma
    PrismaModule,

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
    AdminModule,
  ],
  controllers: [AppController],
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
        { path: "health", method: RequestMethod.GET },
      )
      .forRoutes("*");
  }
}
