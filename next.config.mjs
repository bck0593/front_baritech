/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: false,
  output: 'standalone',
  
  // パフォーマンス最適化
  compress: true,
  poweredByHeader: false,
  generateEtags: false,
  
  // サーバー最適化（Next.js 15対応）
  serverExternalPackages: ['fs-extra'],
  
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  
  // Azure App Service最適化
  trailingSlash: false,
  
  experimental: {
    // 有効なオプションのみ
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons'],
    // デプロイメント最適化
    outputFileTracingRoot: process.cwd(),
  },
  
  webpack: (config, { isServer, dev }) => {
    if (!isServer) {
      config.resolve.fallback = {
        fs: false,
        path: false,
        os: false,
      }
    }
    
    // メモリ効率化の設定
    config.optimization = {
      ...config.optimization,
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
          },
        },
      },
    }
    
    return config
  }
}

export default nextConfig
