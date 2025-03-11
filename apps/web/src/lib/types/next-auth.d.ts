import { DefaultSession } from 'next-auth';
import { UserRole, Tenant } from 'shared';

declare module 'next-auth' {
  interface Session extends DefaultSession {
    user: {
      id: string;
      email: string;
      name: string;
      role: UserRole;
      tenantId: string;
    };
    tenant: Tenant;
    accessToken: string;
  }

  interface User {
    id: string;
    email: string;
    name: string;
    role: UserRole;
    tenantId: string;
    tenant?: Tenant;
    accessToken: string;
  }
}
