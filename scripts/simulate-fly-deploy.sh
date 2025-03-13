#!/bin/bash

# Exit on error
set -e

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Simulating Fly.io deployment process locally...${NC}"

# Build the production Docker image
echo -e "${GREEN}Building production Docker image...${NC}"
docker build -t supply-chain-system-api:local -f apps/api/Dockerfile .

# Create a network for the containers
echo -e "${GREEN}Creating Docker network...${NC}"
docker network create --driver bridge fly-simulation || true

# Start PostgreSQL container
echo -e "${GREEN}Starting PostgreSQL container...${NC}"
docker run --name fly-postgres \
  --network fly-simulation \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=supply_chain_system \
  -d postgres:15-alpine

# Wait for PostgreSQL to be ready
echo -e "${GREEN}Waiting for PostgreSQL to be ready...${NC}"
sleep 5

# Start the API container with production settings
echo -e "${GREEN}Starting API container with production settings...${NC}"
docker run --name fly-api \
  --network fly-simulation \
  -p 3001:3001 \
  -e NODE_ENV=production \
  -e PORT=3001 \
  -e DATABASE_URL=postgres://postgres:postgres@fly-postgres:5432/supply_chain_system \
  -d supply-chain-system-api:local

# Wait for the API to be ready
echo -e "${GREEN}Waiting for API to be ready...${NC}"
attempt=0
max_attempts=30
until $(curl --output /dev/null --silent --fail http://localhost:3001/health); do
    if [ ${attempt} -eq ${max_attempts} ]; then
        echo -e "${RED}API failed to start after ${max_attempts} attempts.${NC}"
        echo -e "${YELLOW}Checking logs...${NC}"
        docker logs fly-api
        echo -e "${YELLOW}Cleaning up containers...${NC}"
        docker rm -f fly-api fly-postgres || true
        exit 1
    fi
    
    attempt=$((attempt+1))
    echo -e "${YELLOW}Waiting for API to be ready... (Attempt ${attempt}/${max_attempts})${NC}"
    sleep 2
done

echo -e "${GREEN}API is ready!${NC}"
echo -e "${GREEN}Fly.io simulation is running at:${NC}"
echo -e "  - API: http://localhost:3001"
echo -e "  - Health check: http://localhost:3001/health"
echo -e "${YELLOW}To stop the simulation, run:${NC} docker rm -f fly-api fly-postgres"
echo -e "${YELLOW}To view logs, run:${NC} docker logs -f fly-api" 