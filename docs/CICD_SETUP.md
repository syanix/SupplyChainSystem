# CI/CD Setup Guide for Supply Chain System

This guide provides detailed instructions for setting up Continuous Integration and Continuous Deployment (CI/CD) for your Supply Chain System.

## Overview

A robust CI/CD pipeline will:

1. Run tests on every pull request
2. Deploy to staging environments automatically
3. Deploy to production after manual approval
4. Ensure database migrations are applied safely
5. Notify the team of deployment status

## GitHub Actions Setup

### Basic CI/CD Workflow

Create a file at `.github/workflows/main.yml`:

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
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: 18
          cache: "npm"

      - name: Install dependencies
        run: npm ci

      - name: Lint code
        run: npm run lint

      - name: Run tests
        run: npm run test

      - name: Build packages
        run: npm run build

  deploy-staging:
    needs: test
    if: github.event_name == 'push' && github.ref == 'refs/heads/staging'
    runs-on: ubuntu-latest
    environment: staging
    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Deploy API to Fly.io (Staging)
        uses: superfly/flyctl-actions/setup-flyctl@master
        env:
          FLY_API_TOKEN: ${{ secrets.FLY_API_TOKEN }}
        with:
          args: "deploy --config ./apps/api/fly.staging.toml --remote-only"

      - name: Deploy Web to Vercel (Staging)
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          working-directory: ./apps/web
          vercel-args: "--prod"
          alias-domains: |
            staging.your-domain.com

  deploy-production:
    needs: test
    if: github.event_name == 'push' && github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    environment: production
    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Deploy API to Fly.io (Production)
        uses: superfly/flyctl-actions/setup-flyctl@master
        env:
          FLY_API_TOKEN: ${{ secrets.FLY_API_TOKEN }}
        with:
          args: "deploy --config ./apps/api/fly.toml --remote-only"

      - name: Deploy Web to Vercel (Production)
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          working-directory: ./apps/web
          vercel-args: "--prod"
          alias-domains: |
            your-domain.com
            www.your-domain.com
```

### Database Migration Workflow

Create a file at `.github/workflows/database-migrations.yml`:

```yaml
name: Database Migrations

on:
  push:
    branches: [main, staging]
    paths:
      - "apps/api/src/migrations/**"
  workflow_dispatch:

jobs:
  migrate-staging:
    if: github.ref == 'refs/heads/staging'
    runs-on: ubuntu-latest
    environment: staging
    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: 18
          cache: "npm"

      - name: Install dependencies
        run: npm ci

      - name: Run migrations (Staging)
        run: |
          cd apps/api
          npm run migration:run
        env:
          DATABASE_URL: ${{ secrets.STAGING_DATABASE_URL }}

  migrate-production:
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    environment: production
    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: 18
          cache: "npm"

      - name: Install dependencies
        run: npm ci

      - name: Run migrations (Production)
        run: |
          cd apps/api
          npm run migration:run
        env:
          DATABASE_URL: ${{ secrets.PRODUCTION_DATABASE_URL }}
```

## Setting Up Required Secrets

In your GitHub repository, go to Settings > Secrets and Variables > Actions and add the following secrets:

### For Vercel Deployment

- `VERCEL_TOKEN`: Your Vercel API token
- `VERCEL_ORG_ID`: Your Vercel organization ID
- `VERCEL_PROJECT_ID`: Your Vercel project ID

### For Fly.io Deployment

- `FLY_API_TOKEN`: Your Fly.io API token

### For Database Migrations

- `STAGING_DATABASE_URL`: Your Supabase staging database URL
- `PRODUCTION_DATABASE_URL`: Your Supabase production database URL

## Environment-Specific Configuration

### Fly.io Configuration

Create environment-specific configuration files:

1. **Production (`fly.toml`)**:

```toml
app = "supply-chain-system-api"
primary_region = "sjc"

[env]
  NODE_ENV = "production"
  PORT = "3001"

[http_service]
  internal_port = 3001
  force_https = true
  auto_stop_machines = true
  auto_start_machines = true
  min_machines_running = 1
```

2. **Staging (`fly.staging.toml`)**:

```toml
app = "supply-chain-system-api-staging"
primary_region = "sjc"

[env]
  NODE_ENV = "staging"
  PORT = "3001"

[http_service]
  internal_port = 3001
  force_https = true
  auto_stop_machines = true
  auto_start_machines = true
  min_machines_running = 0
```

### Vercel Configuration

Create a `vercel.json` file in your web app directory:

```json
{
  "github": {
    "enabled": false
  },
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/next"
    }
  ],
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/"
    }
  ]
}
```

## Deployment Notifications

### Slack Notifications

Add this to your GitHub Actions workflow:

```yaml
- name: Send Slack notification
  uses: 8398a7/action-slack@v3
  with:
    status: ${{ job.status }}
    fields: repo,message,commit,author,action,eventName,ref,workflow
  env:
    SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK_URL }}
  if: always()
