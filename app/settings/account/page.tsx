"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PageHeader } from "@/components/page-header"
import BottomNavigation from "@/components/bottom-navigation"
import { User, Mail, Phone, Shield, Bell, Globe } from "lucide-react"
import { useTheme } from "@/contexts/theme-context"

export default function AccountSettingsPage() {
  const router = useRouter()
  const { currentTheme } = useTheme()
  const [accountData, setAccountData] = useState({
    name: "田中 太郎",
    email: "tanaka@example.com",
    phone: "090-1234-5678",
    language: "ja",
    timezone: "Asia/Tokyo",
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    marketingEmails: false,
    twoFactorAuth: false
  })

  const handleSave = () => {
    // アカウント設定保存処理
    console.log("Account settings saved:", accountData)
  }

  const handleDeactivate = () => {
    // アカウント無効化処理
    if (confirm("アカウントを無効化しますか？この操作は取り消せません。")) {
      console.log("Account deactivated")
    }
  }

  return (
    <>
      <div className="min-h-screen bg-gray-50 pb-20">
        <div className="max-w-md mx-auto bg-white">
          <PageHeader 
            title="アカウント設定" 
            subtitle="アカウント情報とプライバシー設定" 
            showBackButton 
          />

          <div className="p-4 space-y-6">
            {/* 基本情報 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  基本情報
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">氏名</Label>
                  <Input
                    id="name"
                    value={accountData.name}
                    onChange={(e) => setAccountData({...accountData, name: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">メールアドレス</Label>
                  <Input
                    id="email"
                    type="email"
                    value={accountData.email}
                    onChange={(e) => setAccountData({...accountData, email: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">電話番号</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={accountData.phone}
                    onChange={(e) => setAccountData({...accountData, phone: e.target.value})}
                  />
                </div>
              </CardContent>
            </Card>

            {/* 地域・言語設定 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="w-5 h-5" />
                  地域・言語設定
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>言語</Label>
                  <Select value={accountData.language} onValueChange={(value) => setAccountData({...accountData, language: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ja">日本語</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="ko">한국어</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>タイムゾーン</Label>
                  <Select value={accountData.timezone} onValueChange={(value) => setAccountData({...accountData, timezone: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Asia/Tokyo">Asia/Tokyo (JST)</SelectItem>
                      <SelectItem value="Asia/Seoul">Asia/Seoul (KST)</SelectItem>
                      <SelectItem value="America/New_York">America/New_York (EST)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* 通知設定 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="w-5 h-5" />
                  通知設定
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>メール通知</Label>
                    <p className="text-sm text-gray-500">予約確認や重要なお知らせをメールで受け取る</p>
                  </div>
                  <Switch
                    checked={accountData.emailNotifications}
                    onCheckedChange={(checked) => setAccountData({...accountData, emailNotifications: checked})}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>プッシュ通知</Label>
                    <p className="text-sm text-gray-500">アプリからの通知を受け取る</p>
                  </div>
                  <Switch
                    checked={accountData.pushNotifications}
                    onCheckedChange={(checked) => setAccountData({...accountData, pushNotifications: checked})}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>SMS通知</Label>
                    <p className="text-sm text-gray-500">緊急時にSMSで通知を受け取る</p>
                  </div>
                  <Switch
                    checked={accountData.smsNotifications}
                    onCheckedChange={(checked) => setAccountData({...accountData, smsNotifications: checked})}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>マーケティングメール</Label>
                    <p className="text-sm text-gray-500">キャンペーンや新サービスの案内を受け取る</p>
                  </div>
                  <Switch
                    checked={accountData.marketingEmails}
                    onCheckedChange={(checked) => setAccountData({...accountData, marketingEmails: checked})}
                  />
                </div>
              </CardContent>
            </Card>

            {/* セキュリティ */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  セキュリティ
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>二段階認証</Label>
                    <p className="text-sm text-gray-500">追加のセキュリティ層でアカウントを保護</p>
                  </div>
                  <Switch
                    checked={accountData.twoFactorAuth}
                    onCheckedChange={(checked) => setAccountData({...accountData, twoFactorAuth: checked})}
                  />
                </div>
                <Button variant="outline" className="w-full">
                  パスワードを変更
                </Button>
              </CardContent>
            </Card>

            {/* アクション */}
            <div className="space-y-3">
              <Button onClick={handleSave} className="w-full">
                設定を保存
              </Button>
              <Button variant="outline" className="w-full">
                データをエクスポート
              </Button>
              <Button 
                variant="destructive" 
                className="w-full"
                onClick={handleDeactivate}
              >
                アカウントを無効化
              </Button>
            </div>
          </div>
        </div>
      </div>
      <BottomNavigation />
    </>
  )
}
