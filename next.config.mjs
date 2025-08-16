/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Azure App Service対応
  output: 'standalone',
  // 静的ファイルの最適化
  compress: true,
  // トレーリングスラッシュを無効化
  trailingSlash: false,
  // 実験的機能の設定
  experimental: {
    serverActions: {
      allowedOrigins: ['app-002-gen10-step3-2-node-oshima13.azurewebsites.net', 'localhost:3000']
    }
  },
  // セキュリティヘッダー
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ]
  },
  // Azure App Service用のリダイレクト設定
  async redirects() {
    return [
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
    ]
  },
}

export default nextConfig
