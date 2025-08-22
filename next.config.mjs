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
  
  experimental: {
    // 有効なオプションのみ
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons'],
  },
  
  webpack: (config, { isServer, dev }) => {
    if (!isServer) {
      config.resolve.fallback = {
        fs: false,
        path: false,
        os: false,
      }
    }
    
    return config
  }
}

export default nextConfig
