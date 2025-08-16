"use client"
import { useRouter } from "next/navigation"
import { Calendar, Camera, QrCode, Bell, MapPin, Settings } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ThemedCard, ThemedCardHeader, CardContent, CardTitle } from "@/components/themed-card"
import { ThemedButton } from "@/components/themed-button"
import { useTheme } from "@/contexts/theme-context"

export default function HomePage() {
  const router = useRouter()
  const { currentTheme } = useTheme()

  return (
    <div className="max-w-md mx-auto">
      <div
        className="min-h-screen"
        style={{
          background: `linear-gradient(to bottom, var(--pantone-blue-50), white, var(--pantone-yellow-50))`,
        }}
      >
      {/* Header */}
      <header className="bg-white shadow-sm border-b" style={{ borderColor: 'var(--pantone-blue-200)' }}>
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-bold" style={{ color: 'var(--pantone-blue-800)' }}>
                DogMATEs
              </h1>
              <p className="text-xs" style={{ color: 'var(--pantone-blue-600)' }}>FC今治 里山ドッグラン</p>
            </div>
            <div className="flex items-center space-x-3">
              <button 
                onClick={() => router.push("/theme-settings")}
                className="p-2 rounded-full hover:bg-opacity-10 transition-colors"
                style={{ 
                  color: 'var(--pantone-blue-600)',
                  backgroundColor: 'transparent'
                }}
              >
                <Settings className="w-5 h-5" />
              </button>
              <button 
                className="p-2 rounded-full hover:bg-opacity-10 transition-colors relative"
                style={{ 
                  color: 'var(--pantone-blue-600)',
                  backgroundColor: 'transparent'
                }}
              >
                <Bell className="w-5 h-5" />
                <div 
                  className="absolute -top-1 -right-1 w-3 h-3 rounded-full"
                  style={{ backgroundColor: 'var(--pantone-yellow-500)' }}
                ></div>
              </button>
              <button 
                onClick={() => router.push("/mypage")}
                className="p-1 rounded-full hover:bg-opacity-10 transition-colors"
                style={{ backgroundColor: 'transparent' }}
              >
                <Avatar className="w-8 h-8 ring-2 ring-pantone-blue-200">
                  <AvatarImage src="/placeholder.svg?height=32&width=32" />
                  <AvatarFallback
                    style={{ backgroundColor: 'var(--pantone-blue-100)', color: 'var(--pantone-blue-700)' }}
                    className="text-xs font-semibold"
                  >
                    田
                  </AvatarFallback>
                </Avatar>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-md mx-auto px-4 py-6 space-y-6">
        {/* Welcome Section */}
        <div className="text-center">
          <h2 className="text-lg font-semibold mb-1" style={{ color: 'var(--pantone-blue-800)' }}>おかえりなさい、田中さん</h2>
          <p className="text-sm" style={{ color: 'var(--pantone-blue-600)' }}>ポチくんと素敵な一日を過ごしましょう</p>
        </div>

        {/* Dog Profile Card */}
        <ThemedCard variant="primary">
          <CardContent className="pt-4">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm">
                <img
                  src="/placeholder.svg?height=60&width=60"
                  alt="ポチくん"
                  className="w-14 h-14 rounded-full object-cover"
                />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold" style={{ color: 'var(--pantone-blue-800)' }}>ポチくん</h3>
                <p className="text-sm" style={{ color: 'var(--pantone-blue-600)' }}>ゴールデンレトリバー • 3歳</p>
              </div>
            </div>
          </CardContent>
        </ThemedCard>

        {/* Next Reservation */}
        <ThemedCard variant="accent">
          <ThemedCardHeader variant="accent">
            <CardTitle className="text-base flex items-center">
              <Calendar className="w-4 h-4 mr-2" />
              次回のご予約
            </CardTitle>
          </ThemedCardHeader>
          <CardContent>
            <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--pantone-yellow-50)' }}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold mb-2" style={{ color: 'var(--pantone-blue-800)' }}>犬の保育園（1日コース）</h3>
                  <div className="space-y-1 text-sm" style={{ color: 'var(--pantone-blue-600)' }}>
                    <div className="flex items-center">
                      <Calendar className="w-3 h-3 mr-1" />
                      8月15日（木）9:00 - 17:00
                    </div>
                  </div>
                  <div className="flex space-x-2 mt-3">
                    <ThemedButton 
                      size="sm" 
                      variant="primary"
                      onClick={() => router.push("/booking-detail")}
                    >
                      予約詳細
                    </ThemedButton>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </ThemedCard>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3">
          <ThemedCard
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => router.push("/checkin")}
          >
            <CardContent className="pt-4 text-center">
              <QrCode className="w-8 h-8 mx-auto mb-2" style={{ color: 'var(--pantone-yellow-600)' }} />
              <h3 className="font-medium text-sm" style={{ color: 'var(--pantone-blue-800)' }}>QRチェックイン</h3>
              <p className="text-xs mt-1" style={{ color: 'var(--pantone-blue-600)' }}>施設利用の記録</p>
            </CardContent>
          </ThemedCard>

          <ThemedCard
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => router.push("/diary")}
          >
            <CardContent className="pt-4 text-center">
              <Camera className="w-8 h-8 mx-auto mb-2" style={{ color: 'var(--pantone-blue-600)' }} />
              <h3 className="font-medium text-sm" style={{ color: 'var(--pantone-blue-800)' }}>今日の保育記録</h3>
              <p className="text-xs mt-1" style={{ color: 'var(--pantone-blue-600)' }}>写真と日記を確認</p>
            </CardContent>
          </ThemedCard>
        </div>
      </div>
    </div>
    </div>
  )
}
