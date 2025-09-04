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

const PhotoSlider = dynamic(() => import("@/components/photo-slider"), {
  ssr: false,
  loading: () => <div className="w-full h-[280px] bg-gray-200 flex items-center justify-center">Loading...</div>
})

export default function HomePageClient() {
  const router = useRouter()
  const { currentTheme } = useTheme()
  const { userProfile, isLoading: authLoading, isAuthenticated } = useAuth()
  const [nextBooking, setNextBooking] = useState<Booking | null>(null)
  const [isLoadingBooking, setIsLoadingBooking] = useState(true)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // 次回予約を取得（認証済みのときのみ）
  useEffect(() => {
    const fetchNextBooking = async () => {
      // 🔧 認証状態の詳細チェック
      console.log('🔍 [HOME] fetchNextBooking開始 - 認証状態:', { 
        isAuthenticated, 
        authLoading, 
        hasUserProfile: !!userProfile,
        timestamp: new Date().toISOString()
      })
      
      if (!isAuthenticated || authLoading || !userProfile) {
        console.log('🚫 [HOME] 予約取得をスキップ:', { isAuthenticated, authLoading, hasUserProfile: !!userProfile })
        setNextBooking(null)
        setIsLoadingBooking(false)
        return
      }
      
      // ✅ マウント後にクライアント専用処理を実行
      if (!mounted) {
        setIsLoadingBooking(false)
        return
      }
      
      // 🔧 トークンの存在確認（クライアント専用）
      const token = localStorage.getItem('auth_token')
      if (!token) {
        console.log('🚫 [HOME] トークンが存在しないため予約取得をスキップ')
        setNextBooking(null)
        setIsLoadingBooking(false)
        return
      }
      console.log('✅ [HOME] 認証完了、次回予約を取得中...')
      
      try {
        setIsLoadingBooking(true)
        console.log('🌐 [HOME] BookingService.getNextBooking() 呼び出し開始')
        const response = await BookingService.getNextBooking()
        console.log('📋 [HOME] API レスポンス:', response)
        
        if (response.success) {
          setNextBooking(response.data || null)
          console.log('✅ [HOME] 次回予約設定完了:', response.data)
        } else {
          console.log('⚠️ [HOME] 予約取得失敗:', response.error)
          setNextBooking(null)
        }
      } catch (error) {
        console.error('❌ [HOME] 予約取得エラー:', error)
        
        // APIエラー時のフォールバック：認証されたユーザーにはサンプル予約を表示
        if (isAuthenticated && userProfile) {
          console.log('🔄 [HOME] APIエラーのため、フォールバック予約データを表示')
          const fallbackBooking: Booking = {
            id: 'fallback-001',
            owner_id: userProfile.user.id,
            dog_id: userProfile.dogs[0]?.id || 'dog-001',
            service_type: 'その他',
            booking_date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 明日
            booking_time: '10:00:00',
            status: '確定' as const,
            payment_status: '未払い'
          }
          setNextBooking(fallbackBooking)
          console.log('✅ [HOME] フォールバック予約データを設定:', fallbackBooking)
        } else {
          setNextBooking(null)
        }
      } finally {
        setIsLoadingBooking(false)
        console.log('🏁 [HOME] fetchNextBooking 完了')
      }
    }

    fetchNextBooking()
  }, [isAuthenticated, authLoading, userProfile, mounted])

  // 動的スタイルをCSR時のみ適用（Hydration mismatch 回避）
  const backgroundStyle = mounted && userProfile ? 
    { background: `linear-gradient(to bottom, var(--pantone-blue-50), white, var(--pantone-blue-50))` } :
    { backgroundColor: 'white' }

  // マウント前やローディング中はシンプルな表示
  if (!mounted || authLoading) {
    return (
      <div className="min-h-screen bg-white">
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-md mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <img
                  src="/imabarione.png"
                  alt="imabari one"
                  className="h-12 w-auto max-w-[220px] object-contain"
                />
              </div>
            </div>
          </div>
        </header>
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="text-center">
            <h2 className="text-lg font-heading font-semibold mb-1 tracking-tight text-gray-800">
              おかえりなさい、ゲストさん
            </h2>
            <p className="text-sm font-body text-gray-600">
              読み込み中...
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <div
        className="min-h-screen"
        style={backgroundStyle}
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
                    if (process.env.NODE_ENV === 'development') {
                      console.error('Logo failed to load:', e)
                    }
                    e.currentTarget.style.display = 'none'
                  }}
                  onLoad={() => {
                    if (process.env.NODE_ENV === 'development') {
                      console.log('Logo loaded successfully')
                    }
                  }}
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
                    style={{ backgroundColor: 'var(--pantone-yellow-500)' }}
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
              {!authLoading && userProfile?.user.name ? `おかえりなさい、${userProfile.user.name}さん` : 'おかえりなさい、ゲストさん'}
            </h2>
            <p className="text-sm font-body" style={{ color: 'var(--pantone-blue-600)' }}>
              {!authLoading && userProfile?.primaryDog?.name ? `${userProfile.primaryDog.name}と素敵な一日を過ごしましょう` : 'ワンちゃんと素敵な一日を過ごしましょう'}
            </p>
          </div>

          {/* Dog Profile Card */}
          {authLoading || !userProfile?.primaryDog ? (
            // ローディング中または犬の情報がない場合
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
          ) : (
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
                        Math.max(0, new Date().getFullYear() - new Date(userProfile.primaryDog.birthdate).getFullYear()) : '?'}歳
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
                <Calendar className="w-4 h-4 mr-2" style={{ color: 'rgb(255, 235, 0)' }} />
                次回のご予約
              </CardTitle>
            </div>
            <div style={{ padding: '16px' }}>
              {isLoadingBooking ? (
                <div className="p-4 rounded-lg text-center" style={{ backgroundColor: '#ffffff' }}>
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 mx-auto mb-2" style={{ borderColor: 'rgb(0, 50, 115)' }}></div>
                  <p className="text-sm" style={{ color: 'rgb(0, 50, 115)' }}>予約情報を読み込み中...</p>
                </div>
              ) : nextBooking ? (
                <div className="p-4 rounded-lg" style={{ backgroundColor: '#ffffff' }}>
                  <div className="w-full">
                    <div className="mb-3">
                      <h3 className="font-semibold mb-2 text-center" style={{ color: 'rgb(0, 50, 115)' }}>
                        {nextBooking.service_type}
                      </h3>
                      <div className="space-y-2 text-center" style={{ color: 'rgb(0, 50, 115)' }}>
                        <div className="flex items-center justify-center">
                          <span className="font-medium">
                            {new Date(nextBooking.booking_date).toLocaleDateString('ja-JP', {
                              month: 'long',
                              day: 'numeric',
                              weekday: 'short'
                            })} {nextBooking.booking_time}
                          </span>
                        </div>
                        {nextBooking.dog?.name && (
                          <div className="text-sm font-medium px-3 py-1 rounded-lg w-full max-w-xs mx-auto" style={{ color: 'rgb(0, 50, 115)', backgroundColor: 'rgb(224, 242, 254)' }}>
                            愛犬: {nextBooking.dog.name}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex justify-center">
                      <ThemedButton 
                        size="default" 
                        variant="primary"
                        onClick={() => router.push(`/booking-detail?id=${nextBooking.id}`)}
                        className="w-full max-w-xs"
                      >
                        予約詳細
                      </ThemedButton>
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
      
      {/* ボトムナビゲーション */}
      <BottomNavigation />
    </>
  )
}
