"use client"

import type React from "react"

import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertTriangle, Home } from "lucide-react"

interface AdminGuardProps {
  children: React.ReactNode
  requiredRole?: "admin" | "super_admin"
}

export function AdminGuard({ children, requiredRole = "admin" }: AdminGuardProps) {
  const { user, isLoading, hasPermission } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login?redirect=/admin")
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-96">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-gray-600">認証情報を確認中...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!user) {
    return null // リダイレクト中
  }

  if (!hasPermission(requiredRole)) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-96">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <AlertTriangle className="h-12 w-12 text-red-500 mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">アクセス権限がありません</h2>
            <p className="text-gray-600 text-center mb-6">
              このページにアクセスするには{requiredRole === "super_admin" ? "スーパー管理者" : "管理者"}権限が必要です。
            </p>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => router.push("/")}>
                <Home className="w-4 h-4 mr-2" />
                ホームに戻る
              </Button>
              <Button onClick={() => router.push("/login")}>別のアカウントでログイン</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return <>{children}</>
}
