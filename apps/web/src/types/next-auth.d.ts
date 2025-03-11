import { UserRole } from 'shared';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      name?: string;
      role: UserRole;
      tenantId: string;
    };
    tenant?: {
      id: string;
      name: string;
      slug: string;
    };
    accessToken: string;
  }

  interface User {
    id: string;
    email: string;
    name?: string;
    role: UserRole;
    tenantId: string;
    tenant?: {
      id: string;
      name: string;
      slug: string;
    };
    accessToken: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    email: string;
    name?: string;
    role: UserRole;
    tenantId: string;
    tenant?: {
      id: string;
      name: string;
      slug: string;
    };
    accessToken: string;
  }
}
