# ADR 002: Authentication Strategy

## Status

Accepted

## Context

The Supply Chain Management System requires a secure, scalable, and user-friendly authentication system. We need to decide on the most appropriate authentication strategy that meets our security requirements while providing a good user experience.

## Decision

We will implement a **JWT-based authentication system with NextAuth.js** for the frontend and a custom JWT implementation for the backend API with the following characteristics:

1. **Frontend Authentication (NextAuth.js)**:

   - NextAuth.js will handle the authentication flow in the Next.js application
   - JWT tokens will be stored in HTTP-only cookies for security
   - Session management will be handled by NextAuth.js

2. **Backend Authentication (NestJS)**:

   - Custom JWT implementation using NestJS JWT module
   - Token validation middleware for all protected routes
   - Role-based access control (RBAC) for authorization

3. **Token Structure**:

   - User ID
   - User email
   - User role
   - Tenant ID
   - Token expiration (short-lived, 15 minutes)

4. **Token Refresh Strategy**:
   - Refresh tokens with longer expiration (7 days)
   - Secure storage of refresh tokens
   - Token rotation on refresh for security

## Alternatives Considered

1. **Session-Based Authentication**:

   - Pros: Simpler to implement, easier to revoke
   - Cons: Requires server-side storage, less scalable, CSRF vulnerabilities

2. **OAuth 2.0 with Identity Provider (e.g., Auth0, Okta)**:

   - Pros: Delegated authentication, strong security, social logins
   - Cons: External dependency, potential costs, more complex integration

3. **JWT-Based Authentication (our chosen approach)**:
   - Pros: Stateless, scalable, works well with microservices
   - Cons: Token revocation challenges, token size limitations

## Consequences

### Positive

- Stateless authentication that scales well with distributed systems
- No need for server-side session storage
- Simplified cross-domain authentication
- Good integration with Next.js and NestJS frameworks
- Clear separation of authentication and authorization concerns

### Negative

- More complex token management (refresh, expiration)
- Challenges with immediate token revocation
- Potential security risks if not implemented correctly
- JWT size limitations for storing user data

## Implementation Details

### NextAuth.js Configuration

```typescript
// apps/web/src/app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // Call API to validate credentials
        const response = await fetch(`${process.env.API_URL}/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(credentials),
        });

        const data = await response.json();

        if (response.ok && data.user) {
          return {
            id: data.user.id,
            email: data.user.email,
            name: data.user.name,
            role: data.user.role,
            tenantId: data.user.tenantId,
            accessToken: data.accessToken,
          };
        }

        return null;
      },
    }),
  ],
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.role = user.role;
        token.tenantId = user.tenantId;
        token.accessToken = user.accessToken;
      }
      return token;
    },
    session: async ({ session, token }) => {
      session.user.id = token.id;
      session.user.email = token.email;
      session.user.name = token.name;
      session.user.role = token.role;
      session.user.tenantId = token.tenantId;
      session.accessToken = token.accessToken;
      return session;
    },
  },
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
```

### NestJS JWT Implementation

```typescript
// apps/api/src/auth/auth.module.ts
import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { JwtStrategy } from "./jwt.strategy";

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: process.env.JWT_SECRET,
        signOptions: { expiresIn: "15m" },
      }),
    }),
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
```

### JWT Strategy

```typescript
// apps/api/src/auth/jwt.strategy.ts
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { UsersService } from "../users/users.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: any) {
    const user = await this.usersService.findOne(payload.sub, payload.tenantId);

    if (!user) {
      throw new UnauthorizedException();
    }

    return {
      id: payload.sub,
      email: payload.email,
      role: payload.role,
      tenantId: payload.tenantId,
    };
  }
}
```

### Authentication Guard

```typescript
// apps/api/src/auth/jwt-auth.guard.ts
import { Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class JwtAuthGuard extends AuthGuard("jwt") {}
```

## Security Considerations

- JWT tokens will be stored in HTTP-only cookies to prevent XSS attacks
- CSRF protection will be implemented for all state-changing operations
- Token expiration will be kept short (15 minutes) to minimize the impact of token theft
- Refresh tokens will be rotated on each use to prevent replay attacks
- All authentication endpoints will be rate-limited to prevent brute force attacks
- Password storage will use bcrypt with appropriate work factor
- HTTPS will be enforced for all communications

## References

- [NextAuth.js Documentation](https://next-auth.js.org/)
- [NestJS Authentication Documentation](https://docs.nestjs.com/security/authentication)
- [JWT Best Practices (IETF)](https://datatracker.ietf.org/doc/html/draft-ietf-oauth-jwt-bcp-07)
- [OWASP Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)
