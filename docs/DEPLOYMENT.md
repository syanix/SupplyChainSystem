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

## CI/CD Setup

### GitHub Actions

Create a `.github/workflows/ci.yml` file:

```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [main, staging, development]
  pull_request:
    branches: [main, staging, development]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm ci
      - run: npm run lint
      - run: npm run test

  deploy-frontend:
    needs: test
    if: github.event_name == 'push'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm ci
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          working-directory: ./apps/web
          vercel-args: '--prod'

  deploy-backend:
    needs: test
    if: github.event_name == 'push'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: superfly/flyctl-actions/setup-flyctl@master
      - run: flyctl deploy --remote-only
        working-directory: ./apps/api
        env:
          FLY_API_TOKEN: ${{ secrets.FLY_API_TOKEN }}
```

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