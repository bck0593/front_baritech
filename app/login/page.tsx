"use client"

import type React from "react"
import { Suspense, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff, LogIn } from "lucide-react"
import Image from "next/image"

function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const { login } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get("redirect") || "/"

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const success = await login(email, password)
      if (success) {
        if (email === "admin@example.com") {
          router.push("/admin")
        } else {
          router.push(redirectTo)
        }
      } else {
        setError("メールアドレスまたはパスワードが正しくありません")
      }
    } catch (err) {
      setError("ログインに失敗しました。もう一度お試しください。")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        {/* ロゴ画像 */}
        <div className="flex justify-center mb-6">
          <Image
            src="/imabarione.png"
            alt="イマバリワン ロゴ"
            width={200}
            height={80}
            className="object-contain"
            priority
          />
        </div>
        <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
          <LogIn className="w-6 h-6 text-blue-600" />
        </div>
        <CardTitle className="text-2xl font-bold">ログイン</CardTitle>
        <p className="text-gray-600">アカウントにサインインしてください</p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">メールアドレス</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@example.com"
              required
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">パスワード</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="パスワードを入力"
                required
                disabled={isLoading}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-gray-400" />
                ) : (
                  <Eye className="h-4 w-4 text-gray-400" />
                )}
              </Button>
            </div>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Button
            type="submit"
            className="w-full font-bold text-white"
            style={{ 
              fontSize: "1rem", 
              padding: "0.75rem 0",
              backgroundColor: "rgb(0, 50, 115)",
              borderColor: "rgb(0, 50, 115)"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "rgb(0, 40, 95)"
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "rgb(0, 50, 115)"
            }}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                ログイン中...
              </>
            ) : (
              "ログイン"
            )}
          </Button>
          <Button
            type="button"
            className="w-full mt-4 font-bold text-white text-sm"
            onClick={() => router.push("/register")}
            style={{ 
              padding: "0.75rem 0",
              backgroundColor: "rgb(0, 50, 115)",
              borderColor: "rgb(0, 50, 115)"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "rgb(0, 40, 95)"
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "rgb(0, 50, 115)"
            }}
          >
            アカウントをお持ちでない方はこちら
          </Button>
        </form>

        {/* クイックログイン */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-medium text-blue-900 mb-2">クイックログイン</h3>
          <div className="flex flex-col gap-2">
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => {
                setEmail("tanaka@example.com");
                setPassword("password123");
              }}
              disabled={isLoading}
            >
              一般ユーザーの情報を入力
            </Button>
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => {
                setEmail("admin@example.com");
                setPassword("admin123");
              }}
              disabled={isLoading}
            >
              管理者の情報を入力
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <Suspense fallback={<div>Loading...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  )
}
