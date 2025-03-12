FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy root package.json and workspace configs
COPY package.json package-lock.json ./
COPY turbo.json ./
COPY tsconfig.json ./

# Copy package.json files for all workspaces
COPY apps/api/package.json ./apps/api/
COPY packages/database/package.json ./packages/database/
COPY packages/shared/package.json ./packages/shared/
COPY packages/ui/package.json ./packages/ui/

# Install dependencies using npm ci for exact versions
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/package.json ./package.json
COPY --from=deps /app/turbo.json ./turbo.json
COPY --from=deps /app/tsconfig.json ./tsconfig.json

# Copy source code for all packages
COPY packages/ ./packages/
COPY apps/api/ ./apps/api/

# Build shared packages first
RUN npm run build:packages

# Build the API
RUN cd apps/api && npm run build

# Production image, copy all the files and run the app
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

# Copy necessary files from builder
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/apps/api/dist ./apps/api/dist
COPY --from=builder /app/apps/api/package.json ./apps/api/package.json
COPY --from=builder /app/packages/database/dist ./packages/database/dist
COPY --from=builder /app/packages/shared/dist ./packages/shared/dist
COPY --from=builder /app/packages/ui/dist ./packages/ui/dist

# Set working directory to the API app
WORKDIR /app/apps/api

# Expose the port the app runs on
EXPOSE 3001

# Run the app
CMD ["node", "dist/main.js"] 