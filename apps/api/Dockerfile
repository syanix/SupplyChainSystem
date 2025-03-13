FROM node:20-alpine

WORKDIR /app

# Install OpenSSL and other required dependencies for Prisma
RUN apk add --no-cache openssl openssl-dev libc6-compat

# Copy package files for dependency installation
COPY package.json package-lock.json ./
COPY apps/api/package.json ./apps/api/
COPY packages/database/package.json ./packages/database/
COPY packages/shared/package.json ./packages/shared/
COPY packages/ui/package.json ./packages/ui/

# Install all dependencies including NestJS packages
RUN npm ci

# Copy Prisma schema files from the database package
COPY packages/database/prisma ./packages/database/prisma/

# Generate Prisma client in the database package
RUN cd packages/database && npx prisma generate

# Copy source code
COPY . .

# Build packages and API
RUN npm run build:packages && cd apps/api && npm run build

# Set working directory to the API app
WORKDIR /app/apps/api

# Expose the port the app runs on
EXPOSE 3001

# Set NODE_ENV to production
ENV NODE_ENV=production

# Run the app
CMD ["node", "dist/main"]
