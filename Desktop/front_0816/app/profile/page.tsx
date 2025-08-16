"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { PageHeader } from "@/components/page-header"
import { User, Camera, Save } from "lucide-react"
import { useTheme } from "@/contexts/theme-context"

export default function ProfilePage() {
  const router = useRouter()
  const { currentTheme } = useTheme()
  const [isEditing, setIsEditing] = useState(false)
  const [profile, setProfile] = useState({
    name: "田中 太郎",
    email: "tanaka@example.com",
    phone: "090-1234-5678",
    address: "東京都新宿区...",
    bio: "愛犬のルイと一緒に楽しい毎日を過ごしています。",
    avatar: "/placeholder.svg?height=80&width=80",
  })

  const handleSave = () => {
    // プロフィール保存処理
    setIsEditing(false)
    console.log("Profile saved:", profile)
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="max-w-md mx-auto bg-white">
        <PageHeader title="プロフィール" subtitle="アカウント情報の管理" showBackButton />

        <div className="p-4 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <User className="w-5 h-5" style={{ color: currentTheme.primary[600] }} />
                  基本情報
                </div>
                <Button variant="outline" size="sm" onClick={() => setIsEditing(!isEditing)}>
                  {isEditing ? "キャンセル" : "編集"}
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Avatar className="w-20 h-20">
                    <AvatarImage src={profile.avatar || "/placeholder.svg"} />
                    <AvatarFallback>{profile.name[0]}</AvatarFallback>
                  </Avatar>
                  {isEditing && (
                    <Button
                      size="sm"
                      className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0"
                      style={{ backgroundColor: currentTheme.primary[600] }}
                    >
                      <Camera className="w-4 h-4" />
                    </Button>
                  )}
                </div>
                <div className="flex-1">
                  {isEditing ? (
                    <Input
                      value={profile.name}
                      onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                      placeholder="お名前"
                    />
                  ) : (
                    <h3 className="text-lg font-bold">{profile.name}</h3>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="email">メールアドレス</Label>
                  {isEditing ? (
                    <Input
                      id="email"
                      type="email"
                      value={profile.email}
                      onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    />
                  ) : (
                    <p className="text-sm text-gray-600 mt-1">{profile.email}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="phone">電話番号</Label>
                  {isEditing ? (
                    <Input
                      id="phone"
                      type="tel"
                      value={profile.phone}
                      onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    />
                  ) : (
                    <p className="text-sm text-gray-600 mt-1">{profile.phone}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="address">住所</Label>
                  {isEditing ? (
                    <Input
                      id="address"
                      value={profile.address}
                      onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                    />
                  ) : (
                    <p className="text-sm text-gray-600 mt-1">{profile.address}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="bio">自己紹介</Label>
                  {isEditing ? (
                    <Textarea
                      id="bio"
                      value={profile.bio}
                      onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                      rows={3}
                    />
                  ) : (
                    <p className="text-sm text-gray-600 mt-1">{profile.bio}</p>
                  )}
                </div>
              </div>

              {isEditing && (
                <Button onClick={handleSave} className="w-full" style={{ backgroundColor: currentTheme.primary[600] }}>
                  <Save className="w-4 h-4 mr-2" />
                  保存
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
