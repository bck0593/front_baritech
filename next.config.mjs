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
    // Azure App Service環境での画像最適化を無効化
    loader: 'default',
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'app-002-gen10-step3-2-node-oshima13.azurewebsites.net',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
      }
    ],
  },
  // Azure App Service Standalone Configuration
  output: 'standalone',
  
  // 本番環境での静的ファイルパス設定
  assetPrefix: '',
  basePath: '',
  
  // 本番環境での静的ファイル配信設定
  publicRuntimeConfig: {
    staticFolder: '/public',
  },
  
  // Azure IIS用設定
  trailingSlash: false,
  compress: false, // IISに圧縮を任せる
  generateEtags: false,
  poweredByHeader: false,
  // セキュリティと静的ファイル配信設定
  async headers() {
    return [
      // 全ページ共通ヘッダー
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
        ],
      },
      // 静的ファイルの強制配信設定
      {
        source: '/images/:path*',
        headers: [
          {
            key: 'Content-Type',
            value: 'image/*',
          },
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400',
          },
        ],
      },
    ]
  },
  
  // リダイレクト設定
  async redirects() {
    return []
  },
}

export default nextConfig
