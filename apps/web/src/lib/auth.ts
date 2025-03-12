import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { UserRole, Tenant } from '@supply-chain-system/shared';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          console.log('Authorize - Credentials:', { email: credentials.email, password: '***' });

          // Call the API to authenticate the user
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          });

          if (!response.ok) {
            console.log('Authorize - API response not OK:', response.status, response.statusText);
            return null;
          }

          const data = await response.json();
          console.log('Authorize - API response data:', data);
          console.log('Authorize - User name from API:', data.user.name);
          console.log('Authorize - User role from API:', data.user.role);

          // Return user data exactly as received from API
          return {
            id: data.user.id,
            email: data.user.email,
            name: data.user.name,
            role: data.user.role,
            tenantId: data.user.tenantId,
            tenant: data.tenant,
            accessToken: data.accessToken,
          };
        } catch (error) {
          console.error('Authentication error:', error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      console.log('JWT Callback - User:', user);
      console.log('JWT Callback - Token before:', token);

      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        console.log('JWT Callback - Setting name to:', user.name);
        token.role = user.role;
        token.tenantId = user.tenantId;
        token.tenant = user.tenant;
        token.accessToken = user.accessToken;
      }

      // Extract role from JWT token if not already set
      if (token.accessToken && !token.role) {
        try {
          // Parse the JWT payload (without verification)
          const base64Payload = token.accessToken.split('.')[1];
          const payload = JSON.parse(Buffer.from(base64Payload, 'base64').toString());
          console.log('JWT Payload:', payload);

          // Extract role from roles array
          if (payload.roles && payload.roles.length > 0) {
            // Convert role format: 'super_admin' -> 'SUPER_ADMIN'
            const role = payload.roles[0].toUpperCase();
            token.role = role;
            console.log('Extracted role from JWT:', role);
          }
        } catch (error) {
          console.error('Error parsing JWT:', error);
        }
      }

      console.log('JWT Callback - Token after:', token);
      return token;
    },
    async session({ session, token }) {
      console.log('Session Callback - Token:', token);
      console.log('Session Callback - Session before:', session);

      if (token) {
        session.user = {
          id: token.id as string,
          email: token.email as string,
          name: token.name as string,
          role: token.role as UserRole,
          tenantId: token.tenantId as string,
        };
        console.log('Session Callback - Setting user name to:', session.user.name);
        session.tenant = (token.tenant || {}) as Tenant;
        session.accessToken = token.accessToken as string;
      }

      console.log('Session Callback - Session after:', session);
      return session;
    },
  },
  session: {
    strategy: 'jwt' as const,
  },
  pages: {
    signIn: '/auth/login',
    error: '/auth/error',
  },
};
