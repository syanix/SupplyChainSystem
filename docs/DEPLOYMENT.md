# Deployment Guide

This guide provides detailed instructions for deploying the Supply Chain System to various environments.

## Deployment Environments

The system supports the following deployment environments:

- **Development**: Local development environment
- **Staging**: Pre-production environment for testing
- **Production**: Live environment for end users

## Prerequisites

Before deploying, ensure you have:

1. Access to the GitHub repository
2. Access to Fly.io and Vercel accounts
3. Required API tokens and secrets
4. PostgreSQL database credentials for each environment

## Automated Deployments via CI/CD

The project uses GitHub Actions for automated deployments. The CI/CD pipeline is configured to:

1. Run tests on all pull requests
2. Deploy to staging when changes are pushed to the `staging` branch
3. Deploy to production when changes are pushed to the `main` branch

For more details on the CI/CD setup, see the [CI/CD README](../CICD_README.md).

### API Deployment Options

We have two deployment workflows for the API:

1. **Artifact-based Deployment** (Traditional):

   - Uses pre-built artifacts from a previous build workflow
   - Requires a separate build step before deployment
   - Artifacts are downloaded from GitHub Artifacts storage
   - Suitable for scenarios where builds need to be verified before deployment

2. **Direct Build Deployment** (Recommended):
   - Builds the project directly on Fly.io during deployment
   - Uses a multi-stage Dockerfile to build the project and its dependencies
   - No need for separate build workflow or artifact storage
   - Simpler process with fewer steps and dependencies

To use the direct build deployment, trigger the `Deploy API to Fly.io (Direct Build)` workflow from the GitHub Actions UI.

## Manual Deployment

### Backend (NestJS API)

#### Deploying to Fly.io

1. Install the Fly.io CLI:

   ```bash
   curl -L https://fly.io/install.sh | sh
   ```

2. Authenticate with Fly.io:

   ```bash
   fly auth login
   ```

3. Deploy to staging:

   ```bash
   cd apps/api
   fly deploy --config fly.staging.toml
   ```

4. Deploy to production:
   ```bash
   cd apps/api
   fly deploy
   ```

### Frontend (Next.js)

#### Deploying to Vercel

1. Install the Vercel CLI:

   ```bash
   npm install -g vercel
   ```

2. Authenticate with Vercel:

   ```bash
   vercel login
   ```

3. Deploy to staging:

   ```bash
   cd apps/web
   vercel --env NODE_ENV=staging
   ```

4. Deploy to production:
   ```bash
   cd apps/web
   vercel --prod
   ```

## Database Migrations

### Running Migrations Manually

1. Set the appropriate database URL:

   ```bash
   # For staging
   export DATABASE_URL=your_staging_database_url

   # For production
   export DATABASE_URL=your_production_database_url
   ```

2. Run the migrations:
   ```bash
   cd packages/database
   npx prisma migrate deploy
   ```

## Environment Variables

### Required Environment Variables

#### API (NestJS)

- `NODE_ENV`: Environment (`development`, `staging`, or `production`)
- `PORT`: Port number for the API server
- `DATABASE_URL`: PostgreSQL connection string
- `JWT_SECRET`: Secret for JWT token generation
- `CORS_ORIGIN`: Allowed CORS origins
- `CLOUDFLARE_R2_ACCOUNT_ID`: Cloudflare R2 account ID
- `CLOUDFLARE_R2_ACCESS_KEY`: Cloudflare R2 access key
- `CLOUDFLARE_R2_SECRET_KEY`: Cloudflare R2 secret key
- `CLOUDFLARE_R2_BUCKET_NAME`: Cloudflare R2 bucket name
- `RESEND_API_KEY`: Resend API key for email notifications

#### Web (Next.js)

- `NEXT_PUBLIC_API_URL`: URL of the API server
- `NEXTAUTH_URL`: URL for NextAuth.js
- `NEXTAUTH_SECRET`: Secret for NextAuth.js
- `NEXT_PUBLIC_SUPABASE_URL`: Supabase URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase anonymous key

## Health Checks and Monitoring

### API Health Check

The API provides a health check endpoint at `/health` that returns a 200 OK response if the service is healthy.

### Monitoring

The system uses the following monitoring tools:

- **Fly.io Metrics**: For API monitoring
- **Vercel Analytics**: For frontend monitoring
- **Deployment Dashboard**: For deployment status monitoring

## Rollback Procedures

### Automated Rollback

The CI/CD pipeline includes automated rollback for production deployments if the health check fails.

### Manual Rollback

#### API (Fly.io)

```bash
fly deploy --app supply-chain-system-api --image registry.fly.io/supply-chain-system-api:previous_version
```

#### Web (Vercel)

1. Go to the Vercel dashboard
2. Select the project
3. Go to Deployments
4. Find the previous successful deployment
5. Click "..." and select "Promote to Production"

## Troubleshooting

### Common Deployment Issues

1. **Database Connection Errors**:

   - Verify database credentials
   - Check network connectivity
   - Ensure database migrations have been applied

2. **API Deployment Failures**:

   - Check Fly.io logs: `fly logs`
   - Verify environment variables
   - Check health endpoint

3. **Frontend Deployment Failures**:
   - Check Vercel build logs
   - Verify API URL configuration
   - Check authentication configuration

## Security Considerations

1. **Secrets Management**:

   - All secrets are stored in GitHub Secrets and environment variables
   - Never commit secrets to the repository

2. **SSL/TLS**:

   - All communications use HTTPS
   - TLS 1.3 is enforced via security headers

3. **Database Security**:
   - Database access is restricted by IP
   - Connection strings use SSL
   - Row-level security is implemented for multi-tenant data

## Post-Deployment Verification

After deployment, verify:

1. User authentication works
2. Tenant isolation is functioning correctly
3. Order creation and management flows work
4. Supplier collaboration features work
5. Email notifications are being sent
6. File uploads and downloads work

## Deployment Checklist

- [ ] Run all tests locally
- [ ] Verify database migrations
- [ ] Update environment variables
- [ ] Deploy to staging
- [ ] Test all features in staging
- [ ] Deploy to production
- [ ] Verify production deployment
- [ ] Monitor for any issues
