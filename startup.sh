#!/bin/bash

# Azure App Service startup script for Next.js application

echo "Starting Next.js application on Azure App Service..."

# Set environment variables
export NODE_ENV=production
export PORT=${PORT:-8080}
export HOSTNAME="0.0.0.0"

# Check Node.js version
echo "Node.js version: $(node --version)"
echo "NPM version: $(npm --version)"

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm ci --only=production --silent
else
    echo "Dependencies already installed"
fi

# Build the application if .next doesn't exist
if [ ! -d ".next" ]; then
    echo "Building application..."
    npm run build
else
    echo "Application already built"
fi

# Check if standalone server exists
if [ -f ".next/standalone/server.js" ]; then
    echo "Using standalone server..."
    cd .next/standalone
    echo "Starting standalone server on port $PORT..."
    node server.js
else
    echo "Using regular server..."
    echo "Starting application on port $PORT..."
    npm run start
fi
