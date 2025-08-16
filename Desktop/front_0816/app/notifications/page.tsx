"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PageHeader } from "@/components/page-header"
import { Bell, Calendar, Heart, AlertCircle, Trash2 } from "lucide-react"
import { useTheme } from "@/contexts/theme-context"

interface Notification {
  id: string
  type: "booking" | "reminder" | "system" | "promotion"
  title: string
  message: string
  timestamp: string
  read: boolean
  important: boolean
}

const mockNotifications: Notification[] = [
  {
    id: "1",
    type: "booking",
    title: "予約確認",
    message: "明日の保育園の予約が確定しました",
    timestamp: "2時間前",
    read: false,
    important: true,
  },
  {
    id: "2",
    type: "reminder",
    title: "お迎え時間のお知らせ",
    message: "17:00にお迎えをお願いします",
    timestamp: "4時間前",
    read: false,
    important: false,
  },
  {
    id: "3",
    type: "system",
    title: "保育レポート",
    message: "ルイちゃんの今日の様子をお伝えします",
    timestamp: "1日前",
    read: true,
    important: false,
  },
  {
    id: "4",
    type: "promotion",
    title: "新サービスのご案内",
    message: "グルーミングサービスが開始されました",
    timestamp: "2日前",
    read: true,
    important: false,
  },
]

export default function NotificationsPage() {
  const { currentTheme } = useTheme()
  const [notifications, setNotifications] = useState(mockNotifications)
  const [activeTab, setActiveTab] = useState("all")

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "booking":
        return <Calendar className="w-5 h-5 text-blue-600" />
      case "reminder":
        return <Bell className="w-5 h-5 text-orange-600" />
      case "system":
        return <Heart className="w-5 h-5 text-green-600" />
      case "promotion":
        return <AlertCircle className="w-5 h-5 text-purple-600" />
      default:
        return <Bell className="w-5 h-5 text-gray-600" />
    }
  }

  const markAsRead = (id: string) => {
    setNotifications(notifications.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter((n) => n.id !== id))
  }

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })))
  }

  const filteredNotifications = notifications.filter((notification) => {
    if (activeTab === "all") return true
    if (activeTab === "unread") return !notification.read
    if (activeTab === "important") return notification.important
    return true
  })

  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="max-w-md mx-auto bg-white">
        <PageHeader
          title="通知"
          subtitle={unreadCount > 0 ? `${unreadCount}件の未読通知` : "すべて既読"}
          showBackButton
        />

        <div className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">通知一覧</h2>
            {unreadCount > 0 && (
              <Button variant="outline" size="sm" onClick={markAllAsRead}>
                すべて既読にする
              </Button>
            )}
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="all">すべて</TabsTrigger>
              <TabsTrigger value="unread">
                未読{" "}
                {unreadCount > 0 && (
                  <Badge variant="secondary" className="ml-1">
                    {unreadCount}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="important">重要</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="mt-4 space-y-3">
              {filteredNotifications.length > 0 ? (
                filteredNotifications.map((notification) => (
                  <Card
                    key={notification.id}
                    className={`cursor-pointer transition-all ${!notification.read ? "border-l-4 bg-blue-50" : ""}`}
                    style={!notification.read ? { borderLeftColor: currentTheme.primary[600] } : {}}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 mt-1">{getNotificationIcon(notification.type)}</div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className={`font-medium ${!notification.read ? "text-gray-900" : "text-gray-700"}`}>
                              {notification.title}
                            </h3>
                            {notification.important && (
                              <Badge variant="destructive" className="text-xs">
                                重要
                              </Badge>
                            )}
                            {!notification.read && <div className="w-2 h-2 bg-blue-600 rounded-full"></div>}
                          </div>
                          <p className={`text-sm ${!notification.read ? "text-gray-700" : "text-gray-500"}`}>
                            {notification.message}
                          </p>
                          <p className="text-xs text-gray-400 mt-2">{notification.timestamp}</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            deleteNotification(notification.id)
                          }}
                          className="flex-shrink-0"
                        >
                          <Trash2 className="w-4 h-4 text-gray-400" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card>
                  <CardContent className="text-center py-8">
                    <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">通知はありません</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
