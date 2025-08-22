import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/contexts/theme-context"
import { ProfileProvider } from "@/contexts/profile-context"
import { AuthProvider } from "@/contexts/auth-context"

const inter = Inter({ 
  subsets: ["latin"],
  display: 'swap',
  preload: true,
  // フォント最適化
  variable: '--font-inter',
  fallback: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
  adjustFontFallback: false,
})

export const metadata: Metadata = {
  title: "ImabariOne",
  description: "愛犬と飼い主のための総合サポートアプリ",
  generator: 'v0.app',
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <style dangerouslySetInnerHTML={{
          __html: `
            /* Critical CSS - 最優先で適用 */
            * { box-sizing: border-box; margin: 0; padding: 0; }
            html { font-size: 16px; line-height: 1.5; }
            body { 
              min-height: 100vh; 
              background-color: #ffffff !important; 
              color: #001126 !important; 
              font-family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif !important;
              font-weight: 400;
              line-height: 1.6;
              -webkit-font-smoothing: antialiased;
              -moz-osx-font-smoothing: grayscale;
            }
          `
        }} />
      </head>
      <body className={`${inter.className} min-h-screen bg-white text-gray-900`}>
        <AuthProvider>
          <ProfileProvider>
            <ThemeProvider>
              <div className="pb-16 min-h-screen bg-white">{children}</div>
            </ThemeProvider>
          </ProfileProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
