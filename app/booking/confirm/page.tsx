"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PageHeader } from "@/components/page-header"
import { Calendar, CreditCard, Check } from "lucide-react"
import { useTheme } from "@/contexts/theme-context"

export default function BookingConfirmPage() {
  const router = useRouter()
  const { currentTheme } = useTheme()
  const [isConfirming, setIsConfirming] = useState(false)

  // サンプルデータ（実際はクエリパラメータやstateから取得）
  const bookingData = {
    service: "ワンワン保育園",
    date: "2024年1月20日（土）",
    time: "10:00 - 17:00",
    location: "新宿店",
    dog: "ルイ（トイプードル）",
    price: 5000,
    notes: "初回利用です。よろしくお願いします。",
  }

  const handleConfirm = async () => {
    setIsConfirming(true)
    // 予約確定処理
    setTimeout(() => {
      router.push("/booking/success")
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="max-w-md mx-auto bg-white">
        <PageHeader title="予約確認" subtitle="内容をご確認ください" showBackButton />

        <div className="p-4 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" style={{ color: currentTheme.primary[600] }} />
                予約内容
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">サービス</span>
                <span className="font-medium">{bookingData.service}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">日付</span>
                <span className="font-medium">{bookingData.date}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">時間</span>
                <span className="font-medium">{bookingData.time}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">場所</span>
                <span className="font-medium">{bookingData.location}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">愛犬</span>
                <span className="font-medium">{bookingData.dog}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5" style={{ color: currentTheme.primary[600] }} />
                料金
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between text-lg font-bold">
                <span>合計</span>
                <span style={{ color: currentTheme.primary[600] }}>¥{bookingData.price.toLocaleString()}</span>
              </div>
            </CardContent>
          </Card>

          {bookingData.notes && (
            <Card>
              <CardHeader>
                <CardTitle>備考</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-700">{bookingData.notes}</p>
              </CardContent>
            </Card>
          )}

          <div className="space-y-3">
            <Button
              onClick={handleConfirm}
              disabled={isConfirming}
              className="w-full"
              style={{ backgroundColor: currentTheme.primary[600] }}
            >
              {isConfirming ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  予約中...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4" />
                  予約を確定する
                </div>
              )}
            </Button>
            <Button variant="outline" onClick={() => router.back()} className="w-full">
              戻る
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
