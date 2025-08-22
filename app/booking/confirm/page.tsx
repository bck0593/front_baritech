"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ThemedCard, ThemedCardHeader, CardContent, CardTitle } from "@/components/themed-card"
import { Button } from "@/components/ui/button"
import { PageHeader } from "@/components/page-header"
import { Calendar, CreditCard, Check, Info, User } from "lucide-react"
import { useTheme } from "@/contexts/theme-context"
import BottomNavigation from "@/components/bottom-navigation"

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
    <>
      <div className="min-h-screen bg-white pb-20">
        <div className="max-w-md mx-auto">
          <PageHeader title="予約確認" subtitle="内容をご確認ください" showBackButton />

          <div className="p-4 space-y-6">
            <ThemedCard>
              <ThemedCardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" style={{ color: 'rgb(255, 235, 0)' }} />
                  予約内容
                </CardTitle>
              </ThemedCardHeader>
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
            </ThemedCard>

            <ThemedCard>
              <ThemedCardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5" style={{ color: 'rgb(255, 235, 0)' }} />
                  料金
                </CardTitle>
              </ThemedCardHeader>
              <CardContent>
                <div className="flex items-center justify-between text-lg font-bold">
                  <span>合計</span>
                  <span style={{ color: currentTheme.primary[600] }}>¥{bookingData.price.toLocaleString()}</span>
                </div>
              </CardContent>
            </ThemedCard>

            {bookingData.notes && (
              <ThemedCard>
                <ThemedCardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Info className="w-5 h-5" style={{ color: 'rgb(255, 235, 0)' }} />
                    備考
                  </CardTitle>
                </ThemedCardHeader>
                <CardContent>
                  <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">{bookingData.notes}</p>
                </CardContent>
              </ThemedCard>
            )}

            <div className="space-y-3">
              <Button
                onClick={handleConfirm}
                disabled={isConfirming}
                className="w-full"
                style={{ backgroundColor: 'rgb(0, 50, 115)', color: 'rgb(255, 235, 0)' }}
              >
                {isConfirming ? (
                  <div className="flex items-center gap-2" style={{ color: 'rgb(255, 235, 0)' }}>
                    <div className="w-4 h-4 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: 'rgb(255, 235, 0)' }}></div>
                    予約中...
                  </div>
                ) : (
                  <div className="flex items-center gap-2" style={{ color: 'rgb(255, 235, 0)' }}>
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
      <BottomNavigation />
    </>
  )
}
