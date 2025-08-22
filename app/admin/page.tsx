"use client"

import { useState } from "react"
import { ThemedCard, ThemedCardHeader, CardContent } from "@/components/themed-card"
import { ThemedButton } from "@/components/themed-button"
import { useTheme } from "@/contexts/theme-context"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import {
  Users,
  Calendar,
  MessageSquare,
  DollarSign,
  Search,
  Download,
  Edit,
  Eye,
  LogOut,
  Shield,
  Settings,
  Trash2,
  UserCheck,
  UserX,
  Heart,
  TreePine,
  BookOpen,
  Camera,
  Save,
  Plus,
  Zap,
  Trophy,
} from "lucide-react"

import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

interface Booking {
  id: string
  customerName: string
  dogName: string
  service: string
  serviceType: "nursery" | "dogrun"
  date: string
  time: string
  status: "confirmed" | "pending" | "completed" | "cancelled"
  amount: number
}

interface User {
  id: string
  name: string
  email: string
  dogCount: number
  totalBookings: number
  lastActive: string
  status: "active" | "inactive" | "suspended"
  role: "user" | "admin" | "super_admin"
}

const mockBookings: Booking[] = [
  {
    id: "1",
    customerName: "田中太郎",
    dogName: "ルイ",
    service: "一日預かり",
    serviceType: "nursery",
    date: "2024-01-15",
    time: "09:00-17:00",
    status: "confirmed",
    amount: 5000,
  },
  {
    id: "2",
    customerName: "佐藤花子",
    dogName: "ココ",
    service: "半日預かり",
    serviceType: "nursery",
    date: "2024-01-15",
    time: "13:00-17:00",
    status: "pending",
    amount: 3000,
  },
  {
    id: "3",
    customerName: "鈴木一郎",
    dogName: "チョコ",
    service: "一日預かり",
    serviceType: "nursery",
    date: "2024-01-16",
    time: "09:00-17:00",
    status: "completed",
    amount: 5000,
  },
  {
    id: "4",
    customerName: "山田美咲",
    dogName: "モモ",
    service: "ドッグラン利用",
    serviceType: "dogrun",
    date: "2024-01-15",
    time: "10:00-12:00",
    status: "confirmed",
    amount: 1500,
  },
  {
    id: "5",
    customerName: "高橋健太",
    dogName: "ハナ",
    service: "ドッグラン利用",
    serviceType: "dogrun",
    date: "2024-01-16",
    time: "14:00-16:00",
    status: "completed",
    amount: 1500,
  },
]

const mockUsers: User[] = [
  {
    id: "1",
    name: "田中太郎",
    email: "tanaka@example.com",
    dogCount: 1,
    totalBookings: 15,
    lastActive: "2時間前",
    status: "active",
    role: "user",
  },
  {
    id: "2",
    name: "佐藤花子",
    email: "sato@example.com",
    dogCount: 2,
    totalBookings: 8,
    lastActive: "1日前",
    status: "active",
    role: "user",
  },
  {
    id: "3",
    name: "鈴木一郎",
    email: "suzuki@example.com",
    dogCount: 1,
    totalBookings: 3,
    lastActive: "1週間前",
    status: "suspended",
    role: "user",
  },
  {
    id: "4",
    name: "管理者 花子",
    email: "admin@example.com",
    dogCount: 0,
    totalBookings: 0,
    lastActive: "30分前",
    status: "active",
    role: "admin",
  },
]

import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"

