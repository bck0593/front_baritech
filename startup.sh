#!/bin/bash

# Azure App Service startup script for Next.js application

echo "🚀 Starting Next.js application on Azure App Service..."

# Set environment variables
export NODE_ENV=production
export PORT=${PORT:-8080}

echo "📡 Port: $PORT"
echo "🌍 Environment: $NODE_ENV"

# Check if standalone server exists
if [ -f ".next/standalone/server.js" ]; then
    echo "✅ Found standalone server, starting..."
    cd .next/standalone
    node server.js
elif [ -f "startup.js" ]; then
    echo "✅ Found startup.js, starting..."
    node startup.js
else
    echo "❌ No server file found, using Next.js start..."
    npm run start
fi
