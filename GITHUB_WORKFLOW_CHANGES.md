# GitHub Workflow Changes

## Overview of Changes

We've simplified the GitHub workflows to make them more maintainable and efficient. The following changes have been implemented:

1. **Removed Deployment Workflows**:

   - Removed `deploy-production.yml` and `deploy-staging.yml` files
   - Deployment can now be handled manually or through a separate process

2. **Simplified Build Workflow**:

   - Streamlined the build process to focus on building all projects correctly
   - Removed unnecessary formatting checks (these can be handled by pre-commit hooks)
   - Simplified the artifact creation process

3. **Improved Artifact Packaging**:

   - API artifact now includes `node_modules` for runtime dependencies
   - Packages are now included in their entirety rather than just the dist folders
   - Simplified the directory structure for easier deployment

4. **Simplified Dockerfile**:

   - Created a minimal Dockerfile that uses the default Node.js image
   - Removed complex multi-stage build process
   - Assumes artifacts are pre-built, focusing only on running the application

5. **Improved Fly.io Deployment**:
   - Updated `deploy-api.yml` to work with the new artifact structure
   - Removed Dockerfile reference from fly.toml files
   - Dynamically generates fly.toml during deployment
   - Simplified the deployment process by using standard Fly.io features

## Build Workflow Details

The new build workflow:

1. Checks out the code
2. Sets up Node.js
3. Installs dependencies
4. Runs type checking and linting
5. Builds all projects
6. Packages the API and Web projects into separate artifacts
7. Uploads the artifacts to GitHub
8. Creates a build info file with metadata

## Artifact Structure

### API Artifact

The API artifact contains:

- Pre-built API application (`apps/api/dist`)
- All required `node_modules`
- All shared packages
- A simplified Dockerfile
- A README with deployment instructions

### Web Artifact

The Web artifact contains:

- Pre-built Next.js application (`.next` directory)
- Public assets
- Configuration files
- A README with deployment instructions

## Deployment Instructions

### API Deployment

1. Download the API artifact
2. Extract the contents
3. Build the Docker image:
   ```bash
   docker build -t supply-chain-api .
   ```
4. Run the container:
   ```bash
   docker run -p 3001:3001 -e DATABASE_URL=your_database_url -e JWT_SECRET=your_jwt_secret supply-chain-api
   ```

### Fly.io Deployment

The `deploy-api.yml` workflow handles deployment to Fly.io:

1. Downloads the API artifact from a successful build
2. Extracts the artifact
3. Creates a fly.toml file based on the target environment
4. Sets environment-specific secrets using the Fly.io CLI
5. Deploys the application
6. Verifies the deployment by checking the health endpoint
7. Rolls back automatically if verification fails

### Web Deployment

1. Download the Web artifact
2. Extract the contents
3. Deploy to Vercel using the `--prebuilt` flag:
   ```bash
   vercel --prod --prebuilt
   ```

## Benefits of These Changes

1. **Simplified Workflow**: Easier to understand and maintain
2. **Faster Builds**: Reduced redundant steps
3. **Smaller Artifacts**: Only includes what's necessary
4. **Easier Deployment**: Simplified deployment process
5. **Better Separation of Concerns**: Build and deployment are now separate processes
6. **Improved Reliability**: Standardized deployment process with verification and rollback
