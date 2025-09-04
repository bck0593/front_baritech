"use client"
import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { ThemedCard, ThemedCardHeader, CardContent, CardTitle } from "@/components/themed-card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { PageHeader } from "@/components/page-header"
import BottomNavigation from "@/components/bottom-navigation"
import { Calendar, Phone, Mail, FileText, History, AlertTriangle } from "lucide-react"
import { useTheme } from "@/contexts/theme-context"
import { BookingService } from "@/lib/api-services"
import type { Booking } from "@/lib/types"

export default function BookingDetailPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { currentTheme } = useTheme()
  const [booking, setBooking] = useState<Booking | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isCancelling, setIsCancelling] = useState(false)

  const bookingId = searchParams.get("id")

  useEffect(() => {
    const loadBookingDetail = async () => {
      try {
        // URLパラメータの bookingId を取得
        const urlBookingId = searchParams.get("bookingId") || bookingId

        if (urlBookingId) {
          console.log('🔍 [BOOKING-DETAIL] URLから予約ID取得:', urlBookingId)
          
          // 実際のAPI予約IDがある場合は、具体的な予約を取得
          try {
            const specificResponse = await BookingService.getBooking(urlBookingId)
            if (specificResponse.success && specificResponse.data) {
              console.log('✅ [BOOKING-DETAIL] API予約取得成功:', specificResponse.data)
              setBooking(specificResponse.data)
              setIsLoading(false)
              return
            }
          } catch (specificError) {
            console.error('❌ [BOOKING-DETAIL] API予約取得エラー:', specificError)
          }
        }

        // URLパラメータから追加情報を取得（フォールバック用）
        const serviceId = searchParams.get("serviceId")
        const date = searchParams.get("date")

        // APIで見つからない場合のみフォールバック予約を作成
        console.log('🔄 [BOOKING-DETAIL] フォールバック予約作成')
        const response = await BookingService.getNextBooking()
        if (response.success && response.data) {
          // パラメータがある場合は、フォールバックデータをカスタマイズ
          if (serviceId || date) {
            const customizedBooking = {
              ...response.data,
              booking_date: date || response.data.booking_date,
              service_type: serviceId === 'daycare' ? '保育園' : response.data.service_type,
              memo: serviceId === 'daycare' && date 
                ? `保育園の予約 - ${new Date(date).toLocaleDateString('ja-JP', { month: 'long', day: 'numeric', weekday: 'short' })}`
                : response.data.memo
            }
            setBooking(customizedBooking)
          } else {
            setBooking(response.data)
          }
        }
      } catch (error) {
        console.error('❌ [BOOKING-DETAIL] 予約データ取得エラー:', error)
      }
      setIsLoading(false)
    }

    loadBookingDetail()
  }, [bookingId, searchParams])

  // 日付フォーマット
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'short'
    })
  }

  // 時間フォーマット
  const formatTime = (timeString: string) => {
    if (timeString.includes('-')) return timeString
    return `${timeString} - 17:00`
  }

  const getStatusBadge = (status: string) => {
    // APIデータの場合、statusが未定義の場合は確定として扱う
    const normalizedStatus = status || "確定"
    
    switch (normalizedStatus) {
      case "確定":
      case "受付中":
        return <Badge style={{ backgroundColor: '#fffce6', color: '#ccbb00' }}>予約確定</Badge>
      case "pending":
        return <Badge style={{ backgroundColor: 'rgb(0, 50, 115)', color: 'white' }}>確認中</Badge>
      case "cancelled":
      case "取消":
        return <Badge className="bg-red-100 text-red-800">キャンセル</Badge>
      default:
        // デバッグ用ログ追加
        console.log('🔍 [BOOKING-DETAIL] 予約ステータス:', { status, normalizedStatus })
        return <Badge style={{ backgroundColor: '#fffce6', color: '#ccbb00' }}>予約確定</Badge>
    }
  }

  const handleCancel = async () => {
    if (!booking) return
    
    const confirmCancel = window.confirm('本当に予約をキャンセルしますか？')
    if (!confirmCancel) return

    setIsCancelling(true)
    try {
      const response = await BookingService.deleteBooking(booking.id)
      if (response.success) {
        alert('予約をキャンセルしました')
        // キャンセル後は予約一覧ページに戻る
        router.push('/booking')
      } else {
        alert('キャンセルに失敗しました。もう一度お試しください。')
      }
    } catch (error) {
      console.error('キャンセルエラー:', error)
      alert('キャンセルに失敗しました。もう一度お試しください。')
    } finally {
      setIsCancelling(false)
    }
  }

  if (isLoading) {
    return (
      <>
        <div className="min-h-screen bg-white pb-20">
          <div className="max-w-md mx-auto">
            <PageHeader title="予約詳細" subtitle="読み込み中..." showBackButton />
            <div className="p-4 text-center">
              <div className="animate-spin w-8 h-8 border-2 border-gray-300 border-t-blue-600 rounded-full mx-auto"></div>
              <p className="mt-2 text-gray-600">予約詳細を読み込んでいます...</p>
            </div>
          </div>
        </div>
        <BottomNavigation />
      </>
    )
  }

  if (!booking) {
    return (
      <>
        <div className="min-h-screen bg-white pb-20">
          <div className="max-w-md mx-auto">
            <PageHeader title="予約詳細" subtitle="データが見つかりません" showBackButton />
            <div className="p-4 text-center">
              <AlertTriangle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">予約詳細が見つかりませんでした</p>
              <Button onClick={() => router.push('/')} style={{ backgroundColor: 'rgb(0, 50, 115)', color: 'rgb(255, 235, 0)' }}>
                ホームに戻る
              </Button>
            </div>
          </div>
        </div>
        <BottomNavigation />
      </>
    )
  }

  return (
    <>
      <div className="min-h-screen bg-white pb-20">
        <div className="max-w-md mx-auto">
        <PageHeader title="予約詳細" subtitle={`予約ID: ${booking.id}`} showBackButton />

        <div className="p-4 space-y-6">
          <ThemedCard emphasis>
            <ThemedCardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" style={{ color: 'rgb(255, 235, 0)' }} />
                  予約情報
                </div>
                {getStatusBadge(booking.status)}
              </CardTitle>
            </ThemedCardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">サービス</p>
                  <p className="font-medium">{booking.service_type}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">愛犬</p>
                  <p className="font-medium">{booking.dog?.name || 'ルイ（トイプードル）'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">日付</p>
                  <p className="font-medium">{formatDate(booking.booking_date)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">時間</p>
                  <p className="font-medium">{formatTime(booking.booking_time)}</p>
                </div>
              </div>

              <Separator />

              <div>
                <p className="text-sm text-gray-600">場所</p>
                <p className="font-medium">里山スタジアム</p>
                <p className="text-sm text-gray-500">今治市里山スタジアム内</p>
              </div>
            </CardContent>
          </ThemedCard>

          <ThemedCard>
            <ThemedCardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" style={{ color: 'rgb(255, 235, 0)' }} />
                料金
              </CardTitle>
            </ThemedCardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between text-lg font-bold">
                <span>合計料金</span>
                <span style={{ color: 'rgb(0, 50, 115)' }}>¥{booking.amount?.toLocaleString() || '3,500'}</span>
              </div>
            </CardContent>
          </ThemedCard>

          <ThemedCard>
            <ThemedCardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="w-5 h-5" style={{ color: 'rgb(255, 235, 0)' }} />
                お問い合わせ
              </CardTitle>
            </ThemedCardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-gray-600" />
                <span className="text-sm">0898-12-3456</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-gray-600" />
                <span className="text-sm">support@dogmates.jp</span>
              </div>
            </CardContent>
          </ThemedCard>

          <ThemedCard>
            <ThemedCardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="w-5 h-5" style={{ color: 'rgb(255, 235, 0)' }} />
                予約履歴
              </CardTitle>
            </ThemedCardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">予約日</span>
                <span>{formatDate(booking.booking_date)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">予約時間</span>
                <span>{formatTime(booking.booking_time)}</span>
              </div>
              {booking.memo && (
                <>
                  <Separator />
                  <div>
                    <p className="text-sm text-gray-600 mb-1">メモ</p>
                    <p className="text-sm">{booking.memo}</p>
                  </div>
                </>
              )}
            </CardContent>
          </ThemedCard>

          <div className="space-y-3">
            {/* statusが確定、受付中、または未定義の場合にキャンセルボタンを表示 */}
            {(booking.status === "確定" || booking.status === "受付中" || !booking.status) && (
              <Button
                onClick={handleCancel}
                disabled={isCancelling}
                variant="outline"
                className="w-full text-red-600 border-red-300 hover:bg-red-50"
              >
                {isCancelling ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-t-transparent border-red-600 rounded-full animate-spin"></div>
                    キャンセル中...
                  </div>
                ) : (
                  '予約をキャンセル'
                )}
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
