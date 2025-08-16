"use client"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { PageHeader } from "@/components/page-header"
import { Calendar, Phone, Mail, FileText, Download } from "lucide-react"
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
        return <Badge className="bg-green-100 text-green-800">予約確定</Badge>
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">確認中</Badge>
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

  const handleDownloadReceipt = () => {
    // 領収書ダウンロード処理
    console.log("Downloading receipt for:", bookingDetail.id)
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="max-w-md mx-auto bg-white">
        <PageHeader title="予約詳細" subtitle={`予約ID: ${bookingDetail.id}`} showBackButton />

        <div className="p-4 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" style={{ color: currentTheme.primary[600] }} />
                  予約情報
                </div>
                {getStatusBadge(bookingDetail.status)}
              </CardTitle>
            </CardHeader>
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
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" style={{ color: currentTheme.primary[600] }} />
                料金・備考
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between text-lg font-bold">
                <span>合計料金</span>
                <span style={{ color: currentTheme.primary[600] }}>¥{bookingDetail.price.toLocaleString()}</span>
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
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="w-5 h-5" style={{ color: currentTheme.primary[600] }} />
                お問い合わせ
              </CardTitle>
            </CardHeader>
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
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>予約履歴</CardTitle>
            </CardHeader>
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
          </Card>

          <div className="space-y-3">
            <Button onClick={handleDownloadReceipt} variant="outline" className="w-full bg-transparent">
              <Download className="w-4 h-4 mr-2" />
              領収書をダウンロード
            </Button>

            {bookingDetail.status === "confirmed" && (
              <Button
                onClick={handleCancel}
                variant="outline"
                className="w-full text-red-600 border-red-200 hover:bg-red-50 bg-transparent"
              >
                予約をキャンセル
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
