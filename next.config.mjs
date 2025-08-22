/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: false,
  output: 'standalone',
  
  // パフォーマンス最適化
  compress: true,
  poweredByHeader: false,
  generateEtags: false,
  
  // メモリ効率化
  swcMinify: true,
  
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
  
  experimental: {
    // 有効なオプションのみ
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons'],
    // メモリ使用量削減
    optimizeCss: true,
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
