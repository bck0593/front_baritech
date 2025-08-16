"use client"

import { useRouter } from "next/navigation"
import { ArrowLeft, Calendar, Clock, Dog, ChevronRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ThemedCard, ThemedCardHeader, CardContent, CardTitle } from "@/components/themed-card"
import { ThemedButton } from "@/components/themed-button"
import { useTheme } from "@/contexts/theme-context"

export default function BookingPage() {
  const router = useRouter()
  const { currentTheme } = useTheme()
  // const { unlocked, completion, profile } = useProfile()

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
      icon: "🏃",
      popular: false,
    },
  ]

  const upcomingBookings = [
    {
      id: 1,
      service: "犬の保育園（1日コース）",
      date: "8月15日（木）",
      time: "9:00 - 17:00",
      status: "confirmed",
    },
    {
      id: 2,
      service: "ドッグラン利用",
      date: "8月18日（日）",
      time: "10:00 - 11:00",
      status: "confirmed",
    },
  ]

  const handleServiceSelect = (serviceId: string) => {
    router.push(`/booking/service/${serviceId}`)
  }

  const handleBookingChange = (bookingId: number) => {
    router.push(`/booking-detail?id=${bookingId}`)
  }

  return (
    <div className="max-w-md mx-auto">
      <div
        className="min-h-screen"
        style={{
          background: `linear-gradient(to bottom, ${currentTheme.primary[50]}, white, ${currentTheme.primary[100]})`,
        }}
      >
      {/* Header */}
      <header className="bg-white shadow-sm border-b" style={{ borderColor: currentTheme.primary[100] }}>
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
        <ThemedCard variant="primary">
          <ThemedCardHeader variant="primary">
            <CardTitle className="text-base flex items-center">
              <Dog className="w-4 h-4 mr-2" />
              ワンちゃん選択
            </CardTitle>
          </ThemedCardHeader>
          <CardContent>
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
            <ThemedButton variant="outline" size="sm" className="w-full mt-3">
              別のワンちゃんを選択
            </ThemedButton>
          </CardContent>
        </ThemedCard>

        {/* Service Selection */}
        <ThemedCard variant="accent">
          <ThemedCardHeader variant="accent">
            <CardTitle className="text-base">サービスを選択してください</CardTitle>
          </ThemedCardHeader>
          <CardContent>
            <div className="space-y-3">
              {services.map((service) => (
                <div
                  key={service.id}
                  onClick={() => handleServiceSelect(service.id)}
                  className="relative p-4 rounded-lg border-2 cursor-pointer transition-all hover:shadow-md"
                  style={{
                    borderColor: currentTheme.accent[200],
                    backgroundColor: "white",
                  }}
                >
                  <div className="flex items-start space-x-3">
                    <div className="text-3xl">{service.icon}</div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-medium text-gray-800">{service.name}</h3>
                        <ChevronRight className="w-5 h-5 text-gray-400" />
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{service.description}</p>

                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center text-xs text-gray-500">
                          <Clock className="w-3 h-3 mr-1" />
                          {service.duration}
                        </div>
                        <span className="font-bold text-lg" style={{ color: currentTheme.accent[600] }}>
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
          <ThemedCardHeader variant="primary">
            <CardTitle className="text-base flex items-center">
              <Calendar className="w-4 h-4 mr-2" />
              予約一覧
            </CardTitle>
          </ThemedCardHeader>
          <CardContent>
            {upcomingBookings.length === 0 ? (
              <div className="text-center py-6">
                <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                <p className="text-gray-600 text-sm">予約はありません</p>
                <p className="text-gray-500 text-xs">上記からサービスを選択して予約してください</p>
              </div>
            ) : (
              <div className="space-y-3">
                {upcomingBookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="flex items-center justify-between p-3 rounded-lg cursor-pointer hover:shadow-md transition-shadow"
                    style={{ backgroundColor: currentTheme.primary[50] }}
                    onClick={() => handleBookingChange(booking.id)}
                  >
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-800 text-sm">{booking.service}</h4>
                      <p className="text-xs text-gray-600">
                        {booking.date} • {booking.time}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge
                        style={{ backgroundColor: currentTheme.accent[100], color: currentTheme.accent[700] }}
                        className="text-xs"
                      >
                        確定済み
                      </Badge>
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    </div>
                  </div>
                ))}
                <ThemedButton variant="outline" className="w-full mt-3" onClick={() => router.push("/booking/history")}>
                  すべての予約履歴を見る
                </ThemedButton>
              </div>
            )}
          </CardContent>
        </ThemedCard>
      </div>
    </div>
    </div>
  )
}
