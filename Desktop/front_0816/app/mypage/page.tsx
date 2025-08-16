"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { User, FileText, Settings, Bell, ChevronRight, Heart, Award, ArrowLeft } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ThemedCard, CardContent } from "@/components/themed-card"
import { ThemedButton } from "@/components/themed-button"
import { useTheme } from "@/contexts/theme-context"

export default function MyPage() {
  const router = useRouter()
  const { currentTheme } = useTheme()
  const [activeTab, setActiveTab] = useState("profile")

  const profileItems = [
    {
      icon: User,
      title: "基本情報",
      description: "飼い主・愛犬の基本情報",
      href: "/profile",
    },
    {
      icon: Heart,
      title: "健康管理",
      description: "ワクチン・健康診断記録",
      href: "/profile/health",
    },
    {
      icon: Award,
      title: "資格・証明書",
      description: "狂犬病予防接種証明書など",
      href: "/profile/certificates",
    },
  ]

  const recordItems = [
    {
      icon: FileText,
      title: "記録",
      description: "保育記録の確認・管理",
      href: "/mypage/contact-book",
      badge: "更新あり",
    },
  ]

  const settingsItems = [
    {
      icon: Settings,
      title: "アプリ設定",
      description: "テーマ・表示設定",
      href: "/settings",
    },
    {
      icon: User,
      title: "アカウント設定",
      description: "パスワード・メール設定",
      href: "/settings/account",
    },
  ]

  const notificationItems = [
    {
      icon: Bell,
      title: "通知設定",
      description: "プッシュ通知・メール通知",
      href: "/notifications",
    },
  ]

  return (
    <div className="max-w-md mx-auto">
      <div
        className="min-h-screen"
        style={{
          background: `linear-gradient(to bottom, ${currentTheme.primary[50]}, white)`,
        }}
      >
      {/* Header */}
      <header className="bg-white shadow-sm border-b" style={{ borderColor: currentTheme.primary[100] }}>
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => router.back()}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <h1 className="text-lg font-bold" style={{ color: currentTheme.primary[800] }}>
                マイページ
              </h1>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-md mx-auto px-4 py-6">
        {/* User Profile Card */}
        <ThemedCard variant="primary" className="mb-6">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-4">
              <Avatar className="w-16 h-16">
                <AvatarImage src="/placeholder.svg?height=64&width=64" />
                <AvatarFallback
                  style={{ backgroundColor: currentTheme.primary[100], color: currentTheme.primary[700] }}
                  className="text-lg"
                >
                  田
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h2 className="text-lg font-semibold text-gray-800">田中 太郎</h2>
                <p className="text-sm text-gray-600">ポチくんの飼い主</p>
                <div className="flex items-center space-x-2 mt-2">
                  <Badge
                    style={{ backgroundColor: currentTheme.accent[100], color: currentTheme.accent[700] }}
                    className="text-xs"
                  >
                    プレミアム会員
                  </Badge>
                  <Badge
                    style={{ backgroundColor: currentTheme.primary[100], color: currentTheme.primary[700] }}
                    className="text-xs"
                  >
                    利用歴2年
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </ThemedCard>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="profile">プロフィール</TabsTrigger>
            <TabsTrigger value="records">記録</TabsTrigger>
            <TabsTrigger value="settings">設定</TabsTrigger>
            <TabsTrigger value="notifications">通知</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-4 mt-6">
            {profileItems.map((item, index) => (
              <ThemedCard
                key={index}
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => router.push(item.href)}
              >
                <CardContent className="flex items-center justify-between p-4">
                  <div className="flex items-center space-x-3">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: currentTheme.primary[100] }}
                    >
                      <item.icon className="w-5 h-5" style={{ color: currentTheme.primary[600] }} />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-800">{item.title}</h3>
                      <p className="text-sm text-gray-600">{item.description}</p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </CardContent>
              </ThemedCard>
            ))}
          </TabsContent>

          <TabsContent value="records" className="space-y-4 mt-6">
            {recordItems.map((item, index) => (
              <ThemedCard
                key={index}
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => router.push(item.href)}
              >
                <CardContent className="flex items-center justify-between p-4">
                  <div className="flex items-center space-x-3">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: currentTheme.accent[100] }}
                    >
                      <item.icon className="w-5 h-5" style={{ color: currentTheme.accent[600] }} />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-800">{item.title}</h3>
                      <p className="text-sm text-gray-600">{item.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {item.badge && (
                      <Badge
                        style={{ backgroundColor: currentTheme.accent[100], color: currentTheme.accent[700] }}
                        className="text-xs"
                      >
                        {item.badge}
                      </Badge>
                    )}
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </div>
                </CardContent>
              </ThemedCard>
            ))}
          </TabsContent>

          <TabsContent value="settings" className="space-y-4 mt-6">
            {settingsItems.map((item, index) => (
              <ThemedCard
                key={index}
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => router.push(item.href)}
              >
                <CardContent className="flex items-center justify-between p-4">
                  <div className="flex items-center space-x-3">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: currentTheme.primary[100] }}
                    >
                      <item.icon className="w-5 h-5" style={{ color: currentTheme.primary[600] }} />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-800">{item.title}</h3>
                      <p className="text-sm text-gray-600">{item.description}</p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </CardContent>
              </ThemedCard>
            ))}
          </TabsContent>

          <TabsContent value="notifications" className="space-y-4 mt-6">
            {notificationItems.map((item, index) => (
              <ThemedCard
                key={index}
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => router.push(item.href)}
              >
                <CardContent className="flex items-center justify-between p-4">
                  <div className="flex items-center space-x-3">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: currentTheme.accent[100] }}
                    >
                      <item.icon className="w-5 h-5" style={{ color: currentTheme.accent[600] }} />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-800">{item.title}</h3>
                      <p className="text-sm text-gray-600">{item.description}</p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </CardContent>
              </ThemedCard>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </div>
    </div>
  )
}
