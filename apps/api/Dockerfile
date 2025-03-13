FROM node:20-alpine

WORKDIR /app

# Copy pre-built artifacts and dependencies
COPY apps/api/dist/ ./apps/api/dist/
COPY packages/database/dist/ ./packages/database/dist/
COPY packages/shared/dist/ ./packages/shared/dist/
COPY packages/ui/dist/ ./packages/ui/dist/

# Copy only production node_modules (no dev dependencies)
COPY node_modules/ ./node_modules/

# Set working directory to the API app
WORKDIR /app/apps/api

# Expose the port the app runs on
EXPOSE 3001

# Run the app
CMD ["node", "dist/main.js"] 