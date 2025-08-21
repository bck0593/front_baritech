"use client"
import { useRouter } from "next/navigation"
import { ThemedCard, ThemedCardHeader, CardContent, CardTitle } from "@/components/themed-card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { PageHeader } from "@/components/page-header"
import BottomNavigation from "@/components/bottom-navigation"
import { Calendar, Phone, Mail, FileText } from "lucide-react"
import { useTheme } from "@/contexts/theme-context"

export default function BookingDetailPage() {
  const router = useRouter()
  const { currentTheme } = useTheme()

  // サンプルデータ（実際はクエリパラメータやAPIから取得）
  const bookingDetail = {
    id: "booking-123",
    service: "ワンワン保育園",
    date: "2024年1月20日（土）",
    time: "10:00 - 17:00",
    location: "新宿店",
    address: "東京都新宿区新宿1-1-1",
    dog: "ルイ（トイプードル）",
    status: "confirmed",
    price: 5000,
    notes: "初回利用です。よろしくお願いします。",
    staff: "田中スタッフ",
    contact: {
      phone: "03-1234-5678",
      email: "info@wanwan.com",
    },
    createdAt: "2024年1月15日",
    updatedAt: "2024年1月16日",
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return <Badge style={{ backgroundColor: '#fffce6', color: '#ccbb00' }}>予約確定</Badge>
      case "pending":
        return <Badge style={{ backgroundColor: 'rgb(0, 50, 115)', color: 'white' }}>確認中</Badge>
      case "cancelled":
        return <Badge className="bg-red-100 text-red-800">キャンセル</Badge>
      default:
        return <Badge variant="secondary">不明</Badge>
    }
  }

  const handleCancel = () => {
    // キャンセル処理
    console.log("Cancelling booking:", bookingDetail.id)
  }

  return (
    <>
      <div className="min-h-screen bg-white pb-20">
        <div className="max-w-md mx-auto">
        <PageHeader title="予約詳細" subtitle={`予約ID: ${bookingDetail.id}`} showBackButton />

        <div className="p-4 space-y-6">
          <ThemedCard emphasis>
            <ThemedCardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-white" />
                  予約情報
                </div>
                {getStatusBadge(bookingDetail.status)}
              </CardTitle>
            </ThemedCardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">サービス</p>
                  <p className="font-medium">{bookingDetail.service}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">愛犬</p>
                  <p className="font-medium">{bookingDetail.dog}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">日付</p>
                  <p className="font-medium">{bookingDetail.date}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">時間</p>
                  <p className="font-medium">{bookingDetail.time}</p>
                </div>
              </div>

              <Separator />

              <div>
                <p className="text-sm text-gray-600">場所</p>
                <p className="font-medium">{bookingDetail.location}</p>
                <p className="text-sm text-gray-500">{bookingDetail.address}</p>
              </div>

              <div>
                <p className="text-sm text-gray-600">担当スタッフ</p>
                <p className="font-medium">{bookingDetail.staff}</p>
              </div>
            </CardContent>
          </ThemedCard>

          <ThemedCard>
            <ThemedCardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-white" />
                料金・備考
              </CardTitle>
            </ThemedCardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between text-lg font-bold">
                <span>合計料金</span>
                <span style={{ color: 'rgb(0, 50, 115)' }}>¥{bookingDetail.price.toLocaleString()}</span>
              </div>

              {bookingDetail.notes && (
                <>
                  <Separator />
                  <div>
                    <p className="text-sm text-gray-600 mb-2">備考</p>
                    <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">{bookingDetail.notes}</p>
                  </div>
                </>
              )}
            </CardContent>
          </ThemedCard>

          <ThemedCard>
            <ThemedCardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="w-5 h-5 text-white" />
                お問い合わせ
              </CardTitle>
            </ThemedCardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-gray-600" />
                <span className="text-sm">{bookingDetail.contact.phone}</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-gray-600" />
                <span className="text-sm">{bookingDetail.contact.email}</span>
              </div>
            </CardContent>
          </ThemedCard>

          <ThemedCard>
            <ThemedCardHeader>
              <CardTitle>予約履歴</CardTitle>
            </ThemedCardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">作成日時</span>
                <span>{bookingDetail.createdAt}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">最終更新</span>
                <span>{bookingDetail.updatedAt}</span>
              </div>
            </CardContent>
          </ThemedCard>

          <div className="space-y-3">
            {bookingDetail.status === "confirmed" && (
              <Button
                onClick={handleCancel}
                variant="outline"
                className="w-full text-red-600 border-red-300 hover:bg-red-50"
              >
                予約をキャンセル
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
    <BottomNavigation />
    </>
  )
}
