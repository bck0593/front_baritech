const { createServer } = require('http')
const { parse } = require('url')
const next = require('next')
const path = require('path')

const dev = process.env.NODE_ENV !== 'production'
const hostname = process.env.HOSTNAME || 'localhost'
const port = process.env.PORT || 3000

// プロセス最適化
process.env.NEXT_TELEMETRY_DISABLED = '1'

// When deployed on Azure, use the standalone server
if (process.env.NODE_ENV === 'production') {
  const standaloneServer = path.join(__dirname, '.next/standalone/server.js')
  try {
    require(standaloneServer)
  } catch (error) {
    console.error('Standalone server not found, falling back to regular Next.js server')
    startRegularServer()
  }
} else {
  startRegularServer()
}

function startRegularServer() {
  const app = next({ 
    dev, 
    hostname, 
    port,
    // Next.js 15対応の設定
    customServer: true
  })
  const handle = app.getRequestHandler()

  app.prepare().then(() => {
    const server = createServer(async (req, res) => {
      try {
        // Keep-Alive設定
        res.setHeader('Connection', 'keep-alive')
        res.setHeader('Keep-Alive', 'timeout=5')
        
        const parsedUrl = parse(req.url, true)
        await handle(req, res, parsedUrl)
      } catch (err) {
        console.error('Error occurred handling', req.url, err)
        res.statusCode = 500
        res.end('internal server error')
      }
    })

    // サーバー最適化
    server.keepAliveTimeout = 5000
    server.headersTimeout = 6000

    server
    .once('error', (err) => {
      console.error(err)
      process.exit(1)
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`)
    })
  })
}
