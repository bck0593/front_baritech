#!/bin/bash

# A方式: standalone server.js を .next/standalone ディレクトリで実行
# Azure App Service での推奨起動方法

echo "=== A方式 Standalone Server起動 ==="
echo "Current directory: $(pwd)"
echo "Node version: $(node -v)"
echo "NODE_ENV: $NODE_ENV"
echo "PORT: $PORT"

# .next/standalone ディレクトリに移動
cd /home/site/wwwroot/.next/standalone

echo "Standalone directory contents:"
ls -la

echo "Node modules check:"
ls -la node_modules | head -10

# 環境変数設定
export NODE_ENV=production

# standalone server.js 実行
echo "Starting standalone server..."
exec node server.js
