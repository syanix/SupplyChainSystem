FROM node:20-alpine

WORKDIR /app

# Copy package files for production dependencies
COPY package.json ./
COPY apps/api/package.json ./apps/api/
COPY packages/database/package.json ./packages/database/
COPY packages/shared/package.json ./packages/shared/
COPY packages/ui/package.json ./packages/ui/

# Install production dependencies only
RUN npm ci --only=production --omit=dev

# Copy pre-built artifacts
COPY dist/ ./dist/
COPY node_modules/ ./node_modules/
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