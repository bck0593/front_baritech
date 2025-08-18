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
  },
  // Azure App Service対応
  output: 'standalone',
  // 静的ファイルの最適化
  compress: true,
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
