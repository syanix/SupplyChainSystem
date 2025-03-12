# Deployment Guide

This guide provides detailed instructions for deploying the Supply Chain Management System to various environments.

## Overview

The Supply Chain Management System is a monorepo consisting of multiple applications:

1. **Frontend (Next.js)**: Deployed to Vercel
2. **Backend (NestJS)**: Deployed to Fly.io (with future AWS migration path)
3. **Database (PostgreSQL)**: Hosted on Supabase

## Prerequisites

- Node.js 18.x or higher
- npm 10.x or higher
- Git
- Vercel CLI (for frontend deployment)
- Fly.io CLI (for backend deployment)
- Supabase account (for database)
- Cloudflare R2 account (for file storage)

## Environment Setup

### Environment Variables

Create the following `.env` files:

1. **Root `.env`**:

   ```
   # General
   NODE_ENV=development

   # Database
   DATABASE_URL=postgresql://postgres:postgres@localhost:5432/supply_chain

   # Auth
   NEXTAUTH_SECRET=your-nextauth-secret
   NEXTAUTH_URL=http://localhost:3000

   # API
   NEXT_PUBLIC_API_URL=http://localhost:4000
   ```

2. **Frontend `.env` (apps/web/.env)**:

   ```
   # Auth
   NEXTAUTH_SECRET=your-nextauth-secret
   NEXTAUTH_URL=http://localhost:3000

   # API
   NEXT_PUBLIC_API_URL=http://localhost:4000
   ```

3. **Backend `.env` (apps/api/.env)**:

   ```
   # Database
   DATABASE_URL=postgresql://postgres:postgres@localhost:5432/supply_chain

   # Auth
   JWT_SECRET=your-jwt-secret

   # Email
   RESEND_API_KEY=your-resend-api-key

   # Storage
   CLOUDFLARE_ACCOUNT_ID=your-cloudflare-account-id
   CLOUDFLARE_ACCESS_KEY_ID=your-cloudflare-access-key-id
   CLOUDFLARE_SECRET_ACCESS_KEY=your-cloudflare-secret-access-key
   CLOUDFLARE_R2_BUCKET=your-cloudflare-r2-bucket
   ```

## Local Development

To run the application locally:

```bash
# Install dependencies
npm install

# Start the database
docker-compose up -d postgres

# Run migrations
cd packages/database
npx prisma migrate dev
cd ../..

# Start the development server
npm run dev
```

## Production Deployment

### Frontend Deployment (Vercel)

1. **Install Vercel CLI**:

   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**:

   ```bash
   vercel login
   ```

3. **Deploy the frontend**:

   ```bash
   cd apps/web
   vercel
   ```

4. **Set environment variables on Vercel**:
   - Go to the Vercel dashboard
   - Navigate to your project
   - Go to Settings > Environment Variables
   - Add all required environment variables

### Backend Deployment (Fly.io)

1. **Install Fly.io CLI**:

   ```bash
   curl -L https://fly.io/install.sh | sh
   ```

2. **Login to Fly.io**:

   ```bash
   fly auth login
   ```

3. **Create a Fly.io app**:

   ```bash
   cd apps/api
   fly launch
   ```

4. **Set environment variables on Fly.io**:

   ```bash
   fly secrets set DATABASE_URL="postgresql://postgres:postgres@your-supabase-host:5432/supply_chain"
   fly secrets set JWT_SECRET="your-jwt-secret"
   fly secrets set RESEND_API_KEY="your-resend-api-key"
   fly secrets set CLOUDFLARE_ACCOUNT_ID="your-cloudflare-account-id"
   fly secrets set CLOUDFLARE_ACCESS_KEY_ID="your-cloudflare-access-key-id"
   fly secrets set CLOUDFLARE_SECRET_ACCESS_KEY="your-cloudflare-secret-access-key"
   fly secrets set CLOUDFLARE_R2_BUCKET="your-cloudflare-r2-bucket"
   ```

5. **Deploy the backend**:
   ```bash
   fly deploy
   ```

### Database Setup (Supabase)

