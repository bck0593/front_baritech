#!/bin/bash

# Azure App Service startup script for Next.js application

echo "Starting Next.js application on Azure App Service..."

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm ci --production=false
fi

# Build the application
echo "Building application..."
npm run build

# Start the application
echo "Starting application..."
npm start
