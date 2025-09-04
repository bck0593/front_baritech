"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { Check, Calendar, Home, MessageCircle } from "lucide-react"
import { ThemedCard, CardContent } from "@/components/themed-card"
import { ThemedButton } from "@/components/themed-button"
import { useTheme } from "@/contexts/theme-context"
import { useEffect } from "react"
import { useProfile } from "@/contexts/profile-context"
import BottomNavigation from "@/components/bottom-navigation"

export default function BookingSuccessPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { currentTheme } = useTheme()
  const { setHasBooked } = useProfile()

  const bookingId = searchParams.get("bookingId")
  const serviceId = searchParams.get("serviceId") 
  const date = searchParams.get("date")

  useEffect(() => {
    setHasBooked(true)
  }, []) // setHasBookedを依存配列から削除

  return (
    <>
      <div className="min-h-screen bg-white pb-20">
        <div className="max-w-md mx-auto px-4 py-12 space-y-6">
          {/* Success Animation */}
          <div className="text-center">
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse"
              style={{ backgroundColor: currentTheme.primary[600] }}
            >
              <Check className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">予約が完了しました！</h1>
            <p className="text-gray-600">ご予約ありがとうございます</p>
          </div>

        {/* Booking Details */}
        <ThemedCard variant="primary">
          <CardContent className="pt-6 text-center">
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">予約番号</p>
                <p className="text-lg font-bold" style={{ color: currentTheme.primary[800] }}>
                  {bookingId}
                </p>
              </div>
              <div className="text-sm text-gray-600">
                <p>確認メールを送信いたします</p>
                <p>tanaka@example.com</p>
              </div>
            </div>
          </CardContent>
        </ThemedCard>

        {/* Next Steps */}
        <ThemedCard>
          <CardContent className="pt-4">
            <h3 className="font-semibold text-gray-800 mb-3">次のステップ</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                  style={{ backgroundColor: currentTheme.accent[100] }}
                >
                  <span className="text-xs font-bold" style={{ color: currentTheme.accent[700] }}>
                    1
                  </span>
                </div>
                <div>
                  <p className="font-medium text-sm text-gray-800">確認メールをチェック</p>
                  <p className="text-xs text-gray-600">予約詳細と注意事項をご確認ください</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                  style={{ backgroundColor: currentTheme.accent[100] }}
                >
                  <span className="text-xs font-bold" style={{ color: currentTheme.accent[700] }}>
                    2
                  </span>
                </div>
                <div>
                  <p className="font-medium text-sm text-gray-800">当日のチェックイン</p>
                  <p className="text-xs text-gray-600">アプリのQRコードをご利用ください</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                  style={{ backgroundColor: currentTheme.accent[100] }}
                >
                  <span className="text-xs font-bold" style={{ color: currentTheme.accent[700] }}>
                    3
                  </span>
                </div>
                <div>
                  <p className="font-medium text-sm text-gray-800">サービス利用</p>
                  <p className="text-xs text-gray-600">ポチくんと楽しい時間をお過ごしください</p>
                </div>
              </div>
            </div>
          </CardContent>
        </ThemedCard>

        {/* Action Buttons */}
        <div className="space-y-3">
          <ThemedButton variant="primary" className="w-full py-3" onClick={() => {
            const params = new URLSearchParams()
            if (bookingId) params.set('id', bookingId)
            if (serviceId) params.set('serviceId', serviceId) 
            if (date) params.set('date', date)
            router.push(`/booking-detail?${params.toString()}`)
          }}>
            <Calendar className="w-4 h-4 mr-2" />
            予約詳細を確認
          </ThemedButton>

          <div className="grid grid-cols-2 gap-3">
            <ThemedButton variant="outline" onClick={() => router.push("/")}>
              <Home className="w-4 h-4" />
            </ThemedButton>

            <ThemedButton variant="outline" onClick={() => router.push("/help")}>
              <MessageCircle className="w-4 h-4 mr-2" />
              サポート
            </ThemedButton>
          </div>
        </div>

        {/* Additional Info */}
        <ThemedCard variant="accent">
          <CardContent className="pt-4">
            <div className="text-center">
              <h4 className="font-medium text-sm mb-2" style={{ color: currentTheme.accent[800] }}>
                ご不明な点がございましたら
              </h4>
              <p className="text-xs text-gray-600 mb-3">お気軽にお問い合わせください</p>
              <div className="space-y-1 text-xs text-gray-600">
                <p>📞 0898-12-3456</p>
                <p>📧 support@dogmates.jp</p>
                <p>🕒 平日 9:00-18:00</p>
              </div>
            </div>
          </CardContent>
        </ThemedCard>
        </div>
      </div>
      <BottomNavigation />
    </>
  )
}
