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

   - API artifact now includes production-only dependencies installed with `npm ci --omit=dev`
   - Husky prepare script is removed to prevent git hook installation errors
   - Packages are now included with their dist folders and necessary files
   - Prisma schema is copied and client is generated during the build process
   - Prisma schema includes binary targets for both native and Alpine Linux environments
   - Proper directory structure is created before copying files
   - Simplified the directory structure for easier deployment
   - Correct file paths are used in all configuration files
   - OpenSSL is added to the Dockerfile for Prisma compatibility

4. **Simplified Dockerfile**:

   - Created a minimal Dockerfile that uses the default Node.js image
   - Removed complex multi-stage build process
   - Assumes artifacts are pre-built, focusing only on running the application

5. **Improved Fly.io Deployment**:

   - Updated `deploy-api.yml` to work with the new artifact structure
   - Removed Dockerfile reference from fly.toml files
   - Dynamically generates fly.toml during deployment
   - Simplified the deployment process by using standard Fly.io features

6. **Simplified Vercel Deployment**:
   - Updated `deploy-web.yml` to use Vercel's standard Git integration
   - Removed artifact download and extraction steps
   - Added support for both staging and production environments
   - Configured environment variables (`NEXT_PUBLIC_API_URL`) based on deployment target
   - Added proper project naming for Vercel deployments (`supply-chain-system` for production, `staging-supply-chain-system` for staging)
   - Added `vercel.json` configuration file for consistent project settings
   - Added monorepo-specific configuration to handle the Next.js app in the `apps/web` directory
   - Added Husky prepare script removal to prevent git-related errors
   - Added step to prepare web app for standalone deployment by copying workspace dependencies
   - Simplified deployment by using Vercel CLI directly
   - Improved verification process to ensure successful deployments
   - Leverages Vercel's build system to handle the web app build process

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

- Prebuilt Next.js application (`.next` directory)
- Configuration files (`next.config.js`, `package.json`, `tsconfig.json`)
- Public assets (`public` directory)
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

The `deploy-web.yml` workflow handles deployment to Vercel:

1. Checks out the code directly from the repository
2. Verifies the monorepo structure (checks for `apps/web` directory and key files)
3. Prepares the web app for standalone deployment by copying workspace dependencies
4. Removes the Husky prepare script to prevent git-related errors
5. Changes to the web app directory before deployment
6. Sets appropriate project name based on the deployment environment
7. Deploys to Vercel using the CLI with environment-specific settings
8. Verifies the deployment by checking the health endpoint

The workflow uses different project names for different environments:

- Production: `supply-chain-system`
- Staging: `staging-supply-chain-system`

This ensures that each environment has its own dedicated Vercel project.

We've also added monorepo-specific configuration in `vercel.json`:

- Custom build command that focuses only on the web app
- Custom install command that focuses only on the web app
- Ignore command to only trigger builds when the web app changes
- Custom output directory pointing to the web app's `.next` directory
- Rewrites to properly handle the monorepo structure

By focusing only on the web app during deployment, we ensure that Vercel doesn't attempt to build the API or other parts of the monorepo that aren't relevant to the web deployment.

## Benefits of These Changes

1. **Simplified Workflow**: Easier to understand and maintain
2. **Faster Builds**: Reduced redundant steps
3. **Smaller Artifacts**: Only includes what's necessary
4. **Easier Deployment**: Simplified deployment process
5. **Better Separation of Concerns**: Build and deployment are now separate processes
6. **Improved Reliability**: Standardized deployment process with verification and rollback
7. **Leverages Platform Capabilities**: Uses Vercel's built-in Git integration and build system
