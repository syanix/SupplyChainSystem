FROM node:20-alpine

WORKDIR /app

# Copy package files for dependency installation
COPY package.json package-lock.json ./
COPY apps/api/package.json ./apps/api/
COPY packages/database/package.json ./packages/database/
COPY packages/shared/package.json ./packages/shared/
COPY packages/ui/package.json ./packages/ui/

# Install all dependencies including NestJS packages
# Using clean npm ci without legacy-peer-deps flag
RUN npm ci --only=production

# Copy pre-built artifacts
COPY apps/api/dist/ ./apps/api/dist/
COPY packages/database/dist/ ./packages/database/dist/
COPY packages/shared/dist/ ./packages/shared/dist/
COPY packages/ui/dist/ ./packages/ui/dist/

# Set working directory to the API app
WORKDIR /app/apps/api

# Expose the port the app runs on
EXPOSE 3001

# Run the app
CMD ["node", "dist/main.js"] 