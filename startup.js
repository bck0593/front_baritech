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
console.log(`📂 Current directory: ${process.cwd()}`);
console.log(`📂 __dirname: ${__dirname}`);

// ディレクトリ構造をログ出力
try {
  console.log('📁 Directory contents:');
  const files = fs.readdirSync(__dirname);
  files.forEach(file => {
    const filePath = path.join(__dirname, file);
    const stats = fs.statSync(filePath);
    console.log(`  ${stats.isDirectory() ? '📁' : '📄'} ${file}`);
  });
} catch (err) {
  console.error('❌ Error reading directory:', err);
}

// サーバーファイルを複数パスで確認
const possibleServerPaths = [
  path.join(__dirname, 'server.js'),           // ルート直下
  path.join(__dirname, '.next', 'standalone', 'server.js'), // standalone内
  path.join(__dirname, '.next', 'server.js'),  // .next直下
];

let foundServer = false;

for (const serverPath of possibleServerPaths) {
  console.log(`🔍 Looking for server at: ${serverPath}`);
  
  if (fs.existsSync(serverPath)) {
    console.log(`✅ Found server at: ${serverPath}`);
    console.log(`📡 Starting server on port ${process.env.PORT}...`);
    
    try {
      // サーバーを直接require
      require(serverPath);
      foundServer = true;
      console.log(`🎉 Server started successfully from ${serverPath}`);
      break;
    } catch (error) {
      console.error(`❌ Error starting server from ${serverPath}:`, error.message);
      console.error('📋 Error stack:', error.stack);
      continue;
    }
  } else {
    console.log(`❌ Server not found at: ${serverPath}`);
  }
}

if (!foundServer) {
  console.log('❌ No server.js found, creating fallback HTTP server...');
  
  // 最後の手段: 簡単なHTTPサーバーを起動
  const http = require('http');
  const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(`
      <html>
        <body>
          <h1>🚀 DogMATEs サーバー起動中...</h1>
          <p>Next.js server files not found. Please check deployment.</p>
          <p><strong>PORT:</strong> ${process.env.PORT}</p>
          <p><strong>NODE_ENV:</strong> ${process.env.NODE_ENV}</p>
          <p><strong>Current Directory:</strong> ${process.cwd()}</p>
          <p><strong>検索したパス:</strong></p>
          <ul>
            ${possibleServerPaths.map(p => `<li>${p} - ${fs.existsSync(p) ? '✅' : '❌'}</li>`).join('')}
          </ul>
        </body>
      </html>
    `);
  });
  
  server.listen(process.env.PORT, '0.0.0.0', () => {
    console.log(`✅ Fallback server listening on port ${process.env.PORT}`);
  });
  
  server.on('error', (err) => {
    console.error('❌ Fallback server failed:', err);
    process.exit(1);
  });
}
