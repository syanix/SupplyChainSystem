#!/bin/bash

# Stop the current containers
echo "Stopping current containers..."
docker-compose down

# Rebuild the API container
echo "Rebuilding API container..."
docker-compose build api

# Start the containers
echo "Starting containers..."
docker-compose up -d

# Show logs
echo "Showing API logs..."
docker-compose logs -f api 