#!/bin/bash

# Script to reset a remote database using Prisma
# This is a wrapper around reset-remote-db.js

# Check if DATABASE_URL is provided
if [ -z "$1" ]; then
  echo "Error: DATABASE_URL is required"
  echo "Usage: ./reset-remote-db.sh <DATABASE_URL> [--force]"
  exit 1
fi

# Set DATABASE_URL from first argument
export DATABASE_URL="$1"
shift

# Get the directory of this script
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Find Node.js path
NODE_PATH=$(command -v node)
if [ -z "$NODE_PATH" ]; then
  # Try common locations
  for path in "/usr/bin/node" "/usr/local/bin/node" "$HOME/.nvm/versions/node/v23.9.0/bin/node" "$HOME/.nvm/versions/node/*/bin/node"; do
    if [ -x "$path" ]; then
      NODE_PATH="$path"
      break
    fi
  done
  
  # If still not found
  if [ -z "$NODE_PATH" ]; then
    echo "Error: Node.js executable not found. Please install Node.js or specify the path."
    exit 1
  fi
fi

echo "Using Node.js at: $NODE_PATH"

# Run the Node.js script
echo "Resetting database: $DATABASE_URL"
"$NODE_PATH" "$SCRIPT_DIR/reset-remote-db.js" "$@" 