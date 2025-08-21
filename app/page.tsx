"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Calendar, Camera, QrCode, Bell, MapPin, Settings, User } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ThemedCard, ThemedCardHeader, CardContent, CardTitle } from "@/components/themed-card"
import { ThemedButton } from "@/components/themed-button"
import dynamic from "next/dynamic"
import { useTheme } from "@/contexts/theme-context"
import { useAuth } from "@/contexts/auth-context"
import { BookingService } from "@/lib/api-services"
import { Booking } from "@/lib/types"
import BottomNavigation from "@/components/bottom-navigation"

const PhotoSlider = dynamic(() => import("@/components/photo-slider").then(mod => ({ default: mod.PhotoSlider })), {
  ssr: false,
  loading: () => <div className="w-full h-[280px] bg-gray-200 flex items-center justify-center">Loading...</div>
})

export default function HomePage() {
  const router = useRouter()
  const { currentTheme } = useTheme()
  const { userProfile, isLoading: authLoading } = useAuth()
  const [nextBooking, setNextBooking] = useState<Booking | null>(null)
  const [isLoadingBooking, setIsLoadingBooking] = useState(true)
  const [isMounted, setIsMounted] = useState(false)

  // クライアントサイドマウント後にtrueに設定
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // 次回予約を取得
  useEffect(() => {
    const fetchNextBooking = async () => {
      try {
        setIsLoadingBooking(true)
        const response = await BookingService.getNextBooking()
        if (response.success && response.data) {
          setNextBooking(response.data)
        }
      } catch (error) {
        console.error('Error fetching next booking:', error)
      } finally {
        setIsLoadingBooking(false)
      }
    }

    fetchNextBooking()
  }, [])

  return (
    <div className="max-w-md mx-auto">
      <div
        className="min-h-screen bg-white"
      >
      {/* Header */}
      <header className="bg-white shadow-sm border-b" style={{ borderColor: 'var(--pantone-blue-200)' }}>
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <img
                src="/imabarione.png"
                alt="imabari one"
                className="h-12 w-auto max-w-[220px] object-contain"
                onError={(e) => {
                  console.error('Logo failed to load:', e)
                  e.currentTarget.style.display = 'none'
                }}
                onLoad={() => console.log('Logo loaded successfully')}
              />
            </div>
            <div className="flex items-center space-x-3">
              <button 
                onClick={() => router.push("/notifications")}
                className="p-2 rounded-full hover:bg-opacity-10 transition-colors relative"
                style={{ 
                  color: 'var(--pantone-blue-600)',
                  backgroundColor: 'transparent'
                }}
              >
                <Bell className="w-5 h-5" />
                <div 
                  className="absolute -top-1 -right-1 w-3 h-3 rounded-full"
                  style={{ backgroundColor: 'rgb(255, 235, 0)' }}
                ></div>
              </button>
              <button 
                onClick={() => router.push("/mypage")}
                className="p-2 rounded-full hover:bg-opacity-10 transition-colors"
                style={{ 
                  color: 'var(--pantone-blue-600)',
                  backgroundColor: 'transparent'
                }}
              >
                <User className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Photo Slider */}
      <PhotoSlider className="w-full" />

      <div className="max-w-md mx-auto px-4 py-4 space-y-4">
        {/* Welcome Section */}
        <div className="text-center">
          <h2 className="text-lg font-heading font-semibold mb-1 tracking-tight" style={{ color: 'var(--pantone-blue-800)' }}>
            {isMounted ? (
              <>おかえりなさい、{userProfile?.user.name || 'ゲスト'}さん</>
            ) : (
              <>おかえりなさい、ゲストさん</>
            )}
          </h2>
          <p className="text-sm font-body" style={{ color: 'var(--pantone-blue-600)' }}>
            {isMounted ? (
              <>{userProfile?.primaryDog?.name || 'ワンちゃん'}と素敵な一日を過ごしましょう</>
            ) : (
              <>ワンちゃんと素敵な一日を過ごしましょう</>
            )}
          </p>
        </div>

        {/* Dog Profile Card */}
        {isMounted ? (
          userProfile?.primaryDog ? (
            <ThemedCard variant="primary">
              <CardContent className="pt-3 pb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm">
                    <img
                      src={userProfile.primaryDog.avatar || "/placeholder.svg?height=48&width=48"}
                      alt={userProfile.primaryDog.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-heading font-semibold text-sm tracking-tight" style={{ color: 'rgb(0, 50, 115)' }}>
                      {userProfile.primaryDog.name}
                    </h3>
                    <p className="text-xs font-body" style={{ color: 'rgb(0, 50, 115)' }}>
                      {userProfile.primaryDog.breed || '犬種不明'} • {userProfile.primaryDog.birthdate ? 
                        new Date().getFullYear() - new Date(userProfile.primaryDog.birthdate).getFullYear() : '?'}歳
                    </p>
                  </div>
                  {/* 選択中バッジ */}
                  <div>
                    <Badge 
                      variant="secondary" 
                      className="text-xs px-2 py-0.5 bg-green-500 text-white border-0 shadow-sm font-body font-medium"
                    >
                      選択中
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </ThemedCard>
          ) : authLoading ? (
            <ThemedCard variant="primary">
              <CardContent className="pt-3 pb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gray-200 rounded-full animate-pulse"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded animate-pulse mb-1"></div>
                    <div className="h-3 bg-gray-200 rounded animate-pulse w-2/3"></div>
                  </div>
                </div>
              </CardContent>
            </ThemedCard>
          ) : (
            <ThemedCard variant="primary">
              <CardContent className="pt-3 pb-3 text-center">
                <p className="text-sm text-gray-600">愛犬情報が見つかりません</p>
                <button 
                  onClick={() => router.push("/register/dog-profile")}
                  className="mt-2 text-xs text-blue-600 underline"
                >
                  愛犬を登録する
                </button>
              </CardContent>
            </ThemedCard>
          )
        ) : (
          // SSR用の初期表示
          <ThemedCard variant="primary">
            <CardContent className="pt-3 pb-3">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded mb-1"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </div>
              </div>
            </CardContent>
          </ThemedCard>
        )}

        {/* Next Reservation */}
        <div style={{ border: '2px solid rgb(0, 50, 115)', borderRadius: '0.625rem', overflow: 'hidden', backgroundColor: '#ffffff' }}>
          <div 
            style={{ 
              backgroundColor: 'rgb(0, 50, 115)', 
              color: '#ffffff',
              padding: '16px',
              margin: '0'
            }}
          >
            <CardTitle className="text-base flex items-center" style={{ color: '#ffffff', margin: '0', padding: '0' }}>
              <Calendar className="w-4 h-4 mr-2" style={{ color: '#ffffff' }} />
              次回のご予約
            </CardTitle>
          </div>
          <div style={{ padding: '16px' }}>
            {!isMounted || isLoadingBooking ? (
              <div className="p-4 rounded-lg text-center" style={{ backgroundColor: '#ffffff' }}>
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 mx-auto mb-2" style={{ borderColor: 'rgb(0, 50, 115)' }}></div>
                <p className="text-sm" style={{ color: 'rgb(0, 50, 115)' }}>予約情報を読み込み中...</p>
              </div>
            ) : nextBooking ? (
              <div className="p-4 rounded-lg" style={{ backgroundColor: '#ffffff' }}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold mb-2" style={{ color: 'rgb(0, 50, 115)' }}>
                      {nextBooking.service_type}（1日コース）
                    </h3>
                    <div className="space-y-1 text-sm" style={{ color: 'rgb(0, 50, 115)' }}>
                      <div className="flex items-center">
                        <Calendar className="w-3 h-3 mr-1" style={{ color: 'rgb(0, 50, 115)' }} />
                        {new Date(nextBooking.booking_date).toLocaleDateString('ja-JP', {
                          month: 'long',
                          day: 'numeric',
                          weekday: 'short'
                        })} {nextBooking.booking_time}
                      </div>
                      {nextBooking.dog?.name && (
                        <div className="text-xs" style={{ color: 'rgb(0, 50, 115)' }}>
                          愛犬: {nextBooking.dog.name}
                        </div>
                      )}
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
            ) : (
              <div className="p-4 rounded-lg text-center" style={{ backgroundColor: '#ffffff' }}>
                <Calendar className="w-8 h-8 mx-auto mb-2" style={{ color: 'rgb(0, 50, 115)' }} />
                <p className="text-sm mb-2" style={{ color: 'rgb(0, 50, 115)' }}>次回の予約はありません</p>
                <ThemedButton 
                  size="sm" 
                  variant="primary"
                  onClick={() => router.push("/booking")}
                >
                  予約を作成
                </ThemedButton>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3">
          <ThemedCard
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => router.push("/checkin")}
          >
            <CardContent className="pt-4 text-center">
              <QrCode className="w-8 h-8 mx-auto mb-2" style={{ color: 'rgb(255, 235, 0)' }} />
              <h3 className="font-medium text-sm" style={{ color: 'var(--pantone-blue-800)' }}>QRチェックイン</h3>
              <p className="text-xs mt-1" style={{ color: 'var(--pantone-blue-600)' }}>施設利用の記録</p>
            </CardContent>
          </ThemedCard>

          <ThemedCard
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => router.push("/diary")}
          >
            <CardContent className="pt-4 text-center">
              <Camera className="w-8 h-8 mx-auto mb-2" style={{ color: 'rgb(255, 235, 0)' }} />
              <h3 className="font-medium text-sm" style={{ color: 'var(--pantone-blue-800)' }}>今日の保育記録</h3>
              <p className="text-xs mt-1" style={{ color: 'var(--pantone-blue-600)' }}>写真と日記を確認</p>
            </CardContent>
          </ThemedCard>
        </div>

        {/* ASICS Logo Section */}
        <div className="flex justify-center py-6">
          <div className="relative">
            <img
              src="/images/logo_asics.png"
              alt="ASICS SATOYAMA STADIUM"
              className="h-24 w-auto opacity-90 hover:opacity-100 transition-opacity duration-300"
            />
          </div>
        </div>
      </div>
      </div>
      <BottomNavigation />
    </div>
  )
}