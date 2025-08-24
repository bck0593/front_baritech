#!/usr/bin/env node

// Azure App Service 用 Next.js Standalone サーバー起動スクリプト
// このスクリプトは Azure App Service の startup command で使用されます

const path = require('path');
const { spawn } = require('child_process');

console.log('🚀 Starting Next.js Standalone Server for Azure App Service...');

const serverPath = path.join(__dirname, 'server.js');
const nodeArgs = [
  '--max-old-space-size=1024',
  serverPath
];

console.log(`📁 Server path: ${serverPath}`);
console.log(`🔧 Node args: ${nodeArgs.join(' ')}`);
console.log(`🌍 Environment: ${process.env.NODE_ENV || 'production'}`);
console.log(`📡 Port: ${process.env.PORT || 8080}`);

// Next.js standalone server を起動
const server = spawn('node', nodeArgs, {
  stdio: 'inherit',
  env: {
    ...process.env,
    NODE_ENV: process.env.NODE_ENV || 'production',
    PORT: process.env.PORT || 8080,
    HOSTNAME: process.env.HOSTNAME || '0.0.0.0'
  }
});

// プロセス終了処理
server.on('close', (code) => {
  console.log(`📋 Server process exited with code ${code}`);
  process.exit(code);
});

server.on('error', (err) => {
  console.error('❌ Failed to start server:', err);
  process.exit(1);
});

// シグナル処理
process.on('SIGTERM', () => {
  console.log('🔄 SIGTERM received, shutting down gracefully...');
  server.kill('SIGTERM');
});

process.on('SIGINT', () => {
  console.log('🔄 SIGINT received, shutting down gracefully...');
  server.kill('SIGINT');
});

console.log('✅ Startup script initialized, server starting...');
