#!/usr/bin/env node

// Azure App Service 用 Next.js Standalone サーバー起動スクリプト
console.log('🚀 Starting Next.js App for Azure App Service...');

const path = require('path');
const fs = require('fs');

// 環境変数設定
process.env.NODE_ENV = process.env.NODE_ENV || 'production';
process.env.PORT = process.env.PORT || 8080;

console.log(`📡 Port: ${process.env.PORT}`);
console.log(`🌍 Environment: ${process.env.NODE_ENV}`);

// サーバーファイルの確認
const serverPath = path.join(__dirname, '.next', 'standalone', 'server.js');
console.log(`🔍 Looking for server at: ${serverPath}`);

if (fs.existsSync(serverPath)) {
  console.log('✅ Found standalone server, starting...');
  require(serverPath);
} else {
  console.log('❌ Standalone server not found, using fallback...');
  // フォールバック: Next.js start
  const { spawn } = require('child_process');
  const server = spawn('npx', ['next', 'start'], {
    stdio: 'inherit',
    env: {
      ...process.env,
      PORT: process.env.PORT,
      NODE_ENV: 'production'
    }
  });
  
  server.on('error', (err) => {
    console.error('❌ Server failed:', err);
    process.exit(1);
  });
}
