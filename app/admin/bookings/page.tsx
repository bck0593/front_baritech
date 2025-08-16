"use client"

import { useState } from "react"
import { Calendar, Clock, User, DollarSign, Check, X, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useTheme } from "@/contexts/theme-context"

type Booking = {
  id: number
  dogName: string
  ownerName: string
  service: string
  date: string
  time: string
  status: string
  price: number
  notes: string
}

// Mock data
const bookings: Booking[] = [
  {
    id: 1,
    dogName: "ポチ",
    ownerName: "田中太郎",
    service: "犬の保育園（1日コース）",
    date: "2024-01-15",
    time: "9:00 - 17:00",
    status: "confirmed",
    price: 5000,
    notes: "初回利用です",
  },
  {
    id: 2,
    dogName: "ハナ",
    ownerName: "佐藤花子",
    service: "半日コース",
    date: "2024-01-15",
    time: "9:00 - 13:00",
    status: "pending",
    price: 3000,
    notes: "お迎え時間要確認",
  },
  {
    id: 3,
    dogName: "チョコ",
    ownerName: "山田次郎",
    service: "犬の保育園（1日コース）",
    date: "2024-01-16",
    time: "9:00 - 17:00",
    status: "confirmed",
    price: 5000,
    notes: "",
  },
]

const stats = [
  { name: "総予約数", value: "156", change: "+12", changeType: "increase" },
  { name: "今日の予約", value: "8", change: "+2", changeType: "increase" },
  { name: "保留中", value: "3", change: "-1", changeType: "decrease" },
  { name: "今月の売上", value: "¥248,000", change: "+15%", changeType: "increase" },
]

export default function BookingsPage() {
  const { currentTheme } = useTheme()
  const [selectedBooking, setSelectedBooking] = useState<(typeof bookings)[0] | null>(null)

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return <Badge className="bg-green-100 text-green-800">確定</Badge>
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">保留中</Badge>
      case "cancelled":
        return <Badge className="bg-red-100 text-red-800">キャンセル</Badge>
      default:
        return null
    }
  }

  const handleApprove = (bookingId: number) => {
    console.log("Approve booking:", bookingId)
  }

  const handleReject = (bookingId: number) => {
    console.log("Reject booking:", bookingId)
  }

  const filterBookings = (filter: string) => {
    switch (filter) {
      case "today":
        return bookings.filter((booking) => booking.date === "2024-01-15")
      case "pending":
        return bookings.filter((booking) => booking.status === "pending")
      case "confirmed":
        return bookings.filter((booking) => booking.status === "confirmed")
      default:
        return bookings
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">予約管理</h1>
        <p className="text-gray-600">保育園の予約状況を管理します</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.name}>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div
                  className={`text-sm ${
                    stat.changeType === "increase"
                      ? "text-green-600"
                      : stat.changeType === "decrease"
                        ? "text-red-600"
                        : "text-gray-600"
                  }`}
                >
                  {stat.change}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Bookings Tabs */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">すべて</TabsTrigger>
          <TabsTrigger value="today">今日</TabsTrigger>
          <TabsTrigger value="pending">保留中</TabsTrigger>
          <TabsTrigger value="confirmed">確定</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <BookingsList
            bookings={filterBookings("all")}
            onApprove={handleApprove}
            onReject={handleReject}
            onView={setSelectedBooking}
          />
        </TabsContent>

        <TabsContent value="today" className="space-y-4">
          <BookingsList
            bookings={filterBookings("today")}
            onApprove={handleApprove}
            onReject={handleReject}
            onView={setSelectedBooking}
          />
        </TabsContent>

        <TabsContent value="pending" className="space-y-4">
          <BookingsList
            bookings={filterBookings("pending")}
            onApprove={handleApprove}
            onReject={handleReject}
            onView={setSelectedBooking}
          />
        </TabsContent>

        <TabsContent value="confirmed" className="space-y-4">
          <BookingsList
            bookings={filterBookings("confirmed")}
            onApprove={handleApprove}
            onReject={handleReject}
            onView={setSelectedBooking}
          />
        </TabsContent>
      </Tabs>

      {/* Booking Detail Modal */}
      <Dialog open={!!selectedBooking} onOpenChange={() => setSelectedBooking(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>予約詳細</DialogTitle>
          </DialogHeader>
          {selectedBooking && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">犬の名前</label>
                  <p className="text-sm text-gray-900">{selectedBooking.dogName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">飼い主</label>
                  <p className="text-sm text-gray-900">{selectedBooking.ownerName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">サービス</label>
                  <p className="text-sm text-gray-900">{selectedBooking.service}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">料金</label>
                  <p className="text-sm text-gray-900">¥{selectedBooking.price.toLocaleString()}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">日付</label>
                  <p className="text-sm text-gray-900">{selectedBooking.date}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">時間</label>
                  <p className="text-sm text-gray-900">{selectedBooking.time}</p>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">ステータス</label>
                <div className="mt-1">{getStatusBadge(selectedBooking.status)}</div>
              </div>
              {selectedBooking.notes && (
                <div>
                  <label className="text-sm font-medium text-gray-700">備考</label>
                  <p className="text-sm text-gray-900">{selectedBooking.notes}</p>
                </div>
              )}
              {selectedBooking.status === "pending" && (
                <div className="flex gap-2 pt-4">
                  <Button
                    onClick={() => handleApprove(selectedBooking.id)}
                    className="flex-1"
                    style={{ backgroundColor: currentTheme.primary[600] }}
                  >
                    <Check className="h-4 w-4 mr-1" />
                    承認
                  </Button>
                  <Button variant="outline" onClick={() => handleReject(selectedBooking.id)} className="flex-1">
                    <X className="h-4 w-4 mr-1" />
                    拒否
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

function BookingsList({
  bookings,
  onApprove,
  onReject,
  onView,
}: {
  bookings: Booking[]
  onApprove: (id: number) => void
  onReject: (id: number) => void
  onView: (booking: Booking) => void
}) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return <Badge className="bg-green-100 text-green-800">確定</Badge>
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">保留中</Badge>
      case "cancelled":
        return <Badge className="bg-red-100 text-red-800">キャンセル</Badge>
      default:
        return null
    }
  }

  return (
    <div className="space-y-4">
      {bookings.map((booking) => (
        <Card key={booking.id} className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-2">
                  <h3 className="text-lg font-medium text-gray-900">{booking.dogName}</h3>
                  {getStatusBadge(booking.status)}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-gray-600">
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-1" />
                    {booking.ownerName}
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    {booking.date}
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    {booking.time}
                  </div>
                </div>
                <p className="text-sm text-gray-600 mt-1">{booking.service}</p>
                <div className="flex items-center mt-2">
                  <DollarSign className="h-4 w-4 mr-1 text-gray-400" />
                  <span className="text-sm font-medium">¥{booking.price.toLocaleString()}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => onView(booking)}>
                  <Eye className="h-4 w-4 mr-1" />
                  詳細
                </Button>
                {booking.status === "pending" && (
                  <>
                    <Button size="sm" onClick={() => onApprove(booking.id)}>
                      <Check className="h-4 w-4 mr-1" />
                      承認
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => onReject(booking.id)}>
                      <X className="h-4 w-4 mr-1" />
                      拒否
                    </Button>
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