```

### Email Notifications

Add this to your GitHub Actions workflow:

```yaml
- name: Send email notification
  uses: dawidd6/action-send-mail@v3
  with:
    server_address: smtp.gmail.com
    server_port: 465
    username: ${{ secrets.EMAIL_USERNAME }}
    password: ${{ secrets.EMAIL_PASSWORD }}
    subject: Deployment ${{ job.status }} for ${{ github.repository }}
    body: |
      Deployment ${{ job.status }} for ${{ github.repository }}

      Commit: ${{ github.event.head_commit.message }}
      Author: ${{ github.event.head_commit.author.name }}

      See details: ${{ github.server_url }}/${{ github.repository }}/actions/runs/${{ github.run_id }}
    to: team@your-company.com
    from: GitHub Actions
  if: always()
```

## Rollback Strategy

### Automated Rollback on Failure

Add this to your GitHub Actions workflow:

```yaml
- name: Check deployment health
  id: health_check
  run: |
    # Wait for deployment to stabilize
    sleep 30

    # Check API health endpoint
    HEALTH_STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://api.your-domain.com/health)

    if [ "$HEALTH_STATUS" != "200" ]; then
      echo "::set-output name=status::failure"
    else
      echo "::set-output name=status::success"
    fi

- name: Rollback on failure
  if: steps.health_check.outputs.status == 'failure'
  run: |
    # Rollback to previous version
    git checkout HEAD~1
    # Redeploy
    npm run deploy
```

## Monitoring Deployments

### Deployment Dashboard

Create a simple deployment dashboard using GitHub Pages:

1. Create a file at `.github/workflows/deployment-dashboard.yml`:

```yaml
name: Update Deployment Dashboard

on:
  workflow_run:
    workflows: ["CI/CD Pipeline"]
    types:
      - completed

jobs:
  update-dashboard:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Update deployment data
        run: |
          mkdir -p dashboard
          echo "{\"last_deployment\": \"$(date)\", \"status\": \"${{ github.event.workflow_run.conclusion }}\", \"commit\": \"${{ github.event.workflow_run.head_commit.message }}\"}" > dashboard/data.json

      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dashboard
```

2. Create a simple HTML dashboard in the `dashboard` directory

## Best Practices

1. **Use Environment Protection Rules**:

   - Require approvals for production deployments
   - Limit who can approve deployments

2. **Implement Feature Flags**:

   - Use a service like LaunchDarkly or a custom solution
   - Deploy features behind flags to enable quick rollbacks

3. **Maintain Deployment Documentation**:

   - Keep a deployment log
   - Document any manual steps
   - Update runbooks after incidents

4. **Regular Deployment Drills**:

   - Practice rollbacks monthly
   - Simulate failure scenarios
   - Update recovery procedures based on findings

5. **Optimize Build Performance**:
   - Use build caching
   - Parallelize test runs
   - Optimize Docker builds

## Troubleshooting Common CI/CD Issues

### GitHub Actions Issues

1. **Workflow not triggering**:

   - Check branch names and event triggers
   - Verify workflow file syntax
   - Check repository permissions

2. **Deployment failures**:

   - Check environment variables and secrets
   - Verify service credentials are valid
   - Check for rate limiting or quota issues

3. **Slow builds**:
   - Use dependency caching
   - Optimize test runs
   - Consider using GitHub-hosted runners with more resources

### Vercel Deployment Issues

1. **Build failures**:

   - Check build logs for errors
   - Verify environment variables
   - Check for dependency issues

2. **Preview deployments not working**:
   - Verify GitHub integration
   - Check project settings
   - Ensure branch is configured for previews

### Fly.io Deployment Issues

1. **Deployment failures**:

   - Check Fly.io logs
   - Verify Docker build process
   - Check for resource constraints

2. **Application crashes after deployment**:
   - Implement health checks
   - Set up proper logging
   - Configure automatic rollbacks

## Advanced CI/CD Configurations

### Monorepo-Specific Optimizations

For monorepo setups like this Supply Chain System:

```yaml
- name: Determine changed packages
  id: changed
  run: |
    if [ "${{ github.event_name }}" == "pull_request" ]; then
      BASE_SHA=${{ github.event.pull_request.base.sha }}
    else
      BASE_SHA=$(git rev-parse HEAD~1)
    fi

    CHANGED_DIRS=$(git diff --name-only $BASE_SHA HEAD | grep -E '^(apps|packages)/' | cut -d/ -f1,2 | sort | uniq)
    echo "::set-output name=dirs::$CHANGED_DIRS"

- name: Build only changed packages
  if: contains(steps.changed.outputs.dirs, 'apps/web')
  run: |
    cd apps/web
    npm run build
```

### Parallel Testing

For faster CI runs:

```yaml
test:
  runs-on: ubuntu-latest
  strategy:
    matrix:
      package: [api, web, shared]
  steps:
    - name: Checkout code
      uses: actions/checkout@v3

    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: 18
        cache: "npm"

    - name: Install dependencies
      run: npm ci

    - name: Run tests for ${{ matrix.package }}
      run: |
        cd apps/${{ matrix.package }}
        npm run test
```

By implementing this CI/CD setup, you'll have a robust, automated deployment pipeline that ensures your Supply Chain System is deployed reliably and consistently across all environments.
