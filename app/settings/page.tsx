"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { PageHeader } from "@/components/page-header"
import BottomNavigation from "@/components/bottom-navigation"
import { Bell, Shield, Palette, HelpCircle, LogOut, ChevronRight } from "lucide-react"
import { useTheme } from "@/contexts/theme-context"

export default function SettingsPage() {
  const router = useRouter()
  const { currentTheme } = useTheme()
  const [notifications, setNotifications] = useState({
    push: true,
    email: false,
    sms: true,
    marketing: false,
  })

  const handleLogout = () => {
    // ログアウト処理
    console.log("Logging out...")
    router.push("/login")
  }

  return (
    <>
      <div className="min-h-screen bg-gray-50 pb-20">
        <div className="max-w-md mx-auto bg-white">
        <PageHeader title="設定" subtitle="アプリの設定を管理" showBackButton />

        <div className="p-4 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5" style={{ color: currentTheme.primary[600] }} />
                通知設定
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="push-notifications">プッシュ通知</Label>
                <Switch
                  id="push-notifications"
                  checked={notifications.push}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, push: checked })}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="email-notifications">メール通知</Label>
                <Switch
                  id="email-notifications"
                  checked={notifications.email}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, email: checked })}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="sms-notifications">SMS通知</Label>
                <Switch
                  id="sms-notifications"
                  checked={notifications.sms}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, sms: checked })}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="marketing-notifications">マーケティング通知</Label>
                <Switch
                  id="marketing-notifications"
                  checked={notifications.marketing}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, marketing: checked })}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" style={{ color: currentTheme.primary[600] }} />
                プライバシー・セキュリティ
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="ghost" className="w-full justify-between">
                <span>パスワード変更</span>
                <ChevronRight className="w-4 h-4" />
              </Button>
              <Button variant="ghost" className="w-full justify-between">
                <span>二段階認証</span>
                <ChevronRight className="w-4 h-4" />
              </Button>
              <Button variant="ghost" className="w-full justify-between">
                <span>プライバシー設定</span>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="w-5 h-5" style={{ color: currentTheme.primary[600] }} />
                表示設定
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Button variant="ghost" className="w-full justify-between" onClick={() => router.push("/theme-settings")}>
                <span>テーマ設定</span>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HelpCircle className="w-5 h-5" style={{ color: currentTheme.primary[600] }} />
                サポート
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="ghost" className="w-full justify-between" onClick={() => router.push("/help")}>
                <span>ヘルプ・FAQ</span>
                <ChevronRight className="w-4 h-4" />
              </Button>
              <Button variant="ghost" className="w-full justify-between">
                <span>お問い合わせ</span>
                <ChevronRight className="w-4 h-4" />
              </Button>
              <Button variant="ghost" className="w-full justify-between">
                <span>利用規約</span>
                <ChevronRight className="w-4 h-4" />
              </Button>
              <Button variant="ghost" className="w-full justify-between">
                <span>プライバシーポリシー</span>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <Button
                variant="outline"
                onClick={handleLogout}
                className="w-full text-red-600 border-red-200 hover:bg-red-50 bg-transparent"
              >
                <LogOut className="w-4 h-4 mr-2" />
                ログアウト
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
    <BottomNavigation />
    </>
  )
}