1. **Create a Supabase project**:

   - Go to [Supabase](https://supabase.com/)
   - Create a new project
   - Note the connection details

2. **Run migrations on Supabase**:

   ```bash
   cd packages/database
   DATABASE_URL="postgresql://postgres:your-password@your-supabase-host:5432/postgres" npx prisma migrate deploy
   ```

3. **Set up Row-Level Security (RLS)**:
   - Enable RLS on all tables
   - Create policies for tenant isolation

### File Storage Setup (Cloudflare R2)

1. **Create a Cloudflare R2 bucket**:

   - Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
   - Navigate to R2
   - Create a new bucket

2. **Create API tokens**:
   - Generate Access Key ID and Secret Access Key
   - Note these credentials for environment variables

## Multi-Environment Setup

For a complete multi-environment setup (development, staging, production):

### Environment-Specific Configuration

1. **Create environment-specific branches**:

   - `main` (production)
   - `staging`
   - `development`

2. **Set up environment-specific deployments**:

   - Vercel: Create separate deployments for each environment
   - Fly.io: Create separate apps for each environment
   - Supabase: Create separate projects for each environment

3. **Environment-specific environment variables**:
   - Use different values for each environment
   - Ensure proper isolation between environments

## Database Migration Strategy

When deploying to Supabase, you have several options for managing database migrations:

### Option 1: Using Supabase SQL Editor

1. Go to the SQL Editor in your Supabase dashboard
2. Upload and execute your migration scripts manually
3. Keep a record of executed migrations

### Option 2: Using TypeORM Migrations

1. Configure your TypeORM connection to use the Supabase connection string
2. Run migrations as part of your deployment process:
   ```bash
   cd apps/api
   npm run migration:run
   ```

### Option 3: Using Database CI/CD

1. Set up a GitHub Action to run migrations automatically
2. Example workflow step:
   ```yaml
   - name: Run Database Migrations
     run: |
       cd apps/api
       npm run migration:run
     env:
       DATABASE_URL: ${{ secrets.SUPABASE_DATABASE_URL }}
   ```

### Best Practices

- Always backup your database before running migrations
- Test migrations in a staging environment first
- Use transaction blocks in your migrations for atomicity
- Include both "up" and "down" migration scripts for rollback capability

## Health Checks and Monitoring

### API Health Checks

1. Implement a health check endpoint in your NestJS API:

   ```typescript
   // apps/api/src/health/health.controller.ts
   @Controller("health")
   export class HealthController {
     @Get()
     check() {
       return { status: "ok", timestamp: new Date().toISOString() };
     }
   }
   ```

2. Configure Fly.io to use this endpoint for health checks:

   ```toml
   # fly.toml
   [http_service]
     internal_port = 3001
     force_https = true

     [[http_service.checks]]
       interval = "10s"
       timeout = "2s"
       grace_period = "5s"
       method = "get"
       path = "/health"
       protocol = "http"
   ```

### Frontend Performance Monitoring

1. Implement Web Vitals reporting in your Next.js app:

   ```typescript
   // apps/web/src/pages/_app.tsx
   export function reportWebVitals(metric) {
     console.log(metric);
     // Send to your analytics service
   }
   ```

2. Set up Vercel Analytics for comprehensive monitoring

### Database Performance Monitoring

1. Enable Supabase Database Insights
2. Set up alerts for:
   - High CPU usage (>80%)
   - Low disk space (<20%)
   - Slow query performance (>1s)
   - Connection pool saturation (>80%)

## Security Considerations

### API Security

1. **Rate Limiting**: Configure rate limiting to prevent abuse:

   ```typescript
   // apps/api/src/main.ts
   import { ThrottlerGuard, ThrottlerModule } from "@nestjs/throttler";

   app.useGlobalGuards(app.get(ThrottlerGuard));
   ```

2. **CORS Configuration**: Restrict CORS to only your frontend domains:

   ```typescript
   // apps/api/src/main.ts
   app.enableCors({
     origin: [
       "https://your-production-domain.com",
       "https://your-staging-domain.vercel.app",
     ],
     credentials: true,
   });
   ```

3. **Helmet Security Headers**: Add security headers:

   ```typescript
   // apps/api/src/main.ts
   import helmet from "helmet";

   app.use(helmet());
   ```

### Database Security

1. **Row-Level Security (RLS)**: Configure RLS policies in Supabase:

   ```sql
   -- Example RLS policy for multi-tenant isolation
   CREATE POLICY tenant_isolation_policy ON "public"."users"
     USING (tenant_id = current_setting('app.current_tenant_id')::uuid);
   ```

2. **Database User Permissions**: Create separate database users with limited permissions for your API

3. **Encrypt Sensitive Data**: Use column-level encryption for sensitive data:

   ```sql
   -- Example of encrypting sensitive data
   CREATE EXTENSION IF NOT EXISTS pgcrypto;

   -- When inserting
   INSERT INTO users (encrypted_field) VALUES (pgp_sym_encrypt('sensitive data', 'encryption_key'));

   -- When selecting
   SELECT pgp_sym_decrypt(encrypted_field::bytea, 'encryption_key') FROM users;
   ```

### Frontend Security

1. **Content Security Policy**: Configure CSP in Next.js:

   ```typescript
   // apps/web/next.config.js
   const securityHeaders = [
     {
       key: "Content-Security-Policy",
       value:
         "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline';",
     },
   ];

   module.exports = {
     async headers() {
       return [
         {
           source: "/:path*",
           headers: securityHeaders,
         },
       ];
     },
   };
   ```

2. **Authentication Security**: Ensure secure authentication practices:
   - Use HTTPS only
   - Implement proper token storage
   - Set secure and HttpOnly cookies

## Disaster Recovery Plan

### Backup Strategy

1. **Database Backups**:

   - Automated daily backups via Supabase
   - Weekly manual backups stored in a separate location
   - Test restoration process quarterly

2. **Code and Configuration Backups**:

   - All code stored in version control (GitHub)
   - Environment variables backed up securely (consider using a service like Doppler)

3. **File Storage Backups**:
   - Regular backups of Cloudflare R2 data
   - Cross-region replication for critical files

### Recovery Procedures

1. **Database Recovery**:

   ```bash
   # Restore from Supabase backup
   pg_restore -U postgres -h your-supabase-host -d postgres backup.dump

   # Or restore from SQL backup
   psql -U postgres -h your-supabase-host -d postgres < backup.sql
   ```

2. **API Recovery**:

   - Deploy from last stable Git tag
   - Restore environment variables
   - Verify connectivity to database and other services

3. **Frontend Recovery**:
   - Deploy from last stable Git tag
   - Restore environment variables
   - Verify connectivity to API

### Failover Strategy

1. **Database Failover**:

   - Consider setting up a read replica in Supabase
   - Document manual failover process

2. **API Failover**:

   - Deploy to multiple regions in Fly.io
   - Configure load balancing between regions

3. **Frontend Failover**:
   - Vercel automatically handles CDN failover
   - Consider multi-region deployment for critical applications

## Monitoring and Logging

### Vercel Analytics

Enable Vercel Analytics for frontend monitoring:

- Go to Vercel Dashboard > Project > Analytics
- Enable Analytics

### Fly.io Monitoring

Enable Fly.io monitoring for backend:

- Go to Fly.io Dashboard > App > Metrics
- Set up alerts for critical metrics

### Database Monitoring

Set up Supabase monitoring:

- Enable database metrics
- Set up alerts for high CPU/memory usage

## Backup Strategy

### Database Backups

1. **Automated Supabase backups**:

   - Enabled by default on Supabase
   - Configure retention period

2. **Manual backups**:
   ```bash
   pg_dump -U postgres -h your-supabase-host -d postgres > backup.sql
   ```

### File Storage Backups

Set up regular backups of Cloudflare R2 data:

- Use Cloudflare Workers to schedule backups
- Store backups in a separate bucket

## Scaling Considerations

### Frontend Scaling

- Vercel automatically scales based on traffic
- Use ISR (Incremental Static Regeneration) for optimal performance

### Backend Scaling

- Configure Fly.io scaling rules:
  ```bash
  fly scale count 2
  ```
- Set up auto-scaling based on CPU/memory usage

### Database Scaling

- Monitor database performance
- Upgrade Supabase plan as needed
- Consider read replicas for high-traffic scenarios

## Troubleshooting

### Common Deployment Issues

1. **Environment variable issues**:

   - Verify all environment variables are set correctly
   - Check for typos in variable names

2. **Build failures**:

   - Check build logs for errors
   - Ensure all dependencies are installed

3. **Database connection issues**:
   - Verify connection string is correct
   - Check network access rules

### Support Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Fly.io Documentation](https://fly.io/docs/)
- [Supabase Documentation](https://supabase.com/docs)
- [Cloudflare R2 Documentation](https://developers.cloudflare.com/r2/)
