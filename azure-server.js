#!/usr/bin/env node

// Azure App Service server.js ラッパー
// Next.js standalone server.js を確実にポートでリッスンさせる

console.log('🚀 Azure App Service - Next.js Standalone Server Wrapper');

const path = require('path');
const fs = require('fs');

// 環境変数設定
process.env.NODE_ENV = process.env.NODE_ENV || 'production';
const port = parseInt(process.env.PORT, 10) || 8080;
const hostname = process.env.HOSTNAME || '0.0.0.0';

console.log(`📡 Port: ${port}`);
console.log(`🌍 Environment: ${process.env.NODE_ENV}`);
console.log(`🏠 Hostname: ${hostname}`);

// Process終了ハンドラー
process.on('SIGTERM', () => {
  console.log('🔄 SIGTERM received, shutting down gracefully...');
});

process.on('SIGINT', () => {
  console.log('🔄 SIGINT received, shutting down gracefully...');
});

process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
});

try {
  console.log('🔧 Starting Next.js server...');
  
  // Next.js server関数を取得
  const dir = __dirname;
  process.chdir(dir);
  
  console.log(`📂 Working directory: ${process.cwd()}`);
  
  require('next');
  const { startServer } = require('next/dist/server/lib/start-server');
  
  let keepAliveTimeout = parseInt(process.env.KEEP_ALIVE_TIMEOUT, 10);
  if (Number.isNaN(keepAliveTimeout) || !Number.isFinite(keepAliveTimeout) || keepAliveTimeout < 0) {
    keepAliveTimeout = undefined;
  }
  
  // Next.js設定（最小限）
  const nextConfig = {
    output: 'standalone',
    compress: true,
    poweredByHeader: false,
    generateEtags: false,
  };
  
  console.log(`🚀 Starting Next.js server on ${hostname}:${port}`);
  
  // サーバー起動（Promiseを適切に処理）
  startServer({
    dir,
    isDev: false,
    config: nextConfig,
    hostname,
    port,
    allowRetry: false,
    keepAliveTimeout,
  }).then(() => {
    console.log(`✅ Next.js server started successfully on ${hostname}:${port}`);
  }).catch((err) => {
    console.error('❌ Failed to start Next.js server:', err);
    
    // フォールバック: シンプルなHTTPサーバー
    console.log('🔄 Starting fallback HTTP server...');
    const http = require('http');
    
    const server = http.createServer((req, res) => {
      res.writeHead(200, { 
        'Content-Type': 'text/html; charset=utf-8',
        'X-Powered-By': 'DogMATEs/Azure'
      });
      res.end(`
        <html>
          <head>
            <title>DogMATEs - Starting...</title>
            <meta charset="utf-8">
          </head>
          <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; padding: 40px; background: #f5f5f5;">
            <div style="max-width: 600px; margin: 0 auto; background: white; padding: 40px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
              <h1 style="color: #003273; margin-bottom: 20px;">🐕 DogMATEs</h1>
              <h2 style="color: #666;">サーバー起動中...</h2>
              <p>Next.js サーバーの初期化に時間がかかっています。</p>
              <hr style="margin: 20px 0; border: none; border-top: 1px solid #eee;">
              <div style="font-size: 14px; color: #888;">
                <p><strong>PORT:</strong> ${port}</p>
                <p><strong>NODE_ENV:</strong> ${process.env.NODE_ENV}</p>
                <p><strong>時刻:</strong> ${new Date().toLocaleString('ja-JP')}</p>
              </div>
              <div style="margin-top: 20px; padding: 15px; background: #fff3cd; border-radius: 4px; border-left: 4px solid #ffc107;">
                <strong>エラー詳細:</strong> ${err.message}
              </div>
            </div>
          </body>
        </html>
      `);
    });
    
    server.listen(port, hostname, () => {
      console.log(`✅ Fallback server listening on ${hostname}:${port}`);
    });
    
    server.on('error', (serverErr) => {
      console.error('❌ Fallback server error:', serverErr);
      process.exit(1);
    });
  });
  
} catch (error) {
  console.error('❌ Critical error in server wrapper:', error);
  process.exit(1);
}