function AdminHeader() {
  const user = { name: "管理者", role: "admin" }
  const { currentTheme } = useTheme()
  const { logout } = useAuth()
  const router = useRouter()

  return (
    <div
      className="bg-white rounded-xl shadow-lg border-t-4 p-8 mb-8"
      style={{ borderTopColor: currentTheme.primary[500] }}
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">管理者ダッシュボード</h1>
          <p className="text-lg text-gray-600">施設の運営状況を管理</p>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-4">
            <Avatar className="w-12 h-12">
              <AvatarFallback className="text-lg font-semibold">{user?.name[0]}</AvatarFallback>
            </Avatar>
            <div className="text-right">
              <p className="font-semibold text-lg">{user?.name}</p>
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4" style={{ color: currentTheme.primary[500] }} />
                <Badge
                  className="text-white"
                  style={{
                    backgroundColor:
                      user?.role === "super_admin" ? currentTheme.accent[500] : currentTheme.primary[500],
                  }}
                >
                  {user?.role === "super_admin" ? "スーパー管理者" : "管理者"}
                </Badge>
              </div>
            </div>
          </div>
          <ThemedButton
            variant="outline"
            size="lg"
            onClick={() => {
              logout();
              router.push("/login");
            }}
          >
            <LogOut className="w-5 h-5 mr-2" />
            ログアウト
          </ThemedButton>
        </div>
      </div>
    </div>
  )
}

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState("dashboard")
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [serviceTypeFilter, setServiceTypeFilter] = useState("all")
  const [eventForm, setEventForm] = useState({
    title: "",
    category: "",
    description: "",
    date: "",
    startTime: "",
    endTime: "",
    location: "",
    organizer: "",
    price: "",
    customPrice: "",
    image: "",
    details: "",
    benefits: [] as string[],
    target: [] as string[],
    status: "draft" as "draft" | "published" | "archived"
  })
  const [contactForm, setContactForm] = useState({
    userId: "",
    dogName: "",
    date: new Date().toISOString().split("T")[0],
    meal: {
      status: "",
      time: "",
      note: "",
    },
    excretion: {
      status: "",
      time: "",
      note: "",
    },
    bodyHandling: {
      ears: "ok",
      mouth: "ok",
      paws: "ok",
      tail: "ok",
      back: "ok",
    },
    separationAnxiety: 1,
    energyLevel: 3,
    greetingStyle: [] as string[],
    excitedBehaviors: [] as string[],
    cooldownMethods: [] as string[],
    preferredDogTypes: [] as string[],
    difficultDogTypes: [] as string[],
    specificPairings: "",
    totalVisits: 0,
    totalHours: 0,
    frequency: "",
    toiletSuccessRate: 100,
    trainingPrograms: [] as string[],
    eventParticipation: {
      walks: 0,
      dogRun: 0,
      training: 0,
    },
    staffNote: "",
    photos: [] as string[],
  })
  const { currentTheme } = useTheme()

  const [isGeneratingMessage, setIsGeneratingMessage] = useState(false)

  const [dogBehavior, setDogBehavior] = useState({
    energy: [],
    mood: [],
    social: [],
    activity: [],
  })

  const generateStaffMessage = async () => {
    setIsGeneratingMessage(true)
    try {
      const mealStatus = contactForm.meal.status || "記録なし"
      const mealTime = contactForm.meal.time || "記録なし"
      const mealMemo = contactForm.meal.note || "記録なし"
      const excretionStatus = contactForm.excretion.status || "記録なし"
      const excretionTime = contactForm.excretion.time || "記録なし"
      const excretionMemo = contactForm.excretion.note || "記録なし"

      const behaviorInfo = {
        energy: dogBehavior.energy.join(", ") || "記録なし",
        mood: dogBehavior.mood.join(", ") || "記録なし",
        social: dogBehavior.social.join(", ") || "記録なし",
        activity: dogBehavior.activity.join(", ") || "記録なし",
      }

      const prompt = `
保育園での愛犬の今日の記録を基に、保護者向けの温かく親しみやすいメッセージを生成してください。

【今日の記録】
食事：
- 状態: ${mealStatus}
- 時間: ${mealTime}
- メモ: ${mealMemo}

排泄：
- 状態: ${excretionStatus}
- 時間: ${excretionTime}
- メモ: ${excretionMemo}

【今日の様子】
- 元気度: ${behaviorInfo.energy}
- 気分・表情: ${behaviorInfo.mood}
- お友達との関係: ${behaviorInfo.social}
- 活動・遊び: ${behaviorInfo.activity}

【メッセージ作成のポイント】
- 保護者が安心できるような温かい表現を使用
- 愛犬の様子を具体的に伝える
- 選択された行動や様子を自然に文章に組み込む
- 200-250文字程度で簡潔に
- 敬語を使用し、丁寧な文体で
- 愛犬の名前は「○○ちゃん」として記載
      `

      const { text } = await generateText({
        model: openai("gpt-4"),
        prompt: prompt,
      })

      setContactForm({ ...contactForm, staffNote: text })
    } catch (error) {
      console.error("AI生成エラー:", error)
      alert("メッセージの生成に失敗しました。もう一度お試しください。")
    } finally {
      setIsGeneratingMessage(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const baseStyle = "font-medium px-3 py-1"
    switch (status) {
      case "confirmed":
        return (
          <Badge className={`${baseStyle} text-white`} style={{ backgroundColor: currentTheme.primary[500] }}>
            確定
          </Badge>
        )
      case "pending":
        return (
          <Badge className={`${baseStyle} text-white`} style={{ backgroundColor: currentTheme.accent[500] }}>
            保留中
          </Badge>
        )
      case "completed":
        return <Badge className={`${baseStyle} bg-green-500 text-white`}>完了</Badge>
      case "cancelled":
        return <Badge className={`${baseStyle} bg-red-500 text-white`}>キャンセル</Badge>
      default:
        return (
          <Badge variant="secondary" className={baseStyle}>
            {status}
          </Badge>
        )
    }
  }

  const getUserStatusBadge = (status: string) => {
    const baseStyle = "font-medium px-3 py-1"
    switch (status) {
      case "active":
        return <Badge className={`${baseStyle} bg-green-500 text-white`}>アクティブ</Badge>
      case "inactive":
        return <Badge className={`${baseStyle} bg-gray-500 text-white`}>非アクティブ</Badge>
      case "suspended":
        return <Badge className={`${baseStyle} bg-red-500 text-white`}>停止中</Badge>
      default:
        return (
          <Badge variant="secondary" className={baseStyle}>
            {status}
          </Badge>
        )
    }
  }

  const getRoleBadge = (role: string) => {
    const baseStyle = "font-medium px-3 py-1"
    switch (role) {
      case "super_admin":
        return (
          <Badge className={`${baseStyle} text-white`} style={{ backgroundColor: currentTheme.accent[600] }}>
            スーパー管理者
          </Badge>
        )
      case "admin":
        return (
          <Badge className={`${baseStyle} text-white`} style={{ backgroundColor: currentTheme.primary[500] }}>
            管理者
          </Badge>
        )
      case "user":
        return (
          <Badge variant="secondary" className={baseStyle}>
            一般ユーザー
          </Badge>
        )
      default:
        return (
          <Badge variant="secondary" className={baseStyle}>
            {role}
          </Badge>
        )
    }
  }

  const filteredBookings = mockBookings.filter((booking) => {
    const matchesSearch =
      booking.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.dogName.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || booking.status === statusFilter
    const matchesServiceType = serviceTypeFilter === "all" || booking.serviceType === serviceTypeFilter
    return matchesSearch && matchesStatus && matchesServiceType
  })

  const nurseryBookings = filteredBookings.filter((booking) => booking.serviceType === "nursery")
  const dogrunBookings = filteredBookings.filter((booking) => booking.serviceType === "dogrun")

  const filteredUsers = mockUsers.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesSearch
  })

  const handleEventSubmit = () => {
    console.log("イベントデータ:", eventForm)
    // ここで実際のAPI呼び出しを行う
    alert("イベントが保存されました")
    // フォームをリセット
    setEventForm({
      title: "",
      category: "",
      description: "",
      date: "",
      startTime: "",
      endTime: "",
      location: "",
      organizer: "",
      price: "",
      customPrice: "",
      image: "",
      details: "",
      benefits: [],
      target: [],
      status: "draft"
    })
  }

  const handleContactSubmit = () => {
    console.log("連絡帳データ:", contactForm)
    // ここで実際のAPI呼び出しを行う
    alert("連絡帳が保存されました")
    // フォームをリセット
    setContactForm({
      userId: "",
      dogName: "",
      date: new Date().toISOString().split("T")[0],
      meal: {
        status: "",
        time: "",
        note: "",
      },
      excretion: {
        status: "",
        time: "",
        note: "",
      },
      bodyHandling: {
        ears: "ok",
        mouth: "ok",
        paws: "ok",
        tail: "ok",
        back: "ok",
      },
      separationAnxiety: 1,
      energyLevel: 3,
      greetingStyle: [],
      excitedBehaviors: [],
      cooldownMethods: [],
      preferredDogTypes: [],
      difficultDogTypes: [],
      specificPairings: "",
      totalVisits: 0,
      totalHours: 0,
      frequency: "",
      toiletSuccessRate: 100,
      trainingPrograms: [],
      eventParticipation: {
        walks: 0,
        dogRun: 0,
        training: 0,
      },
      staffNote: "",
      photos: [],
    })
  }

  return (
    <div
      className="min-h-screen"
      style={{
        background: `linear-gradient(to bottom, ${currentTheme.primary[50]}, white, ${currentTheme.primary[100]})`,
      }}
    >
      <div className="max-w-7xl mx-auto px-6 py-8">
        <AdminHeader />

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-6 mb-8 h-14 bg-white shadow-sm rounded-xl">
            <TabsTrigger value="dashboard" className="text-sm font-medium py-3">
              ダッシュボード
            </TabsTrigger>
            <TabsTrigger value="bookings" className="text-sm font-medium py-3">
              予約管理
            </TabsTrigger>
            <TabsTrigger value="users" className="text-sm font-medium py-3">
              ユーザー管理
            </TabsTrigger>
            <TabsTrigger value="contact" className="text-sm font-medium py-3">
              連絡帳管理
            </TabsTrigger>
            <TabsTrigger value="events" className="text-sm font-medium py-3">
              イベント登録
            </TabsTrigger>
            <TabsTrigger value="system" className="text-sm font-medium py-3">
              システム設定
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <ThemedCard variant="primary" className="hover:shadow-lg transition-shadow">
                <ThemedCardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                  <h3 className="text-sm font-semibold">今日の予約</h3>
                  <Calendar className="h-6 w-6" style={{ color: currentTheme.primary[500] }} />
                </ThemedCardHeader>
                <CardContent>
                  <div className="text-3xl font-bold mb-1">12</div>
                  <p className="text-sm text-gray-600">前日比 +2</p>
                </CardContent>
              </ThemedCard>

              <ThemedCard variant="accent" className="hover:shadow-lg transition-shadow">
                <ThemedCardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                  <h3 className="text-sm font-semibold">総売上（今月）</h3>
                  <DollarSign className="h-6 w-6" style={{ color: currentTheme.accent[500] }} />
                </ThemedCardHeader>
                <CardContent>
                  <div className="text-3xl font-bold mb-1">¥245,000</div>
                  <p className="text-sm text-gray-600">前月比 +12%</p>
                </CardContent>
              </ThemedCard>

              <ThemedCard variant="primary" className="hover:shadow-lg transition-shadow">
                <ThemedCardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                  <h3 className="text-sm font-semibold">アクティブユーザー</h3>
                  <Users className="h-6 w-6" style={{ color: currentTheme.primary[500] }} />
                </ThemedCardHeader>
                <CardContent>
                  <div className="text-3xl font-bold mb-1">89</div>
                  <p className="text-sm text-gray-600">前週比 +5</p>
                </CardContent>
              </ThemedCard>

              <ThemedCard variant="accent" className="hover:shadow-lg transition-shadow">
                <ThemedCardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                  <h3 className="text-sm font-semibold">掲示板投稿</h3>
                  <MessageSquare className="h-6 w-6" style={{ color: currentTheme.accent[500] }} />
                </ThemedCardHeader>
                <CardContent>
                  <div className="text-3xl font-bold mb-1">23</div>
                  <p className="text-sm text-gray-600">今日の新規投稿</p>
                </CardContent>
              </ThemedCard>
            </div>

            <ThemedCard className="shadow-lg">
              <ThemedCardHeader className="pb-4">
                <h3 className="text-xl font-bold">最近の予約</h3>
              </ThemedCardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockBookings.slice(0, 5).map((booking) => (
                    <div
                      key={booking.id}
                      className="flex items-center justify-between p-5 border rounded-xl hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <Avatar className="w-12 h-12">
                          <AvatarFallback className="text-lg font-semibold">{booking.customerName[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold text-lg">{booking.customerName}</p>
                          <p className="text-gray-600 font-medium">
                            {booking.dogName} - {booking.service}
                          </p>
                          <p className="text-sm text-gray-500">
                            {booking.date} {booking.time}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        {getStatusBadge(booking.status)}
                        <span className="font-bold text-lg">¥{booking.amount.toLocaleString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </ThemedCard>
          </TabsContent>

          <TabsContent value="bookings" className="space-y-6">
            <div className="flex gap-4 items-center bg-white p-6 rounded-xl shadow-sm">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  placeholder="顧客名・犬名で検索..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 h-12 text-lg"
                />
              </div>
              <Select value={serviceTypeFilter} onValueChange={setServiceTypeFilter}>
                <SelectTrigger className="w-48 h-12">
                  <SelectValue placeholder="サービス種別" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">すべて</SelectItem>
                  <SelectItem value="nursery">保育園</SelectItem>
                  <SelectItem value="dogrun">ドッグラン</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-48 h-12">
                  <SelectValue placeholder="ステータス" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">すべて</SelectItem>
                  <SelectItem value="confirmed">確定</SelectItem>
                  <SelectItem value="pending">保留中</SelectItem>
                  <SelectItem value="completed">完了</SelectItem>
                  <SelectItem value="cancelled">キャンセル</SelectItem>
                </SelectContent>
              </Select>
              <ThemedButton variant="outline" size="lg">
                <Download className="w-5 h-5 mr-2" />
                エクスポート
              </ThemedButton>
            </div>

            {(serviceTypeFilter === "all" || serviceTypeFilter === "nursery") && nurseryBookings.length > 0 && (
              <ThemedCard className="shadow-lg">
                <ThemedCardHeader className="pb-4">
                  <h3 className="text-xl font-bold flex items-center gap-3">
                    <Heart className="w-6 h-6" style={{ color: currentTheme.primary[500] }} />
                    保育園予約一覧
                  </h3>
                </ThemedCardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {nurseryBookings.map((booking) => (
                      <div
                        key={booking.id}
                        className="flex items-center justify-between p-5 border rounded-xl hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <Avatar className="w-12 h-12">
                            <AvatarFallback className="text-lg font-semibold">{booking.customerName[0]}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-semibold text-lg">{booking.customerName}</p>
                            <p className="text-gray-600 font-medium">
                              {booking.dogName} - {booking.service}
                            </p>
                            <p className="text-sm text-gray-500">
                              {booking.date} {booking.time}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          {getStatusBadge(booking.status)}
                          <span className="font-bold text-lg">¥{booking.amount.toLocaleString()}</span>
                          <div className="flex gap-2">
                            <ThemedButton variant="ghost" size="sm">
                              <Eye className="w-5 h-5" />
                            </ThemedButton>
                            <ThemedButton variant="ghost" size="sm">
                              <Edit className="w-5 h-5" />
                            </ThemedButton>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </ThemedCard>
            )}

            {(serviceTypeFilter === "all" || serviceTypeFilter === "dogrun") && dogrunBookings.length > 0 && (
              <ThemedCard className="shadow-lg">
                <ThemedCardHeader className="pb-4">
                  <h3 className="text-xl font-bold flex items-center gap-3">
                    <TreePine className="w-6 h-6" style={{ color: currentTheme.accent[500] }} />
                    ドッグラン予約一覧
                  </h3>
                </ThemedCardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {dogrunBookings.map((booking) => (
                      <div
                        key={booking.id}
                        className="flex items-center justify-between p-5 border rounded-xl hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <Avatar className="w-12 h-12">
                            <AvatarFallback className="text-lg font-semibold">{booking.customerName[0]}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-semibold text-lg">{booking.customerName}</p>
                            <p className="text-gray-600 font-medium">
                              {booking.dogName} - {booking.service}
                            </p>
                            <p className="text-sm text-gray-500">
                              {booking.date} {booking.time}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          {getStatusBadge(booking.status)}
                          <span className="font-bold text-lg">¥{booking.amount.toLocaleString()}</span>
                          <div className="flex gap-2">
                            <ThemedButton variant="ghost" size="sm">
                              <Eye className="w-5 h-5" />
                            </ThemedButton>
                            <ThemedButton variant="ghost" size="sm">
                              <Edit className="w-5 h-5" />
                            </ThemedButton>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </ThemedCard>
            )}

            {filteredBookings.length === 0 && (
              <ThemedCard className="shadow-lg">
                <CardContent className="text-center py-16">
                  <Calendar className="w-16 h-16 mx-auto text-gray-400 mb-6" />
                  <h3 className="text-2xl font-semibold text-gray-900 mb-3">予約が見つかりません</h3>
                  <p className="text-lg text-gray-600">検索条件を変更してお試しください</p>
                </CardContent>
              </ThemedCard>
            )}
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <div className="flex gap-4 items-center bg-white p-6 rounded-xl shadow-sm">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  placeholder="ユーザー名・メールアドレスで検索..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 h-12 text-lg"
                />
              </div>
              <ThemedButton variant="outline" size="lg">
                <Download className="w-5 h-5 mr-2" />
                エクスポート
              </ThemedButton>
            </div>

            <ThemedCard className="shadow-lg">
              <ThemedCardHeader className="pb-4">
                <h3 className="text-xl font-bold">ユーザー一覧</h3>
              </ThemedCardHeader>
              <CardContent>
                <div className="space-y-3">
                  {filteredUsers.map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center justify-between p-5 border rounded-xl hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <Avatar className="w-12 h-12">
                          <AvatarFallback className="text-lg font-semibold">{user.name[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <p className="font-semibold text-lg">{user.name}</p>
                            {getRoleBadge(user.role)}
                          </div>
                          <p className="text-gray-600 font-medium">{user.email}</p>
                          <p className="text-sm text-gray-500">
                            愛犬{user.dogCount}匹 • 予約{user.totalBookings}回 • {user.lastActive}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        {getUserStatusBadge(user.status)}
                        <div className="flex gap-2">
                          <ThemedButton variant="ghost" size="sm">
                            <Eye className="w-5 h-5" />
                          </ThemedButton>
                          <ThemedButton variant="ghost" size="sm">
                            <Edit className="w-5 h-5" />
                          </ThemedButton>
                          {user.role !== "super_admin" && (
                            <>
                              {user.status === "active" ? (
                                <ThemedButton variant="ghost" size="sm" className="text-red-600 hover:bg-red-50">
                                  <UserX className="w-5 h-5" />
                                </ThemedButton>
                              ) : (
                                <ThemedButton variant="ghost" size="sm" className="text-green-600 hover:bg-green-50">
                                  <UserCheck className="w-5 h-5" />
                                </ThemedButton>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </ThemedCard>
          </TabsContent>

          <TabsContent value="contact" className="space-y-6">
            <ThemedCard className="shadow-lg">
              <ThemedCardHeader className="pb-4">
                <h3 className="text-xl font-bold flex items-center gap-3">
                  <BookOpen className="w-6 h-6" style={{ color: currentTheme.primary[500] }} />
                  保育園連絡帳入力
                </h3>
              </ThemedCardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="userId" className="text-sm font-medium">
                      ユーザー選択
                    </Label>
                    <Select
                      value={contactForm.userId}
                      onValueChange={(value) => setContactForm({ ...contactForm, userId: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="ユーザーを選択してください" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">田中太郎 (ルイ)</SelectItem>
                        <SelectItem value="2">佐藤花子 (ココ)</SelectItem>
                        <SelectItem value="3">鈴木一郎 (チョコ)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="date" className="text-sm font-medium">
                      日付
                    </Label>
                    <Input
                      id="date"
                      type="date"
                      value={contactForm.date}
                      onChange={(e) => setContactForm({ ...contactForm, date: e.target.value })}
                    />
                  </div>
                </div>

                <ThemedCard variant="primary">
                  <ThemedCardHeader variant="primary">
                    <h4 className="text-lg font-semibold flex items-center gap-2">
                      <Heart className="w-5 h-5" />
                      身体のふれあい（お手入れ時の様子）
                    </h4>
                  </ThemedCardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {[
                        { key: "ears", label: "耳" },
                        { key: "mouth", label: "口周り" },
                        { key: "paws", label: "足先" },
                        { key: "tail", label: "尻尾" },
                        { key: "back", label: "背中" },
                      ].map((part) => (
                        <div key={part.key} className="space-y-2">
                          <Label className="text-sm font-medium">{part.label}</Label>
                          <Select
                            value={contactForm.bodyHandling[part.key as keyof typeof contactForm.bodyHandling]}
                            onValueChange={(value) =>
                              setContactForm({
                                ...contactForm,
                                bodyHandling: {
                                  ...contactForm.bodyHandling,
                                  [part.key]: value,
                                },
                              })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="ok">問題なし</SelectItem>
                              <SelectItem value="slightly_dislikes">少し嫌がる</SelectItem>
                              <SelectItem value="clearly_dislikes">明確に嫌がる</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </ThemedCard>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <ThemedCard variant="accent">
                    <ThemedCardHeader variant="accent">
                      <h4 className="text-lg font-semibold flex items-center gap-2">
                        <Users className="w-5 h-5" />
                        お別れの時の様子
                      </h4>
                    </ThemedCardHeader>
                    <CardContent className="space-y-3">
                      <Select
                        value={contactForm.separationAnxiety.toString()}
                        onValueChange={(value) =>
                          setContactForm({
                            ...contactForm,
                            separationAnxiety: Number.parseInt(value) as 1 | 2 | 3 | 4,
                          })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">レベル1: 落ち着いている</SelectItem>
                          <SelectItem value="2">レベル2: 少し鳴く・クンクン言う</SelectItem>
                          <SelectItem value="3">レベル3: 鳴き続ける</SelectItem>
                          <SelectItem value="4">レベル4: パニック・破壊行動の兆候</SelectItem>
                        </SelectContent>
                      </Select>
                    </CardContent>
                  </ThemedCard>

                  <ThemedCard>
                    <ThemedCardHeader>
                      <h4 className="text-lg font-semibold flex items-center gap-2">
                        <Zap className="w-5 h-5" />
                        元気度・活発さ
                      </h4>
                    </ThemedCardHeader>
                    <CardContent className="space-y-3">
                      <Select
                        value={contactForm.energyLevel.toString()}
                        onValueChange={(value) =>
                          setContactForm({
                            ...contactForm,
                            energyLevel: Number.parseInt(value) as 1 | 2 | 3 | 4 | 5,
                          })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1: 非常に穏やか</SelectItem>
                          <SelectItem value="2">2: 穏やか</SelectItem>
                          <SelectItem value="3">3: 普通</SelectItem>
                          <SelectItem value="4">4: 活発</SelectItem>
                          <SelectItem value="5">5: 非常に活発</SelectItem>
                        </SelectContent>
                      </Select>
                    </CardContent>
                  </ThemedCard>
                </div>

                <ThemedCard variant="primary">
                  <ThemedCardHeader variant="primary">
                    <h4 className="text-lg font-semibold">🍽️ 食事記録</h4>
                  </ThemedCardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">状態</Label>
                        <Select
                          value={contactForm.meal.status}
                          onValueChange={(value) =>
                            setContactForm({
                              ...contactForm,
                              meal: { ...contactForm.meal, status: value },
                            })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="選択" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="完食">完食</SelectItem>
                            <SelectItem value="半分程度">半分程度</SelectItem>
                            <SelectItem value="少し">少し</SelectItem>
                            <SelectItem value="未食">未食</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sm font-medium">時間</Label>
                        <Input
                          type="time"
                          value={contactForm.meal.time}
                          onChange={(e) =>
                            setContactForm({
                              ...contactForm,
                              meal: { ...contactForm.meal, time: e.target.value },
                            })
                          }
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sm font-medium">メモ</Label>
                        <Input
                          placeholder="食事の様子"
                          value={contactForm.meal.note}
                          onChange={(e) =>
                            setContactForm({
                              ...contactForm,
                              meal: { ...contactForm.meal, note: e.target.value },
                            })
                          }
                        />
                      </div>
                    </div>
                  </CardContent>
                </ThemedCard>

                <ThemedCard variant="accent">
                  <ThemedCardHeader variant="accent">
                    <h4 className="text-lg font-semibold">🚽 排泄記録</h4>
                  </ThemedCardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">状態</Label>
                        <Select
                          value={contactForm.excretion.status}
                          onValueChange={(value) =>
                            setContactForm({
                              ...contactForm,
                              excretion: { ...contactForm.excretion, status: value },
                            })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="選択" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="良好">良好</SelectItem>
                            <SelectItem value="やや軟便">やや軟便</SelectItem>
                            <SelectItem value="軟便">軟便</SelectItem>
                            <SelectItem value="下痢">下痢</SelectItem>
                            <SelectItem value="便秘">便秘</SelectItem>
                            <SelectItem value="なし">なし</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sm font-medium">時間</Label>
                        <Input
                          type="time"
                          value={contactForm.excretion.time}
                          onChange={(e) =>
                            setContactForm({
                              ...contactForm,
                              excretion: { ...contactForm.excretion, time: e.target.value },
                            })
                          }
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sm font-medium">メモ</Label>
                        <Input
                          placeholder="排泄の様子"
                          value={contactForm.excretion.note}
                          onChange={(e) =>
                            setContactForm({
                              ...contactForm,
                              excretion: { ...contactForm.excretion, note: e.target.value },
                            })
                          }
                        />
                      </div>
                    </div>
                  </CardContent>
                </ThemedCard>

                <ThemedCard>
                  <ThemedCardHeader>
                    <h4 className="text-lg font-semibold flex items-center gap-2">
                      <Users className="w-5 h-5" />
                      挨拶スタイル・行動特性
                    </h4>
                  </ThemedCardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <Label className="text-sm font-semibold">挨拶スタイル（複数選択可）</Label>
                        <div className="space-y-2">
                          {["友好的", "慎重派", "マイペース", "受け身", "やや苦手"].map((style) => (
                            <div key={style} className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                id={`greeting-${style}`}
                                checked={contactForm.greetingStyle.includes(style)}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setContactForm({
                                      ...contactForm,
                                      greetingStyle: [...contactForm.greetingStyle, style],
                                    })
                                  } else {
                                    setContactForm({
                                      ...contactForm,
                                      greetingStyle: contactForm.greetingStyle.filter((s) => s !== style),
                                    })
                                  }
                                }}
                                className="w-4 h-4"
                              />
                              <Label htmlFor={`greeting-${style}`} className="text-sm">
                                {style}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-3">
                        <Label className="text-sm font-semibold">興奮時の行動（複数選択可）</Label>
                        <div className="space-y-2">
                          {[
                            "要求吠え",
                            "飛びつき",
                            "甘噛み",
                            "マウンティング",
                            "走り回る",
                            "他の犬を執拗に追いかける",
                          ].map((behavior) => (
                            <div key={behavior} className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                id={`excited-${behavior}`}
                                checked={contactForm.excitedBehaviors.includes(behavior)}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setContactForm({
                                      ...contactForm,
                                      excitedBehaviors: [...contactForm.excitedBehaviors, behavior],
                                    })
                                  } else {
                                    setContactForm({
                                      ...contactForm,
                                      excitedBehaviors: contactForm.excitedBehaviors.filter((b) => b !== behavior),
                                    })
                                  }
                                }}
                                className="w-4 h-4"
                              />
                              <Label htmlFor={`excited-${behavior}`} className="text-sm">
                                {behavior}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Label className="text-sm font-semibold">効果的な落ち着かせ方（複数選択可）</Label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {[
                          "ハウス/クレートでの休息",
                          "知育トイ/ノーズワーク",
                          "マッサージ/撫でる",
                          "他の犬から隔離し、静かな場所で休ませる",
                          "コマンドでの指示（ふせ、まて）",
                        ].map((method) => (
                          <div key={method} className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              id={`cooldown-${method}`}
                              checked={contactForm.cooldownMethods.includes(method)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setContactForm({
                                    ...contactForm,
                                    cooldownMethods: [...contactForm.cooldownMethods, method],
                                  })
                                } else {
                                  setContactForm({
                                    ...contactForm,
                                    cooldownMethods: contactForm.cooldownMethods.filter((m) => m !== method),
                                  })
                                }
                              }}
                              className="w-4 h-4"
                            />
                            <Label htmlFor={`cooldown-${method}`} className="text-sm">
                              {method}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </ThemedCard>

                <ThemedCard>
                  <ThemedCardHeader>
                    <h4 className="text-lg font-semibold flex items-center gap-2">
                      <Trophy className="w-5 h-5" />
                      お友達との相性
                    </h4>
                  </ThemedCardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <Label className="text-sm font-semibold text-green-600">好きなお友達のタイプ</Label>
                        <div className="space-y-2 max-h-40 overflow-y-auto">
                          {[
                            "自分より小さい",
                            "自分より大きい",
                            "同程度",
                            "オス",
                            "メス",
                            "去勢済",
                            "避妊済",
                            "パピー",
                            "成犬",
                            "老犬",
                            "穏やかな犬",
                            "遊び好きな犬",
                          ].map((type) => (
                            <div key={type} className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                id={`preferred-${type}`}
                                checked={contactForm.preferredDogTypes.includes(type)}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setContactForm({
                                      ...contactForm,
                                      preferredDogTypes: [...contactForm.preferredDogTypes, type],
                                    })
                                  } else {
                                    setContactForm({
                                      ...contactForm,
                                      preferredDogTypes: contactForm.preferredDogTypes.filter((t) => t !== type),
                                    })
                                  }
                                }}
                                className="w-4 h-4"
                              />
                              <Label htmlFor={`preferred-${type}`} className="text-sm">
                                {type}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-3">
                        <Label className="text-sm font-semibold text-orange-600">苦手なお友達のタイプ</Label>
                        <div className="space-y-2 max-h-40 overflow-y-auto">
                          {[
                            "自分より小さい",
                            "自分より大きい",
                            "同程度",
                            "オス",
                            "メス",
                            "去勢済",
                            "避妊済",
                            "パピー",
                            "成犬",
                            "老犬",
                            "穏やかな犬",
                            "遊び好きな犬",
                          ].map((type) => (
                            <div key={type} className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                id={`difficult-${type}`}
                                checked={contactForm.difficultDogTypes.includes(type)}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setContactForm({
                                      ...contactForm,
                                      difficultDogTypes: [...contactForm.difficultDogTypes, type],
                                    })
                                  } else {
                                    setContactForm({
                                      ...contactForm,
                                      difficultDogTypes: contactForm.difficultDogTypes.filter((t) => t !== type),
                                    })
                                  }
                                }}
                                className="w-4 h-4"
                              />
                              <Label htmlFor={`difficult-${type}`} className="text-sm">
                                {type}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-semibold">園内でのお友達関係</Label>
                      <Textarea
                        placeholder="相性が良い犬や注意が必要な犬について具体的に記載してください。&#10;例：「園の『ポチちゃん（トイプードル）』とはいつも楽しそうに遊ぶ」"
                        value={contactForm.specificPairings}
                        onChange={(e) => setContactForm({ ...contactForm, specificPairings: e.target.value })}
                        rows={3}
                      />
                    </div>
                  </CardContent>
                </ThemedCard>

                <ThemedCard>
                  <ThemedCardHeader>
                    <h4 className="text-lg font-semibold flex items-center gap-2">
                      <MessageSquare className="w-5 h-5" />
                      スタッフからのメッセージ
                    </h4>
                  </ThemedCardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="staffNote" className="text-sm font-medium">
                        スタッフからのメッセージ
                      </Label>
                      <ThemedButton
                        variant="outline"
                        size="sm"
                        onClick={generateStaffMessage}
                        disabled={isGeneratingMessage}
                        className="text-xs"
                      >
                        {isGeneratingMessage ? (
                          <>
                            <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-current mr-1"></div>
                            生成中...
                          </>
                        ) : (
                          <>
                            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                              />
                            </svg>
                            AI生成
                          </>
                        )}
                      </ThemedButton>
                    </div>
                    <Textarea
                      id="staffNote"
                      placeholder="今日の様子や保護者への連絡事項を記録してください（AI生成ボタンで自動生成も可能です）"
                      value={contactForm.staffNote}
                      onChange={(e) => setContactForm({ ...contactForm, staffNote: e.target.value })}
                      rows={4}
                    />
                  </CardContent>
                </ThemedCard>

                <div className="space-y-2">
                  <Label htmlFor="photos" className="text-sm font-medium">
                    写真
                  </Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
                    <Camera className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-600 mb-2">写真をアップロード</p>
                    <p className="text-sm text-gray-500">今日の様子を写真で記録しましょう</p>
                    <ThemedButton variant="outline" className="mt-4">
                      <Plus className="w-4 h-4 mr-2" />
                      写真を追加
                    </ThemedButton>
                  </div>
                </div>

                <div className="flex gap-4 pt-6">
                  <ThemedButton variant="primary" size="lg" onClick={handleContactSubmit} className="flex-1">
                    <Save className="w-5 h-5 mr-2" />
                    連絡帳を保存
                  </ThemedButton>
                  <ThemedButton
                    variant="outline"
                    size="lg"
                    onClick={() => {
                      setContactForm({
                        userId: "",
                        dogName: "",
                        date: new Date().toISOString().split("T")[0],
                        meal: {
                          status: "",
                          time: "",
                          note: "",
                        },
                        excretion: {
                          status: "",
                          time: "",
                          note: "",
                        },
                        bodyHandling: {
                          ears: "ok",
                          mouth: "ok",
                          paws: "ok",
                          tail: "ok",
                          back: "ok",
                        },
                        separationAnxiety: 1,
                        energyLevel: 3,
                        greetingStyle: [],
                        excitedBehaviors: [],
                        cooldownMethods: [],
                        preferredDogTypes: [],
                        difficultDogTypes: [],
                        specificPairings: "",
                        totalVisits: 0,
                        totalHours: 0,
                        frequency: "",
                        toiletSuccessRate: 100,
                        trainingPrograms: [],
                        eventParticipation: {
                          walks: 0,
                          dogRun: 0,
                          training: 0,
                        },
                        staffNote: "",
                        photos: [],
                      })
                      setDogBehavior({
                        energy: [],
                        mood: [],
                        social: [],
                        activity: [],
                      })
                    }}
                  >
                    リセット
                  </ThemedButton>
                </div>
              </CardContent>
            </ThemedCard>

            <ThemedCard className="shadow-lg">
              <ThemedCardHeader className="pb-4">
                <h3 className="text-xl font-bold">最近の連絡帳記録</h3>
              </ThemedCardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-5 border rounded-xl hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-4">
                      <Avatar className="w-12 h-12">
                        <AvatarFallback className="text-lg font-semibold">田</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold text-lg">田中太郎 (ルイ)</p>
                        <p className="text-gray-600 font-medium">2024-01-15 - 食事：完食、排泄：良好</p>
                        <p className="text-sm text-gray-500">
                          今日もとても元気で、他のワンちゃんたちとも仲良く過ごしていました
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <ThemedButton variant="ghost" size="sm">
                        <Eye className="w-5 h-5" />
                      </ThemedButton>
                      <ThemedButton variant="ghost" size="sm">
                        <Edit className="w-5 h-5" />
                      </ThemedButton>
                    </div>
                  </div>
                </div>
              </CardContent>
            </ThemedCard>
          </TabsContent>

          <TabsContent value="events" className="space-y-6">
            <ThemedCard className="shadow-lg">
              <ThemedCardHeader className="pb-4">
                <h3 className="text-xl font-bold flex items-center gap-3">
                  <Calendar className="w-6 h-6" style={{ color: currentTheme.primary[500] }} />
                  イベント登録
                </h3>
                <p className="text-white mt-2">新しいイベントを作成し、一般ユーザーに公開します</p>
              </ThemedCardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="eventTitle" className="text-sm font-medium">
                      イベント名 *
                    </Label>
                    <Input
                      id="eventTitle"
                      placeholder="例：ユニ・チャーム協業イベント"
                      className="h-12"
                      value={eventForm.title}
                      onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="eventCategory" className="text-sm font-medium">
                      カテゴリー *
                    </Label>
                    <Select value={eventForm.category} onValueChange={(value) => setEventForm({ ...eventForm, category: value })}>
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="カテゴリーを選択" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="health">🏥 健康</SelectItem>
                        <SelectItem value="sports">🏃 スポーツ</SelectItem>
                        <SelectItem value="outdoor">🌲 アウトドア</SelectItem>
                        <SelectItem value="education">📚 学習</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="eventDescription" className="text-sm font-medium">
                    イベント説明 *
                  </Label>
                  <Input
                    id="eventDescription"
                    placeholder="例：愛犬の健康ケア体験会"
                    className="h-12"
                    value={eventForm.description}
                    onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="eventDate" className="text-sm font-medium">
                      開催日 *
                    </Label>
                    <Input
                      id="eventDate"
                      type="date"
                      className="h-12"
                      value={eventForm.date}
                      onChange={(e) => setEventForm({ ...eventForm, date: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="eventTime" className="text-sm font-medium">
                      開催時間 *
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        placeholder="14:00"
                        className="h-12"
                        value={eventForm.startTime}
                        onChange={(e) => setEventForm({ ...eventForm, startTime: e.target.value })}
                      />
                      <span className="self-center">-</span>
                      <Input
                        placeholder="16:00"
                        className="h-12"
                        value={eventForm.endTime}
                        onChange={(e) => setEventForm({ ...eventForm, endTime: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="eventLocation" className="text-sm font-medium">
                      開催場所 *
                    </Label>
                    <Input
                      id="eventLocation"
                      placeholder="例：FC今治 里山ドッグラン"
                      className="h-12"
                      value={eventForm.location}
                      onChange={(e) => setEventForm({ ...eventForm, location: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="eventOrganizer" className="text-sm font-medium">
                      主催者 *
                    </Label>
                    <Input
                      id="eventOrganizer"
                      placeholder="例：ユニ・チャーム × FC今治"
                      className="h-12"
                      value={eventForm.organizer}
                      onChange={(e) => setEventForm({ ...eventForm, organizer: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="eventPrice" className="text-sm font-medium">
                      参加料金
                    </Label>
                    <Select value={eventForm.price} onValueChange={(value) => setEventForm({ ...eventForm, price: value })}>
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="料金を選択" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="free">無料</SelectItem>
                        <SelectItem value="1000">¥1,000</SelectItem>
                        <SelectItem value="1500">¥1,500</SelectItem>
                        <SelectItem value="2000">¥2,000</SelectItem>
                        <SelectItem value="2500">¥2,500</SelectItem>
                        <SelectItem value="3000">¥3,000</SelectItem>
                        <SelectItem value="custom">その他（カスタム）</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="eventImage" className="text-sm font-medium">
                      イベント画像
                    </Label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-gray-400 transition-colors">
                      <Camera className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                      <p className="text-sm text-gray-600">画像をアップロード</p>
                      <ThemedButton variant="outline" size="sm" className="mt-2">
                        <Plus className="w-4 h-4 mr-2" />
                        画像を選択
                      </ThemedButton>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="eventDetails" className="text-sm font-medium">
                    詳細説明
                  </Label>
                  <Textarea
                    id="eventDetails"
                    placeholder="イベントの詳細な説明を入力してください（対象となる犬種、持ち物、注意事項など）"
                    rows={4}
                    value={eventForm.details}
                    onChange={(e) => setEventForm({ ...eventForm, details: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">特典</Label>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <input 
                          type="checkbox" 
                          id="trial-pack" 
                          className="w-4 h-4"
                          checked={eventForm.benefits.includes("trial-pack")}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setEventForm({ ...eventForm, benefits: [...eventForm.benefits, "trial-pack"] })
                            } else {
                              setEventForm({ ...eventForm, benefits: eventForm.benefits.filter(b => b !== "trial-pack") })
                            }
                          }}
                        />
                        <Label htmlFor="trial-pack" className="text-sm">
                          トライアル受取可
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input 
                          type="checkbox" 
                          id="photo-service" 
                          className="w-4 h-4"
                          checked={eventForm.benefits.includes("photo-service")}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setEventForm({ ...eventForm, benefits: [...eventForm.benefits, "photo-service"] })
                            } else {
                              setEventForm({ ...eventForm, benefits: eventForm.benefits.filter(b => b !== "photo-service") })
                            }
                          }}
                        />
                        <Label htmlFor="photo-service" className="text-sm">
                          写真撮影サービス
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input 
                          type="checkbox" 
                          id="gift" 
                          className="w-4 h-4"
                          checked={eventForm.benefits.includes("gift")}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setEventForm({ ...eventForm, benefits: [...eventForm.benefits, "gift"] })
                            } else {
                              setEventForm({ ...eventForm, benefits: eventForm.benefits.filter(b => b !== "gift") })
                            }
                          }}
                        />
                        <Label htmlFor="gift" className="text-sm">
                          記念品プレゼント
                        </Label>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium">対象</Label>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <input 
                          type="checkbox" 
                          id="all-dogs" 
                          className="w-4 h-4"
                          checked={eventForm.target.includes("all-dogs")}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setEventForm({ ...eventForm, target: [...eventForm.target, "all-dogs"] })
                            } else {
                              setEventForm({ ...eventForm, target: eventForm.target.filter(t => t !== "all-dogs") })
                            }
                          }}
                        />
                        <Label htmlFor="all-dogs" className="text-sm">
                          全犬種対象
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input 
                          type="checkbox" 
                          id="small-dogs" 
                          className="w-4 h-4"
                          checked={eventForm.target.includes("small-dogs")}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setEventForm({ ...eventForm, target: [...eventForm.target, "small-dogs"] })
                            } else {
                              setEventForm({ ...eventForm, target: eventForm.target.filter(t => t !== "small-dogs") })
                            }
                          }}
                        />
                        <Label htmlFor="small-dogs" className="text-sm">
                          小型犬のみ
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input 
                          type="checkbox" 
                          id="beginners" 
                          className="w-4 h-4"
                          checked={eventForm.target.includes("beginners")}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setEventForm({ ...eventForm, target: [...eventForm.target, "beginners"] })
                            } else {
                              setEventForm({ ...eventForm, target: eventForm.target.filter(t => t !== "beginners") })
                            }
                          }}
                        />
                        <Label htmlFor="beginners" className="text-sm">
                          初心者歓迎
                        </Label>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="eventStatus" className="text-sm font-medium">
                      公開状態
                    </Label>
                    <Select value={eventForm.status} onValueChange={(value: "draft" | "published" | "archived") => setEventForm({ ...eventForm, status: value })}>
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="公開状態を選択" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">下書き</SelectItem>
                        <SelectItem value="published">公開</SelectItem>
                        <SelectItem value="archived">アーカイブ</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex gap-4 pt-6 border-t">
                  <ThemedButton variant="primary" size="lg" className="flex-1" onClick={handleEventSubmit}>
                    <Save className="w-5 h-5 mr-2" />
                    イベントを保存
                  </ThemedButton>
                  <ThemedButton variant="outline" size="lg">
                    <Eye className="w-5 h-5 mr-2" />
                    プレビュー
                  </ThemedButton>
                </div>
              </CardContent>
            </ThemedCard>

            <ThemedCard className="shadow-lg">
              <ThemedCardHeader className="pb-4">
                <h3 className="text-xl font-bold">登録済みイベント一覧</h3>
              </ThemedCardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-5 border rounded-xl hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                        <Calendar className="w-8 h-8 text-gray-400" />
                      </div>
                      <div>
                        <p className="font-semibold text-lg">ユニ・チャーム協業イベント</p>
                        <p className="text-gray-600 font-medium">愛犬の健康ケア体験会</p>
                        <p className="text-sm text-gray-500">8月20日（火）14:00-16:00 • FC今治 里山ドッグラン</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge
                        className="font-medium px-3 py-1 text-white"
                        style={{ backgroundColor: currentTheme.primary[500] }}
                      >
                        公開中
                      </Badge>
                      <div className="flex gap-2">
                        <ThemedButton variant="ghost" size="sm">
                          <Eye className="w-5 h-5" />
                        </ThemedButton>
                        <ThemedButton variant="ghost" size="sm">
                          <Edit className="w-5 h-5" />
                        </ThemedButton>
                        <ThemedButton variant="ghost" size="sm" className="text-red-600 hover:bg-red-50">
                          <Trash2 className="w-5 h-5" />
                        </ThemedButton>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-5 border rounded-xl hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                        <Trophy className="w-8 h-8 text-gray-400" />
                      </div>
                      <div>
                        <p className="font-semibold text-lg">アジリティ体験会</p>
                        <p className="text-gray-600 font-medium">初心者向けドッグスポーツ</p>
                        <p className="text-sm text-gray-500">8月25日（日）10:00-12:00 • FC今治 里山ドッグラン</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge
                        className="font-medium px-3 py-1 text-white"
                        style={{ backgroundColor: currentTheme.primary[500] }}
                      >
                        公開中
                      </Badge>
                      <div className="flex gap-2">
                        <ThemedButton variant="ghost" size="sm">
                          <Eye className="w-5 h-5" />
                        </ThemedButton>
                        <ThemedButton variant="ghost" size="sm">
                          <Edit className="w-5 h-5" />
                        </ThemedButton>
                        <ThemedButton variant="ghost" size="sm" className="text-red-600 hover:bg-red-50">
                          <Trash2 className="w-5 h-5" />
                        </ThemedButton>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </ThemedCard>
          </TabsContent>

          <TabsContent value="system" className="space-y-6">
            <ThemedCard className="shadow-lg">
              <ThemedCardHeader className="pb-4">
                <h3 className="text-xl font-bold flex items-center gap-3">
                  <Settings className="w-6 h-6" style={{ color: currentTheme.primary[500] }} />
                  システム設定
                </h3>
              </ThemedCardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="p-6 border rounded-xl hover:bg-gray-50 transition-colors">
                    <h3 className="font-semibold text-lg mb-3">管理者権限管理</h3>
                    <p className="text-gray-600 mb-4">ユーザーの管理者権限を付与・削除できます</p>
                    <ThemedButton variant="outline" size="lg">
                      <Shield className="w-5 h-5 mr-2" />
                      権限管理
                    </ThemedButton>
                  </div>

                  <div className="p-6 border rounded-xl hover:bg-gray-50 transition-colors">
                    <h3 className="font-semibold text-lg mb-3">システムログ</h3>
                    <p className="text-gray-600 mb-4">システムの動作ログを確認できます</p>
                    <ThemedButton variant="outline" size="lg">
                      <Eye className="w-5 h-5 mr-2" />
                      ログを表示
                    </ThemedButton>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <ThemedButton variant="outline" className="flex items-center justify-center">
                      <Settings className="w-5 h-5 mr-2" />
                      システム設定
                    </ThemedButton>
                    <ThemedButton variant="outline" className="flex items-center justify-center">
                      <Trash2 className="w-5 h-5 mr-2" />
                      システム管理
                    </ThemedButton>
                  </div>
                </div>
              </CardContent>
            </ThemedCard>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
