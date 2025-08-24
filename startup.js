#!/usr/bin/env node

// Azure App Service 用 Next.js Standalone サーバー起動スクリプト
// このスクリプトは Azure App Service の startup command で使用されます

const path = require('path');
const { spawn } = require('child_process');
const fs = require('fs');

console.log('🚀 Starting Next.js Standalone Server for Azure App Service...');

// デバッグ: 現在のディレクトリ構造を確認
console.log('📂 Current working directory:', process.cwd());
console.log('📂 __dirname:', __dirname);

try {
  console.log('📁 Directory contents:');
  const files = fs.readdirSync(__dirname);
  files.forEach(file => {
    const stats = fs.statSync(path.join(__dirname, file));
    console.log(`  ${stats.isDirectory() ? '📁' : '📄'} ${file}`);
  });
  
  // .nextディレクトリの存在確認
  const nextDir = path.join(__dirname, '.next');
  if (fs.existsSync(nextDir)) {
    console.log('📁 .next directory contents:');
    const nextFiles = fs.readdirSync(nextDir);
    nextFiles.forEach(file => {
      const stats = fs.statSync(path.join(nextDir, file));
      console.log(`  ${stats.isDirectory() ? '📁' : '📄'} ${file}`);
    });
    
    // standaloneディレクトリの確認
    const standaloneDir = path.join(nextDir, 'standalone');
    if (fs.existsSync(standaloneDir)) {
      console.log('📁 .next/standalone directory contents:');
      const standaloneFiles = fs.readdirSync(standaloneDir);
      standaloneFiles.forEach(file => {
        const stats = fs.statSync(path.join(standaloneDir, file));
        console.log(`  ${stats.isDirectory() ? '📁' : '📄'} ${file}`);
      });
    } else {
      console.log('❌ .next/standalone directory not found');
    }
  } else {
    console.log('❌ .next directory not found');
  }
} catch (err) {
  console.error('❌ Error reading directory:', err);
}

// サーバーファイルのパスを決定
let serverPath;
let serverType = 'unknown';
const possiblePaths = [
  { path: path.join(__dirname, '.next/standalone/server.js'), type: 'standalone' },
  { path: path.join(__dirname, '.next/server.js'), type: 'next-server' },
  { path: path.join(__dirname, 'server.js'), type: 'custom-server' },
  { path: path.join(__dirname, '.next/standalone/index.js'), type: 'standalone-index' },
];

for (const { path: possiblePath, type } of possiblePaths) {
  if (fs.existsSync(possiblePath)) {
    serverPath = possiblePath;
    serverType = type;
    console.log(`✅ Found ${type} server file at: ${serverPath}`);
    break;
  } else {
    console.log(`❌ Server file not found at: ${possiblePath}`);
  }
}

// Next.js dev serverをフォールバックとして使用
if (!serverPath) {
  console.log('🔄 No standalone server found, trying Next.js start command...');
  serverType = 'next-start';
  serverPath = null; // next startコマンドを使用
}

let nodeArgs, command;

if (serverType === 'next-start') {
  // Next.js start コマンドを使用
  command = 'npx';
  nodeArgs = ['next', 'start'];
  console.log(`🔧 Using Next.js start command: ${command} ${nodeArgs.join(' ')}`);
} else {
  // 直接サーバーファイルを実行
  command = 'node';
  nodeArgs = [
    '--max-old-space-size=1024',
    serverPath
  ];
  console.log(`🔧 Using direct server execution: ${command} ${nodeArgs.join(' ')}`);
}

console.log(`📁 Server path: ${serverPath || 'N/A (using next start)'}`);
console.log(`🔧 Server type: ${serverType}`);
console.log(`🌍 Environment: ${process.env.NODE_ENV || 'production'}`);
console.log(`📡 Port: ${process.env.PORT || 8080}`);
console.log(`🏠 Hostname: ${process.env.HOSTNAME || '0.0.0.0'}`);

// ポート確認
const port = process.env.PORT || 8080;
console.log(`🔍 Will start server on port: ${port}`);

// Next.js server を起動
console.log('🚀 Starting server process...');
const server = spawn(command, nodeArgs, {
  stdio: 'inherit',
  cwd: __dirname,
  env: {
    ...process.env,
    NODE_ENV: process.env.NODE_ENV || 'production',
    PORT: port,
    HOSTNAME: process.env.HOSTNAME || '0.0.0.0'
  }
});

// プロセス終了処理
server.on('close', (code) => {
  console.log(`📋 Server process exited with code ${code}`);
  if (code !== 0) {
    console.error(`❌ Server exited with non-zero code: ${code}`);
  }
  process.exit(code);
});

server.on('error', (err) => {
  console.error('❌ Failed to start server:', err);
  console.error('❌ Error details:', err.message);
  process.exit(1);
});

server.on('spawn', () => {
  console.log('✅ Server process spawned successfully');
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

process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err);
  process.exit(1);
});

console.log('✅ Startup script initialized, server starting...');
