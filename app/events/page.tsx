"use client"

import { useState, useEffect } from "react"
import { EventService, Event } from "@/lib/api-services"
import { useRouter, useSearchParams } from "next/navigation"
import { ArrowLeft, Calendar, MapPin, Heart, Tag, Filter } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ThemedCard, ThemedCardHeader, CardContent, CardTitle } from "@/components/themed-card"
import { ThemedButton } from "@/components/themed-button"
import { useTheme } from "@/contexts/theme-context"
import BottomNavigation from "@/components/bottom-navigation"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"

export default function EventsPage() {
  const router = useRouter()
  const search = useSearchParams()
  const { currentTheme } = useTheme()

  // Tabs: events only (removed meetups)
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Trial pack dialog (event detail)
  const [trialOpen, setTrialOpen] = useState(false)
  const [trialRequested, setTrialRequested] = useState(false)

  // Neutral recommendation context example
  const todayCare = { meal: "完食", exercise: "45分", stool: "良好" }
  const recommendedItems = [
    {
      id: "food",
      name: "消化ケアフード（小粒）",
      img: "/images/uni-food.png",
      evidence: [
        "主成分: 低アレルゲン鶏由来たんぱく",
        "食物繊維: ビートパルプ/フラクトオリゴ糖（便質サポート）",
        "目的: 消化性の確保と便の安定化",
      ],
      note: "運動量がやや多めの日に、適度なエネルギー密度設計が合う可能性があります。",
    },
    {
      id: "treat",
      name: "トレーニング用やわらかおやつ",
      img: "/images/uni-snack.png",
      evidence: [
        "主成分: ささみ・米粉（噛みやすさ重視）",
        "柔らかさ: 少量の保湿成分（過剰は控えめ）",
        "目的: 褒める頻度に合わせて少量で調整",
      ],
      note: "短時間の反復トレーニング時に少量で使える設計が望ましいです。",
    },
    {
      id: "sheet",
      name: "高吸収・消臭シート",
      img: "/images/uni-sheet.png",
      evidence: [
        "吸収材: 高分子吸水ポリマー（素早い吸収）",
        "消臭: クエン酸系消臭成分（アンモニア中和）",
        "目的: 排泄後のにおい/足濡れ軽減",
      ],
      note: "便・尿が安定している日でも、衛生管理の負担を軽くします。",
    },
  ]


  useEffect(() => {
    setLoading(true)
    setError(null)
    EventService.getEvents()
      .then((res) => {
        if (res.success) {
          setEvents(res.data)
        } else {
          setError("イベントの取得に失敗しました")
        }
      })
      .catch(() => setError("イベントの取得に失敗しました"))
      .finally(() => setLoading(false))
  }, [])

  const categories = [
    { id: "all", name: "すべて", icon: "🏷️" },
    { id: "health", name: "健康", icon: "🏥" },
    { id: "sports", name: "スポーツ", icon: "🏃" },
    { id: "outdoor", name: "アウトドア", icon: "🌲" },
    { id: "education", name: "学習", icon: "📚" },
  ]

  const filteredEvents = selectedCategory === "all" ? events : events.filter((e) => e.category === selectedCategory)

  const handleEventRegistration = (eventId: string) => {
    // 本来はAPIで参加登録/キャンセルを行う
    alert("イベント参加機能はデモです")
    setSelectedEvent(null)
  }

  const handleAddToFavorites = (eventId: number) => {
    alert("お気に入りに追加しました！")
  }

  // 金額表示用ユーティリティ
  const formatPrice = (price: string | number) => {
    if (price === 'free' || price === '無料') return '無料';
    const num = typeof price === 'number' ? price : Number(price);
    if (isNaN(num)) return price;
    return `¥${num.toLocaleString()}`;
  };

  // Event detail view stays within the Events tab UX
  if (selectedEvent) {
    const event = events.find((e) => e.id === selectedEvent)!
    return (
      <div className="max-w-md mx-auto">
        <div className="min-h-screen bg-white">
        <header className="bg-white border-b" style={{ borderColor: 'rgb(0, 50, 115)' }}>
          <div className="max-w-md mx-auto px-4 py-4">
            <div className="flex items-center space-x-3">
              <button onClick={() => setSelectedEvent(null)}>
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <h1 className="text-lg font-semibold text-gray-800">イベント詳細</h1>
            </div>
          </div>
        </header>

        <div className="max-w-md mx-auto px-4 py-6 space-y-6">
          <div
            className="w-full h-48 rounded-lg overflow-hidden"
            style={{
              background: `linear-gradient(to right, ${currentTheme.primary[200]}, ${currentTheme.accent[200]})`,
            }}
          >
            <img src={event.image || "/placeholder.svg"} alt={event.title} className="w-full h-full object-cover" />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <Badge
                style={{ backgroundColor: currentTheme.accent[100], color: currentTheme.accent[700] }}
                className="text-xs"
              >
                {categories.find((c) => c.id === event.category)?.name}
              </Badge>
              {event.status === "published" && (
                <Badge style={{ backgroundColor: currentTheme.primary[600], color: "white" }}>公開中</Badge>
              )}
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-1">{event.title}</h2>
            <p className="text-sm text-gray-600">{event.description}</p>
          </div>

          <ThemedCard>
            <CardContent className="pt-4 space-y-4">
              <div className="flex items-center space-x-3">
                <Calendar className="w-5 h-5" style={{ color: currentTheme.primary[600] }} />
                <div>
                  <div className="font-medium">{event.date}</div>
                  <div className="text-sm text-gray-600">{event.startTime}〜{event.endTime}</div>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <MapPin className="w-5 h-5 text-red-500" />
                <div className="font-medium">{event.location}</div>
              </div>

              <div className="flex items-center space-x-3">
                <Tag className="w-5 h-5" style={{ color: currentTheme.accent[500] }} />
                <div className="font-medium">{formatPrice(event.price)}</div>
              </div>
            </CardContent>
          </ThemedCard>

          <ThemedCard>
            <ThemedCardHeader>
              <CardTitle className="text-base">イベント詳細</CardTitle>
            </ThemedCardHeader>
            <CardContent>
              <p className="text-gray-700 mb-4">{event.details}</p>

              <div className="space-y-3">
                <div>
                  <h4 className="font-medium text-gray-800 mb-2">特典・サービス</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {event.benefits && event.benefits.length > 0 ? event.benefits.map((benefit, index) => (
                      <div key={index} className="flex items-center space-x-2 text-sm text-gray-600">
                        <div
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: currentTheme.accent[500] }}
                        ></div>
                        <span>{benefit}</span>
                      </div>
                    )) : <span className="text-xs text-gray-400">特典なし</span>}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-800 mb-1">主催</h4>
                  <p className="text-sm text-gray-600">{event.organizer}</p>
                </div>
              </div>
            </CardContent>
          </ThemedCard>


          <div className="space-y-3 pb-20">
            <ThemedButton variant="primary" className="w-full py-3" onClick={() => handleEventRegistration(event.id)}>
              参加申し込み
            </ThemedButton>
          </div>
        </div>
      </div>
      </div>
    )
  }

  if (loading) {
    return <div className="max-w-md mx-auto py-20 text-center text-gray-500">イベントを読み込み中...</div>
  }
  if (error) {
    return <div className="max-w-md mx-auto py-20 text-center text-red-500">{error}</div>
  }
  return (
    <>
    <div className="max-w-md mx-auto">
      <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b" style={{ borderColor: currentTheme.primary[100] }}>
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center space-x-3">
            <button onClick={() => router.back()}>
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-lg font-semibold text-gray-800">イベント</h1>
              <p className="text-sm text-gray-600">ImabariOne</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-6 space-y-6">
        {/* Category Filter */}
        <ThemedCard variant="accent">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium text-gray-800">カテゴリー</h3>
              <Filter className="w-4 h-4" style={{ color: currentTheme.accent[600] }} />
            </div>
            <div className="flex space-x-2 overflow-x-auto pb-2">
              {categories.map((category) => (
                <ThemedButton
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  variant={selectedCategory === category.id ? "primary" : "outline"}
                  size="sm"
                  className="flex-shrink-0"
                >
                  <span className="mr-1">{category.icon}</span>
                  {category.name}
                </ThemedButton>
              ))}
            </div>
          </CardContent>
        </ThemedCard>

        {/* Events List */}
        <div className="space-y-4 pb-20">
          {filteredEvents.map((event) => (
            <ThemedCard
              key={event.id}
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => setSelectedEvent(event.id)}
            >
              <CardContent className="pt-4">
                <div className="flex items-start space-x-3">
                  <div className="w-20 h-16 bg-gray-100 rounded-lg overflow-hidden">
                    <img
                      src={event.image || "/placeholder.svg"}
                      alt={event.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold text-gray-800 text-sm mb-1">{event.title}</h3>
                        <p className="text-xs text-gray-600">{event.description}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-gray-800">{event.date}</div>
                        <div className="text-sm text-gray-600">{event.startTime}〜{event.endTime}</div>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center text-xs text-gray-600">
                        <MapPin className="w-3 h-3 mr-1" />
                        {event.location}
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="text-xs text-gray-600">
                          {event.organizer}
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline" className="text-xs">
                            {formatPrice(event.price)}
                          </Badge>
                          {event.status === "published" && (
                            <Badge
                              style={{ backgroundColor: currentTheme.primary[600], color: "white" }}
                              className="text-xs"
                            >
                              公開中
                            </Badge>
                          )}
                          {event.benefits?.includes("trial-pack") && (
                            <Badge
                              className="text-xs"
                              style={{ backgroundColor: "rgb(0, 50, 115)", color: "white" }}
                            >
                              トライアル受取可
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </ThemedCard>
          ))}
        </div>
      </main>
    </div>
    </div>
    <BottomNavigation />
    </>
  )
}
