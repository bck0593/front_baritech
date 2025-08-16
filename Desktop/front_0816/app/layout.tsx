import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/contexts/theme-context"
import { BottomNavigation } from "@/components/bottom-navigation"
import { ProfileProvider } from "@/contexts/profile-context"
import { AuthProvider } from "@/contexts/auth-context"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "DogMATEs - FC今治 里山ドッグラン",
  description: "愛犬と飼い主のための総合サポートアプリ",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body className={inter.className}>
        <AuthProvider>
          <ProfileProvider>
            <ThemeProvider>
              <div className="pb-16">{children}</div>
              <BottomNavigation />
            </ThemeProvider>
          </ProfileProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
