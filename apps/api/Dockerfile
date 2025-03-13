FROM node:20-alpine

WORKDIR /app

# Copy package files and pre-built artifacts
COPY . .

# Expose the port the app runs on
EXPOSE 3001

# Set NODE_ENV to production
ENV NODE_ENV=production

# Run the app
CMD ["node", "dist/main"]
