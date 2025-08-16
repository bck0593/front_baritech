"use client"

import { useState } from "react"
import { ThemedCard, ThemedCardHeader, CardContent } from "@/components/themed-card"
import { ThemedButton } from "@/components/themed-button"
import { useTheme } from "@/contexts/theme-context"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import {
  Heart,
  Camera,
  Calendar,
  Clock,
  Utensils,
  Droplets,
  Thermometer,
  FileText,
  Send,
  ArrowLeft,
  Plus,
} from "lucide-react"
import Link from "next/link"

interface ContactEntry {
  date: string
  dogName: string
  mood: string
  appetite: string
  meals: {
    breakfast: boolean
    lunch: boolean
    snack: boolean
    amount: string
  }
  bathroom: {
    urine: number
    stool: number
    stoolCondition: string
  }
  health: {
    temperature: string
    condition: string
    medication: boolean
    medicationDetails: string
  }
  activities: string[]
  notes: string
  photos: string[]
}

const moodOptions = [
  { value: "excellent", label: "とても元気", color: "bg-green-500" },
  { value: "good", label: "元気", color: "bg-blue-500" },
  { value: "normal", label: "普通", color: "bg-yellow-500" },
  { value: "tired", label: "少し疲れ気味", color: "bg-orange-500" },
  { value: "unwell", label: "体調不良", color: "bg-red-500" },
]

const activityOptions = [
  "お散歩",
  "他の犬と遊ぶ",
  "おもちゃ遊び",
  "トレーニング",
  "グルーミング",
  "お昼寝",
  "おやつタイム",
  "写真撮影",
]

