"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { PageHeader } from "@/components/page-header"
import { QrImage } from "@/components/qr-image"
import { Calendar, QrCode, CheckCircle } from "lucide-react"
import { useTheme } from "@/contexts/theme-context"

export default function CheckInPage() {
  const { currentTheme } = useTheme()
  const [isCheckedIn, setIsCheckedIn] = useState(false)

  // サンプルデータ
  const todayBooking = {
    id: "booking-123",
    service: "ワンワン保育園",
    date: "2024年1月20日（土）",
    time: "10:00 - 17:00",
    location: "新宿店",
    dog: "ルイ（トイプードル）",
    status: "confirmed",
  }

  const handleCheckIn = () => {
    setIsCheckedIn(true)
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="max-w-md mx-auto bg-white">
        <PageHeader title="チェックイン" subtitle="今日の予約" showBackButton />

        <div className="p-4 space-y-6">
          {todayBooking ? (
            <>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" style={{ color: currentTheme.primary[600] }} />
                    今日の予約
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">サービス</span>
                    <span className="font-medium">{todayBooking.service}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">時間</span>
                    <span className="font-medium">{todayBooking.time}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">場所</span>
                    <span className="font-medium">{todayBooking.location}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">愛犬</span>
                    <span className="font-medium">{todayBooking.dog}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">ステータス</span>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      予約確定
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {!isCheckedIn ? (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <QrCode className="w-5 h-5" style={{ color: currentTheme.primary[600] }} />
                      チェックイン用QRコード
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-center space-y-4">
                    <QrImage data={todayBooking.id} size={200} />
                    <p className="text-sm text-gray-600">受付でこのQRコードをスキャンしてください</p>
                    <Button
                      onClick={handleCheckIn}
                      className="w-full"
                      style={{ backgroundColor: currentTheme.primary[600] }}
                    >
                      チェックイン完了
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="text-center py-8 space-y-4">
                    <CheckCircle className="w-16 h-16 text-green-600 mx-auto" />
                    <h3 className="text-lg font-bold text-green-600">チェックイン完了</h3>
                    <p className="text-sm text-gray-600">お疲れ様でした！今日も楽しい一日をお過ごしください。</p>
                  </CardContent>
                </Card>
              )}
            </>
          ) : (
            <Card>
              <CardContent className="text-center py-8 space-y-4">
                <Calendar className="w-16 h-16 text-gray-400 mx-auto" />
                <h3 className="text-lg font-medium text-gray-600">今日の予約はありません</h3>
                <p className="text-sm text-gray-500">新しい予約を作成するか、予約状況をご確認ください。</p>
                <Button variant="outline" className="mt-4 bg-transparent">
                  予約を作成
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
