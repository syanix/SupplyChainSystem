#!/bin/bash

# Exit on error
set -e

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Starting local development environment...${NC}"

# Build and start the containers
echo -e "${GREEN}Building and starting Docker containers...${NC}"
docker-compose up -d --build

# Wait for the API to be ready
echo -e "${GREEN}Waiting for API to be ready...${NC}"
attempt=0
max_attempts=30
until $(curl --output /dev/null --silent --fail http://localhost:3001/health); do
    if [ ${attempt} -eq ${max_attempts} ]; then
        echo -e "${RED}API failed to start after ${max_attempts} attempts.${NC}"
        echo -e "${YELLOW}Checking logs...${NC}"
        docker-compose logs api
        exit 1
    fi
    
    attempt=$((attempt+1))
    echo -e "${YELLOW}Waiting for API to be ready... (Attempt ${attempt}/${max_attempts})${NC}"
    sleep 2
done

echo -e "${GREEN}API is ready!${NC}"
echo -e "${GREEN}Local environment is running at:${NC}"
echo -e "  - API: http://localhost:3001"
echo -e "  - Health check: http://localhost:3001/health"
echo -e "  - API Documentation: http://localhost:3001/api/docs"
echo -e "${YELLOW}To stop the environment, run:${NC} docker-compose down"
echo -e "${YELLOW}To view logs, run:${NC} docker-compose logs -f" 