export default function NurseryContactPage() {
  const { currentTheme } = useTheme()
  const [entry, setEntry] = useState<ContactEntry>({
    date: new Date().toISOString().split("T")[0],
    dogName: "ルイ",
    mood: "",
    appetite: "",
    meals: {
      breakfast: false,
      lunch: false,
      snack: false,
      amount: "",
    },
    bathroom: {
      urine: 0,
      stool: 0,
      stoolCondition: "",
    },
    health: {
      temperature: "",
      condition: "",
      medication: false,
      medicationDetails: "",
    },
    activities: [],
    notes: "",
    photos: [],
  })

  const handleActivityToggle = (activity: string) => {
    setEntry((prev) => ({
      ...prev,
      activities: prev.activities.includes(activity)
        ? prev.activities.filter((a) => a !== activity)
        : [...prev.activities, activity],
    }))
  }

  const handleSubmit = () => {
    console.log("連絡帳を送信:", entry)
    // ここで実際の送信処理を行う
  }

  return (
    <div
      className="min-h-screen"
      style={{
        background: `linear-gradient(to bottom, ${currentTheme.primary[50]}, white, ${currentTheme.primary[100]})`,
      }}
    >
      <div className="max-w-md mx-auto px-4 py-6">
        {/* ヘッダー */}
        <div
          className="bg-white rounded-xl shadow-lg border-t-4 p-6 mb-6"
          style={{ borderTopColor: currentTheme.primary[500] }}
        >
          <div className="flex items-center justify-between mb-4">
            <Link href="/diary">
              <ThemedButton variant="ghost" size="sm">
                <ArrowLeft className="w-5 h-5 mr-2" />
                戻る
              </ThemedButton>
            </Link>
            <Badge className="text-white px-4 py-2" style={{ backgroundColor: currentTheme.primary[500] }}>
              保育園
            </Badge>
          </div>
          <div className="flex items-center gap-4">
            <Heart className="w-8 h-8" style={{ color: currentTheme.primary[500] }} />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">連絡帳入力</h1>
              <p className="text-gray-600">今日の様子を記録しましょう</p>
            </div>
          </div>
        </div>

        {/* 基本情報 */}
        <ThemedCard variant="primary" className="mb-6">
          <ThemedCardHeader className="pb-4">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <Calendar className="w-5 h-5" style={{ color: currentTheme.primary[500] }} />
              基本情報
            </h3>
          </ThemedCardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="date" className="text-sm font-medium mb-2 block">
                日付
              </Label>
              <Input
                id="date"
                type="date"
                value={entry.date}
                onChange={(e) => setEntry((prev) => ({ ...prev, date: e.target.value }))}
                className="w-full"
              />
            </div>
            <div>
              <Label htmlFor="dogName" className="text-sm font-medium mb-2 block">
                愛犬の名前
              </Label>
              <Input
                id="dogName"
                value={entry.dogName}
                onChange={(e) => setEntry((prev) => ({ ...prev, dogName: e.target.value }))}
                className="w-full"
                placeholder="愛犬の名前"
              />
            </div>
          </CardContent>
        </ThemedCard>

        {/* 気分・様子 */}
        <ThemedCard variant="accent" className="mb-6">
          <ThemedCardHeader className="pb-4">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <Heart className="w-5 h-5" style={{ color: currentTheme.accent[500] }} />
              気分・様子
            </h3>
          </ThemedCardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-3">
              {moodOptions.map((mood) => (
                <label
                  key={mood.value}
                  className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all ${
                    entry.mood === mood.value ? "border-current shadow-md" : "border-gray-200 hover:border-gray-300"
                  }`}
                  style={{
                    borderColor: entry.mood === mood.value ? currentTheme.accent[500] : undefined,
                    backgroundColor: entry.mood === mood.value ? `${currentTheme.accent[50]}` : undefined,
                  }}
                >
                  <input
                    type="radio"
                    name="mood"
                    value={mood.value}
                    checked={entry.mood === mood.value}
                    onChange={(e) => setEntry((prev) => ({ ...prev, mood: e.target.value }))}
                    className="sr-only"
                  />
                  <div className={`w-4 h-4 rounded-full ${mood.color} mr-3`}></div>
                  <span className="font-medium">{mood.label}</span>
                </label>
              ))}
            </div>
          </CardContent>
        </ThemedCard>

        {/* 食事記録 */}
        <ThemedCard variant="primary" className="mb-6">
          <ThemedCardHeader className="pb-4">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <Utensils className="w-5 h-5" style={{ color: currentTheme.primary[500] }} />
              食事記録
            </h3>
          </ThemedCardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Checkbox
                  id="breakfast"
                  checked={entry.meals.breakfast}
                  onCheckedChange={(checked) =>
                    setEntry((prev) => ({
                      ...prev,
                      meals: { ...prev.meals, breakfast: checked as boolean },
                    }))
                  }
                />
                <Label htmlFor="breakfast" className="font-medium">
                  朝食
                </Label>
              </div>
              <div className="flex items-center space-x-3">
                <Checkbox
                  id="lunch"
                  checked={entry.meals.lunch}
                  onCheckedChange={(checked) =>
                    setEntry((prev) => ({
                      ...prev,
                      meals: { ...prev.meals, lunch: checked as boolean },
                    }))
                  }
                />
                <Label htmlFor="lunch" className="font-medium">
                  昼食
                </Label>
              </div>
              <div className="flex items-center space-x-3">
                <Checkbox
                  id="snack"
                  checked={entry.meals.snack}
                  onCheckedChange={(checked) =>
                    setEntry((prev) => ({
                      ...prev,
                      meals: { ...prev.meals, snack: checked as boolean },
                    }))
                  }
                />
                <Label htmlFor="snack" className="font-medium">
                  おやつ
                </Label>
              </div>
            </div>
            <div>
              <Label htmlFor="appetite" className="text-sm font-medium mb-2 block">
                食欲
              </Label>
              <Select
                value={entry.appetite}
                onValueChange={(value) => setEntry((prev) => ({ ...prev, appetite: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="食欲を選択" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="excellent">とても良い</SelectItem>
                  <SelectItem value="good">良い</SelectItem>
                  <SelectItem value="normal">普通</SelectItem>
                  <SelectItem value="poor">少し悪い</SelectItem>
                  <SelectItem value="very-poor">とても悪い</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="mealAmount" className="text-sm font-medium mb-2 block">
                食事量
              </Label>
              <Input
                id="mealAmount"
                value={entry.meals.amount}
                onChange={(e) =>
                  setEntry((prev) => ({
                    ...prev,
                    meals: { ...prev.meals, amount: e.target.value },
                  }))
                }
                placeholder="例：完食、半分、少し残した"
              />
            </div>
          </CardContent>
        </ThemedCard>

        {/* 排泄記録 */}
        <ThemedCard variant="accent" className="mb-6">
          <ThemedCardHeader className="pb-4">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <Droplets className="w-5 h-5" style={{ color: currentTheme.accent[500] }} />
              排泄記録
            </h3>
          </ThemedCardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="urine" className="text-sm font-medium mb-2 block">
                  おしっこ回数
                </Label>
                <Input
                  id="urine"
                  type="number"
                  min="0"
                  value={entry.bathroom.urine}
                  onChange={(e) =>
                    setEntry((prev) => ({
                      ...prev,
                      bathroom: { ...prev.bathroom, urine: Number.parseInt(e.target.value) || 0 },
                    }))
                  }
                />
              </div>
              <div>
                <Label htmlFor="stool" className="text-sm font-medium mb-2 block">
                  うんち回数
                </Label>
                <Input
                  id="stool"
                  type="number"
                  min="0"
                  value={entry.bathroom.stool}
                  onChange={(e) =>
                    setEntry((prev) => ({
                      ...prev,
                      bathroom: { ...prev.bathroom, stool: Number.parseInt(e.target.value) || 0 },
                    }))
                  }
                />
              </div>
            </div>
            <div>
              <Label htmlFor="stoolCondition" className="text-sm font-medium mb-2 block">
                うんちの状態
              </Label>
              <Select
                value={entry.bathroom.stoolCondition}
                onValueChange={(value) =>
                  setEntry((prev) => ({
                    ...prev,
                    bathroom: { ...prev.bathroom, stoolCondition: value },
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="状態を選択" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="normal">正常</SelectItem>
                  <SelectItem value="soft">やわらかい</SelectItem>
                  <SelectItem value="hard">かたい</SelectItem>
                  <SelectItem value="loose">ゆるい</SelectItem>
                  <SelectItem value="diarrhea">下痢</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </ThemedCard>

        {/* 健康状態 */}
        <ThemedCard variant="primary" className="mb-6">
          <ThemedCardHeader className="pb-4">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <Thermometer className="w-5 h-5" style={{ color: currentTheme.primary[500] }} />
              健康状態
            </h3>
          </ThemedCardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="temperature" className="text-sm font-medium mb-2 block">
                体温（℃）
              </Label>
              <Input
                id="temperature"
                type="number"
                step="0.1"
                value={entry.health.temperature}
                onChange={(e) =>
                  setEntry((prev) => ({
                    ...prev,
                    health: { ...prev.health, temperature: e.target.value },
                  }))
                }
                placeholder="例：38.5"
              />
            </div>
            <div>
              <Label htmlFor="condition" className="text-sm font-medium mb-2 block">
                体調
              </Label>
              <Textarea
                id="condition"
                value={entry.health.condition}
                onChange={(e) =>
                  setEntry((prev) => ({
                    ...prev,
                    health: { ...prev.health, condition: e.target.value },
                  }))
                }
                placeholder="体調について詳しく記入してください"
                rows={3}
              />
            </div>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Checkbox
                  id="medication"
                  checked={entry.health.medication}
                  onCheckedChange={(checked) =>
                    setEntry((prev) => ({
                      ...prev,
                      health: { ...prev.health, medication: checked as boolean },
                    }))
                  }
                />
                <Label htmlFor="medication" className="font-medium">
                  薬の投与あり
                </Label>
              </div>
              {entry.health.medication && (
                <div>
                  <Label htmlFor="medicationDetails" className="text-sm font-medium mb-2 block">
                    薬の詳細
                  </Label>
                  <Textarea
                    id="medicationDetails"
                    value={entry.health.medicationDetails}
                    onChange={(e) =>
                      setEntry((prev) => ({
                        ...prev,
                        health: { ...prev.health, medicationDetails: e.target.value },
                      }))
                    }
                    placeholder="薬の種類、量、時間など"
                    rows={2}
                  />
                </div>
              )}
            </div>
          </CardContent>
        </ThemedCard>

        {/* 活動記録 */}
        <ThemedCard variant="accent" className="mb-6">
          <ThemedCardHeader className="pb-4">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <Clock className="w-5 h-5" style={{ color: currentTheme.accent[500] }} />
              活動記録
            </h3>
          </ThemedCardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              {activityOptions.map((activity) => (
                <label
                  key={activity}
                  className={`flex items-center p-3 border-2 rounded-lg cursor-pointer transition-all ${
                    entry.activities.includes(activity)
                      ? "border-current shadow-sm"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  style={{
                    borderColor: entry.activities.includes(activity) ? currentTheme.accent[500] : undefined,
                    backgroundColor: entry.activities.includes(activity) ? `${currentTheme.accent[50]}` : undefined,
                  }}
                >
                  <input
                    type="checkbox"
                    checked={entry.activities.includes(activity)}
                    onChange={() => handleActivityToggle(activity)}
                    className="sr-only"
                  />
                  <span className="text-sm font-medium">{activity}</span>
                </label>
              ))}
            </div>
          </CardContent>
        </ThemedCard>

        {/* 特記事項 */}
        <ThemedCard variant="primary" className="mb-6">
          <ThemedCardHeader className="pb-4">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <FileText className="w-5 h-5" style={{ color: currentTheme.primary[500] }} />
              特記事項・メモ
            </h3>
          </ThemedCardHeader>
          <CardContent>
            <Textarea
              value={entry.notes}
              onChange={(e) => setEntry((prev) => ({ ...prev, notes: e.target.value }))}
              placeholder="今日の特別な出来事や気になることがあれば記入してください"
              rows={4}
              className="w-full"
            />
          </CardContent>
        </ThemedCard>

        {/* 写真アップロード */}
        <ThemedCard variant="accent" className="mb-8">
          <ThemedCardHeader className="pb-4">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <Camera className="w-5 h-5" style={{ color: currentTheme.accent[500] }} />
              写真
            </h3>
          </ThemedCardHeader>
          <CardContent>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <Camera className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600 mb-4">今日の様子を写真で記録しましょう</p>
              <ThemedButton variant="outline">
                <Plus className="w-5 h-5 mr-2" />
                写真を追加
              </ThemedButton>
            </div>
          </CardContent>
        </ThemedCard>

        {/* 送信ボタン */}
        <div className="pb-6">
          <ThemedButton onClick={handleSubmit} className="w-full h-14 text-lg font-semibold" size="lg">
            <Send className="w-6 h-6 mr-3" />
            連絡帳を送信
          </ThemedButton>
        </div>
      </div>
    </div>
  )
}
