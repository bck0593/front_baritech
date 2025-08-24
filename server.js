// Azure App Service用のNext.js 15 Standaloneサーバー起動スクリプト
const { createServer } = require('http')
const { parse } = require('url')
const next = require('next')

// 環境変数
const dev = process.env.NODE_ENV !== 'production'
const port = process.env.PORT  // Azure が必ず設定する

console.log('🚀 Starting Next.js server for Azure App Service...')
console.log(`📡 Port: ${port}`)
console.log(`🌍 Environment: ${process.env.NODE_ENV}`)

// Next.jsアプリケーションの初期化（hostnameを省略）
const app = next({ dev, port })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  console.log('✅ Next.js app prepared successfully')
  
  createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true)
      await handle(req, res, parsedUrl)
    } catch (err) {
      console.error('❌ Error occurred handling', req.url, err)
      res.statusCode = 500
      res.end('internal server error')
    }
  })
  .once('error', (err) => {
    console.error('❌ Server error:', err)
    process.exit(1)
  })
  .listen(port, '0.0.0.0', () => {
    console.log(`🎉 Server ready on http://0.0.0.0:${port}`)
    console.log(`✅ Azure App Service startup completed`)
  })
}).catch((err) => {
  console.error('❌ Failed to start server:', err)
  process.exit(1)
})
