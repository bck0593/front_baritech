"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Calendar, Clock, Dog, ChevronRight, List } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ThemedCard, ThemedCardHeader, CardContent, CardTitle } from "@/components/themed-card"
import { ThemedButton } from "@/components/themed-button"
import { useTheme } from "@/contexts/theme-context"
import BottomNavigation from "@/components/bottom-navigation"
import { BookingService } from "@/lib/api-services"
import { useAuth } from "@/contexts/auth-context"
import { Booking } from "@/lib/types"

export default function BookingPage() {
  const router = useRouter()
  const { currentTheme } = useTheme()
  const { isAuthenticated, isLoading: authLoading } = useAuth()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastFetchTime, setLastFetchTime] = useState(0) // API呼び出し頻度制限

  const fetchBookings = async () => {
    if (authLoading) return
    
    // 1秒以内の連続呼び出しを防ぐ
    const now = Date.now()
    if (now - lastFetchTime < 1000) {
      console.log('🚫 [BOOKING] API呼び出し頻度制限 - スキップ')
      return
    }
    
    setLoading(true)
    setError(null)
    setLastFetchTime(now)
    
    if (!isAuthenticated) {
      setBookings([])
      setLoading(false)
      return
    }

    try {
      console.log('📋 [BOOKING] 予約一覧を取得中...')
      const response = await BookingService.getBookings()
      
      if (response.success) {
        console.log('✅ [BOOKING] 予約一覧取得成功:', response.data)
        // PaginatedResponseの場合、itemsプロパティに配列データが含まれる
        const bookingsData = Array.isArray(response.data) ? response.data : (response.data as any)?.items || []
        
        // キャンセル済み予約を除外して表示
        const activeBookings = bookingsData.filter((booking: Booking) => 
          booking.status !== '取消'
        )
        
        console.log('📋 [BOOKING] アクティブ予約:', activeBookings.length, '件')
        setBookings(activeBookings)
      } else {
        console.error('❌ [BOOKING] 予約一覧取得失敗')
        setError("予約の取得に失敗しました")
      }
    } catch (error) {
      console.error('❌ [BOOKING] 予約一覧取得エラー:', error)
      setError("予約の取得に失敗しました")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBookings()
  }, [isAuthenticated, authLoading])

  // ページフォーカス時にデータを再取得（頻度制限付き）
  useEffect(() => {
    const handleFocus = () => {
      console.log('📋 [BOOKING] ページフォーカス - データ再取得')
      fetchBookings() // 内部で頻度制限が適用される
    }

    window.addEventListener('focus', handleFocus)
    return () => window.removeEventListener('focus', handleFocus)
  }, [])

  const services = [
    {
      id: "daycare",
      name: "犬の保育園（1日コース）",
      price: "¥3,500",
      duration: "9:00 - 17:00",
      description: "専門スタッフによる1日お預かりサービス",
      features: ["食事提供", "運動・遊び", "健康チェック", "写真日記"],
      icon: "🏫",
      popular: true,
    },
    {
      id: "halfday",
      name: "犬の保育園（半日コース）",
      price: "¥2,000",
      duration: "9:00 - 13:00 または 13:00 - 17:00",
      description: "半日お預かりサービス",
      features: ["軽食提供", "運動・遊び", "健康チェック"],
      icon: "🕐",
      popular: false,
    },
    {
      id: "dogrun",
      name: "ドッグラン利用",
      price: "¥100",
      duration: "1時間",
      description: "里山の自然豊かなドッグランで自由に遊べます",
      features: ["広々とした敷地", "小型犬エリア", "水飲み場完備"],
      icon: "🐕",
      popular: false,
    },
  ]

  const handleServiceSelect = (serviceId: string) => {
    router.push(`/booking/service/${serviceId}`)
  }

  const handleBookingDetail = (bookingId: string) => {
    router.push(`/booking-detail?bookingId=${bookingId}`)
  }

  return (
    <>
    <div className="max-w-md mx-auto">
      <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b" style={{ borderColor: 'rgb(0, 50, 115)' }}>
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center space-x-3">
            <button onClick={() => router.push("/")}>
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <h1 className="text-lg font-semibold text-gray-800">予約・サービス</h1>
          </div>
        </div>
      </header>

      <div className="max-w-md mx-auto px-4 py-6 space-y-6">
        {/* Dog Selection */}
        <ThemedCard>
          <ThemedCardHeader variant="primary" style={{ backgroundColor: 'rgb(0, 50, 115)', color: '#ffffff' }}>
            <CardTitle className="text-base flex items-center" style={{ color: '#ffffff' }}>
              <Dog className="w-4 h-4 mr-2" style={{ color: 'rgb(255, 235, 0)' }} />
              ワンちゃん選択
            </CardTitle>
          </ThemedCardHeader>
          <CardContent className="pb-5">
            <div
              className="flex items-center space-x-3 p-3 rounded-lg border-2"
              style={{
                backgroundColor: currentTheme.primary[50],
                borderColor: currentTheme.primary[200],
              }}
            >
              <Avatar className="w-12 h-12">
                <AvatarImage src="/placeholder.svg?height=48&width=48" />
                <AvatarFallback>🐕</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h3 className="font-medium text-gray-800">ポチくん</h3>
                <p className="text-sm text-gray-600">ゴールデンレトリバー • 3歳</p>
              </div>
              <div
                className="w-4 h-4 rounded-full flex items-center justify-center"
                style={{ backgroundColor: currentTheme.primary[600] }}
              >
                <span className="text-white text-xs">✓</span>
              </div>
            </div>
            <ThemedButton 
              variant="primary" 
              size="sm" 
              className="w-full mt-3"
            >
              別のワンちゃんを選択
            </ThemedButton>
          </CardContent>
        </ThemedCard>

        {/* Service Selection */}
        <ThemedCard variant="accent">
          <ThemedCardHeader variant="accent" style={{ backgroundColor: 'rgb(0, 50, 115)', color: '#ffffff' }}>
            <CardTitle className="text-base flex items-center" style={{ color: '#ffffff' }}>
              <List className="w-4 h-4 mr-2" style={{ color: 'rgb(255, 235, 0)' }} />
              サービス一覧
            </CardTitle>
          </ThemedCardHeader>
          <CardContent className="pb-5">
            <div className="space-y-3">
              {services.map((service) => (
                <div
                  key={service.id}
                  onClick={() => handleServiceSelect(service.id)}
                  className="relative p-4 rounded-lg border-2 cursor-pointer transition-all hover:shadow-md"
                  style={{
                    borderWidth: "3px",
                    borderColor: "rgb(255, 235, 0)",
                    backgroundColor: "rgb(255, 249, 204)",
                  }}
                >
                  <div className="flex items-start space-x-3">
                    <div className="text-3xl">{service.icon}</div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-medium" style={{ color: "#000000" }}>{service.name}</h3>
                        <ChevronRight className="w-5 h-5" style={{ color: "#000000" }} />
                      </div>
                      <p className="text-sm mb-2" style={{ color: "#000000" }}>{service.description}</p>

                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center text-xs" style={{ color: "#000000" }}>
                          <Clock className="w-3 h-3 mr-1" style={{ color: "#000000" }} />
                          {service.duration}
                        </div>
                        <span className="font-bold text-lg" style={{ color: "#000000" }}>
                          {service.price}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </ThemedCard>

        {/* Upcoming Bookings */}
        <ThemedCard>
          <ThemedCardHeader variant="primary" style={{ backgroundColor: 'rgb(0, 50, 115)', color: '#ffffff' }}>
            <CardTitle className="text-base flex items-center" style={{ color: '#ffffff' }}>
              <Calendar className="w-4 h-4 mr-2" style={{ color: 'rgb(255, 235, 0)' }} />
              予約一覧
            </CardTitle>
          </ThemedCardHeader>
          <CardContent className="pb-5">
            {loading ? (
              <div className="text-center py-6">
                <p className="text-gray-600 text-sm">予約を読み込み中...</p>
              </div>
            ) : error ? (
              <div className="text-center py-6">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            ) : bookings.length === 0 ? (
              <div className="text-center py-6">
                <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                <p className="text-gray-600 text-sm">予約はありません</p>
                <p className="text-gray-500 text-xs">上記からサービスを選択して予約してください</p>
              </div>
            ) : (
              <div className="space-y-3">
                {bookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="flex items-center justify-between p-3 rounded-lg cursor-pointer hover:shadow-md transition-shadow"
                    style={{ backgroundColor: currentTheme.primary[50] }}
                    onClick={() => handleBookingDetail(booking.id)}
                  >
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-800 text-sm">
                        {booking.service_type === '保育園' ? '犬の保育園' : 
                         booking.service_type === '体験' ? '体験サービス' : 
                         booking.service_type === 'イベント' ? 'イベント参加' : 
                         booking.service_type === 'その他' ? 'その他サービス' :
                         booking.service_type}
                      </h4>
                      <p className="text-xs text-gray-600">
                        {new Date(booking.booking_date).toLocaleDateString('ja-JP', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          weekday: 'short'
                        })} • {booking.booking_time || '09:00-17:00'}
                      </p>
                      {booking.dog_id && (
                        <p className="text-xs text-gray-500">ワンちゃん: {booking.dog_id}</p>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge
                        style={{ 
                          backgroundColor: booking.status === '確定' ? currentTheme.accent[100] : 
                                          booking.status === '受付中' ? '#e3f2fd' :
                                          booking.status === '完了' ? '#e8f5e8' :
                                          booking.status === '取消' ? '#ffebee' : currentTheme.accent[100],
                          color: booking.status === '確定' ? currentTheme.accent[700] : 
                                booking.status === '受付中' ? '#1976d2' :
                                booking.status === '完了' ? '#388e3c' :
                                booking.status === '取消' ? '#d32f2f' : currentTheme.accent[700]
                        }}
                        className="text-xs"
                      >
                        {booking.status}
                      </Badge>
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    </div>
                  </div>
                ))}
                <ThemedButton 
                  variant="primary" 
                  className="w-full mt-3" 
                  onClick={() => router.push("/booking/history")}
                >
                  すべての予約履歴を見る
                </ThemedButton>
              </div>
            )}
          </CardContent>
        </ThemedCard>
      </div>
    </div>
    </div>
    <BottomNavigation />
    </>
  )
}
