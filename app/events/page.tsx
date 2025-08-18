"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { ArrowLeft, Calendar, MapPin, Users, Heart, Star, Tag, Filter } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ThemedCard, ThemedCardHeader, CardContent, CardTitle } from "@/components/themed-card"
import { ThemedButton } from "@/components/themed-button"
import { useTheme } from "@/contexts/theme-context"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"

export default function EventsPage() {
  const router = useRouter()
  const search = useSearchParams()
  const { currentTheme } = useTheme()

  // Tabs: events only (removed meetups)
  const [selectedEvent, setSelectedEvent] = useState<number | null>(null)
  const [selectedCategory, setSelectedCategory] = useState("all")

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

  const events = [
    {
      id: 1,
      title: "ユニ・チャーム協業イベント",
      subtitle: "愛犬の健康ケア体験会",
      date: "8月20日（火）",
      time: "14:00-16:00",
      location: "FC今治 里山ドッグラン",
      organizer: "ユニ・チャーム × FC今治",
      participants: 12,
      maxParticipants: 20,
      category: "health",
      description:
        "愛犬の健康管理について学び、最新のペット用品を体験できるイベントです。獣医師による健康相談も実施します。",
      features: ["無料健康チェック", "ペット用品サンプル配布", "獣医師相談", "記念撮影"],
      image: "/placeholder.svg?height=200&width=300",
      price: "無料",
      status: "registered",
    },
    {
      id: 2,
      title: "アジリティ体験会",
      subtitle: "初心者向けドッグスポーツ",
      date: "8月25日（日）",
      time: "10:00-12:00",
      location: "FC今治 里山ドッグラン",
      organizer: "FC今治",
      participants: 8,
      maxParticipants: 15,
      category: "sports",
      description: "愛犬と一緒に楽しめるアジリティに挑戦！初心者でも安心してご参加いただけます。",
      features: ["専門インストラクター指導", "器具レンタル無料", "参加証明書", "軽食付き"],
      image: "/placeholder.svg?height=200&width=300",
      price: "¥2,000",
      status: "available",
    },
    {
      id: 3,
      title: "しまなみ散歩会",
      subtitle: "愛犬と楽しむ自然散策",
      date: "8月28日（水）",
      time: "9:00-11:00",
      location: "しまなみ海道周辺",
      organizer: "今治市観光協会",
      participants: 15,
      maxParticipants: 25,
      category: "outdoor",
      description: "美しいしまなみの景色を愛犬と一緒に楽しみながら、健康的な散歩を楽しみましょう。",
      features: ["ガイド付き", "写真撮影サービス", "地元特産品お土産", "ドリンク付き"],
      image: "/placeholder.svg?height=200&width=300",
      price: "¥1,500",
      status: "available",
    },
    {
      id: 4,
      title: "ペット防災セミナー",
      subtitle: "もしもの時に備えて",
      date: "9月3日（火）",
      time: "19:00-20:30",
      location: "今治市民館",
      organizer: "今治市役所",
      participants: 5,
      maxParticipants: 30,
      category: "education",
      description: "災害時にペットを守るための知識と準備について学びます。防災グッズの紹介も行います。",
      features: ["防災グッズ配布", "専門家講演", "質疑応答", "資料配布"],
      image: "/placeholder.svg?height=200&width=300",
      price: "無料",
      status: "available",
    },
  ]

  const categories = [
    { id: "all", name: "すべて", icon: "🏷️" },
    { id: "health", name: "健康", icon: "🏥" },
    { id: "sports", name: "スポーツ", icon: "🏃" },
    { id: "outdoor", name: "アウトドア", icon: "🌲" },
    { id: "education", name: "学習", icon: "📚" },
  ]

  const filteredEvents = selectedCategory === "all" ? events : events.filter((e) => e.category === selectedCategory)

  const handleEventRegistration = (eventId: number) => {
    const ev = events.find((e) => e.id === eventId)
    if (!ev) return
    if (ev.status === "registered") {
      alert("イベントの参加をキャンセルしました")
      ev.status = "available"
    } else {
      alert("イベントに参加申し込みしました！")
      ev.status = "registered"
    }
    setSelectedEvent(null)
  }

  const handleAddToFavorites = (eventId: number) => {
    alert("お気に入りに追加しました！")
  }

  // Event detail view stays within the Events tab UX
  if (selectedEvent) {
    const event = events.find((e) => e.id === selectedEvent)!
    return (
      <div className="max-w-md mx-auto">
        <div
          className="min-h-screen"
          style={{
            background: `linear-gradient(to bottom, ${currentTheme.primary[50]}, white, ${currentTheme.primary[100]})`,
        }}
      >
        <header className="bg-white shadow-sm border-b" style={{ borderColor: currentTheme.primary[100] }}>
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
              {event.status === "registered" && (
                <Badge style={{ backgroundColor: currentTheme.primary[600], color: "white" }}>参加予定</Badge>
              )}
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-1">{event.title}</h2>
            <p className="text-sm text-gray-600">{event.subtitle}</p>
          </div>

          <ThemedCard>
            <CardContent className="pt-4 space-y-4">
              <div className="flex items-center space-x-3">
                <Calendar className="w-5 h-5" style={{ color: currentTheme.primary[600] }} />
                <div>
                  <div className="font-medium">{event.date}</div>
                  <div className="text-sm text-gray-600">{event.time}</div>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <MapPin className="w-5 h-5 text-red-500" />
                <div className="font-medium">{event.location}</div>
              </div>

              <div className="flex items-center space-x-3">
                <Users className="w-5 h-5 text-blue-500" />
                <div>
                  <span className="font-medium">
                    {event.participants}/{event.maxParticipants}名
                  </span>
                  <span className="text-sm text-gray-600 ml-2">参加予定</span>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Tag className="w-5 h-5" style={{ color: currentTheme.accent[500] }} />
                <div className="font-medium">{event.price}</div>
              </div>
            </CardContent>
          </ThemedCard>

          <ThemedCard>
            <ThemedCardHeader>
              <CardTitle className="text-base">イベント内容</CardTitle>
            </ThemedCardHeader>
            <CardContent>
              <p className="text-gray-700 mb-4">{event.description}</p>

              <div className="space-y-3">
                <div>
                  <h4 className="font-medium text-gray-800 mb-2">特典・サービス</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {event.features.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-2 text-sm text-gray-600">
                        <div
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: currentTheme.accent[500] }}
                        ></div>
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-800 mb-1">主催</h4>
                  <p className="text-sm text-gray-600">{event.organizer}</p>
                </div>
              </div>
            </CardContent>
          </ThemedCard>

          {event.id === 1 && (
            <ThemedCard>
              <ThemedCardHeader>
                <CardTitle className="text-base">今日のケアに合う補助アイテム（ユニ・チャーム連携）</CardTitle>
              </ThemedCardHeader>
              <CardContent>
                <p className="text-xs text-gray-600 mb-3">
                  中立・誠実な提案です。購入前提ではありません（任意）。状態: 食事 {todayCare.meal} / 運動{" "}
                  {todayCare.exercise} / 排泄 {todayCare.stool}
                </p>
                <div className="space-y-3">
                  {recommendedItems.map((it) => (
                    <div key={it.id} className="flex items-start gap-3 rounded-lg bg-gray-50 p-3">
                      <div className="h-14 w-14 overflow-hidden rounded-md bg-white">
                        <img src={it.img || "/placeholder.svg"} alt={it.name} className="h-full w-full object-cover" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="mb-1 flex items-center justify-between">
                          <div className="text-sm font-medium text-gray-800">{it.name}</div>
                          <span
                            aria-hidden
                            className="h-2 w-2 rounded-full"
                            style={{ backgroundColor: "var(--brand-yellow)" }}
                          />
                        </div>
                        <ul className="list-disc pl-4">
                          {it.evidence.map((ev, idx) => (
                            <li key={idx} className="text-xs text-gray-600">
                              {ev}
                            </li>
                          ))}
                        </ul>
                        <p className="mt-1 text-xs" style={{ color: "var(--ink-3)" }}>
                          {it.note}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-3">
                  <ThemedButton
                    variant="primary"
                    className="w-full"
                    onClick={() => setTrialOpen(true)}
                  >
                    トライアルパックを申込（イベント会場で受取）
                  </ThemedButton>
                  {trialRequested && (
                    <p className="mt-2 text-xs" style={{ color: "var(--brand-navy)" }}>
                      申込済み：{event.title}（{event.date} {event.time}）で受取予定
                    </p>
                  )}
                  <p className="mt-2 text-[11px] text-gray-500">
                    ご提案は一般的な成分情報に基づく参考です。個体差があるため、かかりつけ等での相談もご検討ください。
                  </p>
                </div>
              </CardContent>
            </ThemedCard>
          )}

          <ThemedCard>
            <ThemedCardHeader>
              <CardTitle className="text-base">参加予定の飼い主さん</CardTitle>
            </ThemedCardHeader>
            <CardContent>
              <div className="flex space-x-2 mb-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Avatar key={i} className="w-8 h-8">
                    <AvatarFallback
                      style={{ backgroundColor: currentTheme.primary[100], color: currentTheme.primary[700] }}
                      className="text-xs"
                    >
                      {String.fromCharCode(65 + i)}
                    </AvatarFallback>
                  </Avatar>
                ))}
                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                  <span className="text-xs text-gray-600">+{Math.max(event.participants - 5, 0)}</span>
                </div>
              </div>
              <p className="text-xs text-gray-600">同じ地域の愛犬家の皆さんが参加予定です</p>
            </CardContent>
          </ThemedCard>

          <div className="space-y-3 pb-20">
            {event.status === "registered" ? (
              <ThemedButton variant="outline" className="w-full py-3" onClick={() => handleEventRegistration(event.id)}>
                参加予定（キャンセル可能）
              </ThemedButton>
            ) : (
              <ThemedButton variant="primary" className="w-full py-3" onClick={() => handleEventRegistration(event.id)}>
                参加申し込み
              </ThemedButton>
            )}
          </div>
        </div>

        <Dialog open={trialOpen} onOpenChange={setTrialOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="text-brand-navy">トライアルパック申込（受取場所の確認）</DialogTitle>
              <DialogDescription className="text-xs text-gray-500">
                受取はイベント会場で行います。費用はかかりません（数量限定）。
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-3">
              <div className="rounded-lg bg-gray-50 p-3">
                <div className="text-sm font-medium text-gray-800">受取イベント</div>
                <div className="text-xs text-gray-600">{event.title}</div>
                <div className="text-xs text-gray-600">
                  {event.date} • {event.time} • {event.location}
                </div>
              </div>
              <button
                className="w-full rounded-md px-4 py-2 text-sm font-medium shadow-sm"
                style={{ backgroundColor: "var(--brand-blue)", color: "white" }}
                onClick={() => {
                  setTrialOpen(false)
                  setTrialRequested(true)
                  const el = document.createElement("div")
                  el.textContent = "トライアル申込を受け付けました。当日会場でお受け取りください。"
                  el.className =
                    "fixed left-1/2 top-4 -translate-x-1/2 rounded-md bg-brand-blue px-4 py-2 text-white shadow-md z-[60]"
                  document.body.appendChild(el)
                  setTimeout(() => el.remove(), 1600)
                }}
              >
                このイベントで受け取る
              </button>
              <p className="text-[11px] text-gray-500">
                押し売りはいたしません。数量に限りがあるため、お渡しできない場合があります。
              </p>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      </div>
    )
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

        {/* Featured Event */}
        <ThemedCard variant="primary">
          <ThemedCardHeader variant="primary">
            <CardTitle className="text-base flex items-center">
              <Star className="w-4 h-4 mr-2" />
              注目のイベント
            </CardTitle>
          </ThemedCardHeader>
          <CardContent>
            <div className="cursor-pointer" onClick={() => setSelectedEvent(1)}>
              <div className="flex items-start space-x-3">
                <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center shadow-sm">
                  <span className="text-2xl">🏥</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800 mb-1">ユニ・チャーム協業イベント</h3>
                  <p className="text-sm text-gray-600 mb-2">愛犬の健康ケア体験会</p>
                  <div className="flex items-center space-x-2 text-xs text-gray-500">
                    <Calendar className="w-3 h-3" />
                    <span>8/20（火）14:00-16:00</span>
                  </div>
                  <Badge
                    style={{ backgroundColor: currentTheme.primary[600], color: "white" }}
                    className="text-xs mt-2"
                  >
                    参加予定
                  </Badge>
                </div>
              </div>
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
                        <p className="text-xs text-gray-600">{event.subtitle}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-gray-800">{event.date}</div>
                        <div className="text-sm text-gray-600">{event.time}</div>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center text-xs text-gray-600">
                        <MapPin className="w-3 h-3 mr-1" />
                        {event.location}
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-xs text-gray-600">
                          <Users className="w-3 h-3 mr-1" />
                          {event.participants}/{event.maxParticipants}名参加予定
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline" className="text-xs">
                            {event.price}
                          </Badge>
                          {event.status === "registered" && (
                            <Badge
                              style={{ backgroundColor: currentTheme.primary[600], color: "white" }}
                              className="text-xs"
                            >
                              参加予定
                            </Badge>
                          )}
                          {event.id === 1 && (
                            <Badge
                              className="text-xs"
                              style={{ backgroundColor: "var(--brand-yellow)", color: "var(--ink-1)" }}
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
  )
}
