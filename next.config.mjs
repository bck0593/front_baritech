/** @type {import('next').NextConfig} */
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    domains: ['app-002-gen10-step3-2-node-oshima13.azurewebsites.net', 'localhost'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'app-002-gen10-step3-2-node-oshima13.azurewebsites.net',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
      }
    ],
    loader: 'default',
    formats: ['image/webp', 'image/avif'],
  },
  // Azure App Service対応
  output: 'standalone',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/' : '',
  basePath: '',
  // 本番環境での静的ファイル配信を強制
  publicRuntimeConfig: {
    staticFolder: '/public',
  },
  // 静的ファイルの最適化とキャッシュ無効化
  compress: true,
  // Azureでの静的ファイル配信を強制
  generateEtags: false,
  poweredByHeader: false,
  // トレーリングスラッシュを無効化
  trailingSlash: false,
  // Webpack設定でパス解決を強化
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // パス解決の設定を強化
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname),
      '@/components': path.resolve(__dirname, 'components'),
      '@/lib': path.resolve(__dirname, 'lib'),
      '@/hooks': path.resolve(__dirname, 'hooks'),
      '@/contexts': path.resolve(__dirname, 'contexts'),
      '@/styles': path.resolve(__dirname, 'styles'),
      '@/public': path.resolve(__dirname, 'public'),
      '@/app': path.resolve(__dirname, 'app'),
    };
    
    // モジュール解決の設定
    config.resolve.modules = [
      path.resolve(__dirname),
      path.resolve(__dirname, 'node_modules'),
      'node_modules'
    ];

    return config;
  },
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
          // キャッシュを無効化してスタイルの問題を解決
          {
            key: 'Cache-Control',
            value: 'no-cache, no-store, must-revalidate',
          },
        ],
      },
      // 静的アセットの配信を強制
      {
        source: '/_next/static/(.*)',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/javascript; charset=utf-8',
          },
          {
            key: 'Cache-Control',
            value: 'no-cache, no-store, must-revalidate',
          },
        ],
      },
      {
        source: '/images/(.*)',
        headers: [
          {
            key: 'Content-Type',
            value: 'image/*',
          },
          {
            key: 'Cache-Control',
            value: 'no-cache, no-store, must-revalidate',
          },
        ],
      },
      // CSS ファイルの配信を強制
      {
        source: '/_next/static/css/(.*)',
        headers: [
          {
            key: 'Content-Type',
            value: 'text/css; charset=utf-8',
          },
          {
            key: 'Cache-Control',
            value: 'no-cache, no-store, must-revalidate',
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
