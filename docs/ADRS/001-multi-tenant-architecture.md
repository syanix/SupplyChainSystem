# ADR 001: Multi-Tenant Architecture

## Status

Accepted

## Context

The Supply Chain Management System is designed as a SaaS platform that will serve multiple businesses. We need to decide on the most appropriate multi-tenant architecture that balances security, performance, scalability, and development complexity.

## Decision

We will implement a **shared database with tenant isolation** approach for our multi-tenant architecture with the following characteristics:

1. **Database Level Isolation**:

   - All tables will include a `tenant_id` column
   - PostgreSQL Row-Level Security (RLS) policies will enforce tenant isolation
   - Database functions will validate tenant context

2. **Application Level Isolation**:

   - JWT tokens will include tenant information
   - Middleware will validate tenant access for each request
   - Services will filter data by tenant ID

3. **Frontend Isolation**:
   - User context will include tenant information
   - UI will display only tenant-specific data
   - Routes will be protected based on tenant access

## Alternatives Considered

1. **Separate Database per Tenant**:

   - Pros: Strongest isolation, easier compliance for regulated industries
   - Cons: Higher operational complexity, higher costs, more difficult to maintain

2. **Separate Schema per Tenant**:

   - Pros: Good isolation, easier to backup/restore individual tenants
   - Cons: Limited by database schema limits, more complex migrations

3. **Shared Database with Shared Schema (our chosen approach)**:
   - Pros: Simplest to implement and maintain, most cost-effective, easiest to scale
   - Cons: Requires careful implementation of isolation, potential for data leakage if not properly implemented

## Consequences

### Positive

- Lower infrastructure costs by sharing database resources across tenants
- Simplified database schema management and migrations
- Easier implementation of cross-tenant features (e.g., analytics, admin functions)
- More efficient use of database connections and resources

### Negative

- Increased risk of data leakage if isolation is not properly implemented
- More complex application code to enforce tenant isolation
- Potential performance impact from RLS policies
- May require additional compliance measures for highly regulated industries

## Implementation Details

### Database Schema

All tables that contain tenant-specific data will include a `tenant_id` column with a foreign key reference to the tenants table:

```sql
CREATE TABLE tenants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  email VARCHAR(255) NOT NULL,
  name VARCHAR(255),
  role VARCHAR(50) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(tenant_id, email)
);
```

### Row-Level Security

RLS policies will be applied to all tenant-specific tables:

```sql
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY tenant_isolation_policy ON users
  USING (tenant_id = current_setting('app.current_tenant_id')::UUID);
```

### Application Middleware

A tenant middleware will extract tenant information from the JWT token and set it in the request context:

```typescript
@Injectable()
export class TenantMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const tenantId = req.user?.tenantId;

    if (!tenantId) {
      throw new UnauthorizedException("Tenant ID not found in token");
    }

    req.tenantId = tenantId;
    next();
  }
}
```

### Database Queries

All database queries will include the tenant ID filter:

```typescript
@Injectable()
export class UserRepository {
  constructor(private prisma: PrismaService) {}

  async findAll(tenantId: string): Promise<User[]> {
    return this.prisma.user.findMany({
      where: { tenantId },
    });
  }
}
```

## Compliance and Security Considerations

- Regular security audits will be conducted to ensure tenant isolation is properly maintained
- Penetration testing will specifically target potential tenant isolation bypasses
- Audit logging will track all cross-tenant access attempts
- Database backups will be designed to support individual tenant restoration if needed

## References

- [Multi-Tenant Data Architecture (Microsoft)](https://docs.microsoft.com/en-us/azure/architecture/guide/multitenant/considerations/data-considerations)
- [Row-Level Security in PostgreSQL](https://www.postgresql.org/docs/current/ddl-rowsecurity.html)
- [OWASP Multi-Tenant Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Multitenancy_Security_Cheat_Sheet.html)
