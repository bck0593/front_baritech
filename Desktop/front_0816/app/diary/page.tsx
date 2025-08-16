"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, BookOpen, Heart, Calendar, Download, Share, MessageCircle, Send } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ThemedCard, ThemedCardHeader, CardContent, CardTitle } from "@/components/themed-card"
import { ThemedButton } from "@/components/themed-button"
import { useTheme } from "@/contexts/theme-context"
import { Textarea } from "@/components/ui/textarea"

export default function DiaryPage() {
  const router = useRouter()
  const { currentTheme } = useTheme()
  const [selectedDate, setSelectedDate] = useState("2024-08-12")
  const [newMessage, setNewMessage] = useState("")

  const diaryEntries = [
    {
      date: "2024-08-12",
      photos: [
        "/placeholder.svg?height=200&width=200",
        "/placeholder.svg?height=200&width=200",
        "/placeholder.svg?height=200&width=200",
      ],
      activities: {
        meal: { status: "完食", time: "9:30", note: "いつも通り元気よく完食しました" },
        excretion: { status: "良好", time: "10:15", note: "正常な排泄でした" },
      },
      staffNote:
        "今日もとても元気で、他のワンちゃんたちとも仲良く過ごしていました。新しいおもちゃにも興味を示して、楽しそうに遊んでいる姿が印象的でした。",
      staff: "山田スタッフ",
      messages: [
        {
          id: 1,
          sender: "staff",
          name: "山田スタッフ",
          message: "今日もルイくんは元気いっぱいでした！新しいおもちゃがお気に入りのようです。",
          time: "16:30",
        },
        {
          id: 2,
          sender: "parent",
          name: "田中さん",
          message: "ありがとうございます！家でも新しいおもちゃの話をしていました。",
          time: "18:00",
        },
      ],
    },
    {
      date: "2024-08-10",
      photos: ["/placeholder.svg?height=200&width=200", "/placeholder.svg?height=200&width=200"],
      activities: {
        meal: { status: "完食", time: "10:15", note: "ドッグラン前の軽食" },
        excretion: { status: "良好", time: "11:00", note: "運動前の排泄完了" },
      },
      staffNote: "ドッグランでは他のワンちゃんと追いかけっこをして、とても楽しそうでした。",
      staff: "佐藤スタッフ",
      messages: [
        {
          id: 1,
          sender: "staff",
          name: "佐藤スタッフ",
          message: "ドッグランでたくさん走って、とても満足そうでした！",
          time: "12:30",
        },
      ],
    },
  ]

  const currentEntry = diaryEntries.find((entry) => entry.date === selectedDate) || diaryEntries[0]

  const activityIcons = {
    meal: "🍽️",
    excretion: "🚽",
  }

  const activityNames = {
    meal: "食事",
    excretion: "排泄",
  }

  const handleViewAllPhotos = () => {
    router.push(`/photos?date=${selectedDate}`)
  }

  const handleDownloadDiary = () => {
    alert("連絡帳をダウンロードしています...")
  }

  const handleShareDiary = () => {
    if (navigator.share) {
      navigator.share({
        title: "ポチくんの保育園連絡帳",
        text: currentEntry.staffNote,
        url: window.location.href,
      })
    } else {
      alert("連絡帳を共有しました！")
    }
  }

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // メッセージ送信処理
      alert("メッセージを送信しました！")
      setNewMessage("")
    }
  }

  return (
    <div className="max-w-md mx-auto">
      <div
        className="min-h-screen"
        style={{
          background: `linear-gradient(to bottom, ${currentTheme.primary[50]}, white, ${currentTheme.primary[100]})`,
        }}
      >
      {/* Header */}
      <header className="bg-white shadow-sm border-b" style={{ borderColor: currentTheme.primary[100] }}>
        <div className="px-4 py-4">
          <div className="flex items-center space-x-3">
            <button onClick={() => router.back()}>
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-lg font-semibold text-gray-800">連絡帳</h1>
              <p className="text-sm text-gray-600">ポチくんの記録</p>
            </div>
          </div>
        </div>
      </header>

      <div className="px-4 py-6 space-y-6">
        {/* Date Selection */}
        <ThemedCard variant="accent">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium text-gray-800">日付を選択</h3>
              <Calendar className="w-4 h-4" style={{ color: currentTheme.accent[600] }} />
            </div>
            <div className="flex space-x-2 overflow-x-auto pb-2">
              {diaryEntries.map((entry) => {
                const date = new Date(entry.date)
                const isSelected = selectedDate === entry.date
                return (
                  <button
                    key={entry.date}
                    onClick={() => setSelectedDate(entry.date)}
                    className="flex-shrink-0 p-3 rounded-lg text-center transition-colors"
                    style={{
                      backgroundColor: isSelected ? currentTheme.accent[500] : currentTheme.accent[100],
                      color: isSelected ? "white" : currentTheme.accent[700],
                    }}
                  >
                    <div className="text-xs font-medium">
                      {date.getMonth() + 1}/{date.getDate()}
                    </div>
                    <div className="text-xs">{["日", "月", "火", "水", "木", "金", "土"][date.getDay()]}</div>
                  </button>
                )
              })}
            </div>
          </CardContent>
        </ThemedCard>

        {/* Photo Gallery */}
        <ThemedCard variant="primary">
          <ThemedCardHeader variant="primary">
            <CardTitle className="text-base flex items-center">
              <BookOpen className="w-4 h-4 mr-2" />
              今日の写真
            </CardTitle>
          </ThemedCardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              {currentEntry.photos.map((photo, index) => (
                <div key={index} className="aspect-square bg-gray-100 rounded-lg overflow-hidden cursor-pointer">
                  <img
                    src={photo || "/placeholder.svg"}
                    alt={`ポチくんの写真 ${index + 1}`}
                    className="w-full h-full object-cover hover:scale-105 transition-transform"
                    onClick={() => router.push(`/photo-viewer?date=${selectedDate}&index=${index}`)}
                  />
                </div>
              ))}
            </div>
            <div className="flex space-x-2 mt-3">
              <ThemedButton variant="outline" className="flex-1" onClick={handleViewAllPhotos}>
                すべての写真を見る
              </ThemedButton>
              <ThemedButton variant="outline" size="sm" onClick={handleDownloadDiary}>
                <Download className="w-4 h-4" />
              </ThemedButton>
              <ThemedButton variant="outline" size="sm" onClick={handleShareDiary}>
                <Share className="w-4 h-4" />
              </ThemedButton>
            </div>
          </CardContent>
        </ThemedCard>

        {/* Activity Summary */}
        <ThemedCard>
          <ThemedCardHeader variant="primary">
            <CardTitle className="text-base flex items-center">
              <Heart className="w-4 h-4 mr-2" />
              活動記録
            </CardTitle>
          </ThemedCardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(currentEntry.activities).map(([key, activity]) => (
                <div key={key} className="p-3 rounded-lg" style={{ backgroundColor: currentTheme.primary[50] }}>
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-lg">{activityIcons[key as keyof typeof activityIcons]}</span>
                    <span className="font-medium text-sm text-gray-800">
                      {activityNames[key as keyof typeof activityNames]}
                    </span>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-600">状態:</span>
                      <Badge
                        style={{ backgroundColor: currentTheme.accent[100], color: currentTheme.accent[700] }}
                        className="text-xs"
                      >
                        {activity.status}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-600">時間:</span>
                      <span className="text-xs font-medium">{activity.time}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </ThemedCard>

        {/* Staff Note */}
        <ThemedCard variant="primary">
          <ThemedCardHeader variant="primary">
            <CardTitle className="text-base">スタッフからのメッセージ</CardTitle>
          </ThemedCardHeader>
          <CardContent>
            <div className="space-y-3">
              <p className="text-sm text-gray-700 leading-relaxed">{currentEntry.staffNote}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Avatar className="w-6 h-6">
                    <AvatarFallback
                      style={{ backgroundColor: currentTheme.primary[100], color: currentTheme.primary[700] }}
                      className="text-xs"
                    >
                      {currentEntry.staff.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium" style={{ color: currentTheme.primary[800] }}>
                    {currentEntry.staff}
                  </span>
                </div>
                <span className="text-xs text-gray-500">{new Date(selectedDate).toLocaleDateString("ja-JP")}</span>
              </div>
            </div>
          </CardContent>
        </ThemedCard>

        {/* Messages */}
        <ThemedCard variant="accent">
          <ThemedCardHeader variant="accent">
            <CardTitle className="text-base flex items-center">
              <MessageCircle className="w-4 h-4 mr-2" />
              やり取り
            </CardTitle>
          </ThemedCardHeader>
          <CardContent>
            <div className="space-y-3 mb-4">
              {currentEntry.messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === "parent" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                      message.sender === "parent" ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-medium">{message.name}</span>
                      <span className="text-xs opacity-70">{message.time}</span>
                    </div>
                    <p className="text-sm">{message.message}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Message Input */}
            <div className="flex gap-2">
              <Textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="メッセージを入力..."
                className="flex-1 min-h-[40px] resize-none"
                rows={1}
              />
              <ThemedButton variant="primary" size="sm" onClick={handleSendMessage} disabled={!newMessage.trim()}>
                <Send className="w-4 h-4" />
              </ThemedButton>
            </div>
          </CardContent>
        </ThemedCard>
      </div>
    </div>
    </div>
  )
}
