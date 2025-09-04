"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { PageHeader } from "@/components/page-header"
import { QrImage } from "@/components/qr-image"
import BottomNavigation from "@/components/bottom-navigation"
import { Calendar, QrCode, CheckCircle } from "lucide-react"
import { useTheme } from "@/contexts/theme-context"
import { BookingService } from "@/lib/api-services"
import { Booking } from "@/lib/types"

export default function CheckInPage() {
  const { currentTheme } = useTheme()
  const [todayBookings, setTodayBookings] = useState<Booking[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // 今日の予約を取得
  useEffect(() => {
    const fetchTodayBookings = async () => {
      try {
        setIsLoading(true)
        const response = await BookingService.getTodayBookings()
        if (response.success && response.data) {
          setTodayBookings(response.data)
        } else {
          setError('予約情報の取得に失敗しました')
        }
      } catch (err) {
        console.error('Error fetching today bookings:', err)
        setError('予約情報の取得中にエラーが発生しました')
      } finally {
        setIsLoading(false)
      }
    }

    fetchTodayBookings()
  }, [])

  // 最初の予約を表示用のデータとして使用
  const primaryBooking = todayBookings.length > 0 ? todayBookings[0] : null

  return (
    <>
      <div className="min-h-screen bg-gray-50 pb-20">
        <div className="max-w-md mx-auto bg-white">
        <PageHeader title="チェックイン" subtitle="今日の予約" showBackButton />

        <div className="p-4 space-y-6">
          {isLoading ? (
            <Card>
              <CardContent className="text-center py-8 space-y-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="text-sm text-gray-600">予約情報を読み込み中...</p>
              </CardContent>
            </Card>
          ) : error ? (
            <Card>
              <CardContent className="text-center py-8 space-y-4">
                <Calendar className="w-16 h-16 text-red-400 mx-auto" />
                <h3 className="text-lg font-medium text-red-600">エラーが発生しました</h3>
                <p className="text-sm text-gray-500">{error}</p>
                <Button 
                  variant="outline" 
                  className="mt-4 bg-transparent"
                  onClick={() => window.location.reload()}
                >
                  再読み込み
                </Button>
              </CardContent>
            </Card>
          ) : primaryBooking ? (
            <>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" style={{ color: currentTheme.primary[600] }} />
                    今日の予約
                    {todayBookings.length > 1 && (
                      <Badge variant="secondary" className="ml-2">
                        {todayBookings.length}件
                      </Badge>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">サービス</span>
                    <span className="font-medium">{primaryBooking.service_type}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">日付</span>
                    <span className="font-medium">
                      {new Date(primaryBooking.booking_date).toLocaleDateString('ja-JP', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        weekday: 'short'
                      })}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">時間</span>
                    <span className="font-medium">{primaryBooking.booking_time}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">愛犬</span>
                    <span className="font-medium">{primaryBooking.dog?.name || '登録された愛犬'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">ステータス</span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        primaryBooking.status === '確定' ? "bg-green-100 text-green-800" :
                        primaryBooking.status === '受付中' ? "bg-blue-100 text-blue-800" :
                        "bg-gray-100 text-gray-800"
                      }`}>
                      {primaryBooking.status}
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <QrCode className="w-5 h-5" style={{ color: currentTheme.primary[600] }} />
                    チェックイン用QRコード
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center space-y-4">
                  <div className="flex justify-center items-center w-full">
                    <QrImage data={primaryBooking.id} size={200} />
                  </div>
                  <p className="text-sm text-gray-600">受付でこのQRコードをスキャンしてください</p>
                  <p className="text-xs text-gray-500">
                    予約ID: {primaryBooking.id}
                  </p>
                </CardContent>
              </Card>
            </>
          ) : (
            <Card>
              <CardContent className="text-center py-8 space-y-4">
                <Calendar className="w-16 h-16 text-gray-400 mx-auto" />
                <h3 className="text-lg font-medium text-gray-600">今日の予約はありません</h3>
                <p className="text-sm text-gray-500">新しい予約を作成するか、予約状況をご確認ください。</p>
                <Button 
                  variant="outline" 
                  className="mt-4 bg-transparent"
                  onClick={() => window.location.href = '/booking'}
                >
                  予約を作成
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
    <BottomNavigation />
    </>
  )
}
