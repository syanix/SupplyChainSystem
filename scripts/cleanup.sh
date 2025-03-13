#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Cleaning up Docker containers and networks...${NC}"

# Stop and remove Docker Compose containers
echo -e "${GREEN}Stopping and removing Docker Compose containers...${NC}"
docker-compose down

# Stop and remove Fly.io simulation containers
echo -e "${GREEN}Stopping and removing Fly.io simulation containers...${NC}"
docker rm -f fly-api fly-postgres 2>/dev/null || true

# Remove the Fly.io simulation network
echo -e "${GREEN}Removing Fly.io simulation network...${NC}"
docker network rm fly-simulation 2>/dev/null || true

echo -e "${GREEN}Cleanup complete!${NC}" 