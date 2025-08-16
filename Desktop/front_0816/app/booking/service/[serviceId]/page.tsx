"use client"

import { useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { ArrowLeft, Calendar, Clock, Users, Star, Info, Camera } from "lucide-react"
import { ThemedCard, ThemedCardHeader, CardContent, CardTitle } from "@/components/themed-card"
import { ThemedButton } from "@/components/themed-button"
import { useTheme } from "@/contexts/theme-context"
import { useProfile } from "@/contexts/profile-context"

export default function ServiceDetailPage() {
  const router = useRouter()
  const params = useParams()
  const { currentTheme } = useTheme()
  const { profile } = useProfile()
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)

  const services = {
    trial: {
      id: "trial",
      name: "初回おためしプラン",
      price: "¥1,000",
      duration: "30分",
      description: "短時間＋写真多め保証。少人数対応で初回の様子見に最適です。",
      features: ["少人数対応", "写真多め保証", "フィードバック相談", "初回限定"],
      icon: "✨",
      timeSlots: ["10:00-10:30", "11:00-11:30", "14:00-14:30"],
      needsTimeSelection: true,
      maxCapacity: 4,
    },
    daycare: {
      id: "daycare",
      name: "犬の保育園（1日コース）",
      price: "¥3,500",
      duration: "9:00 - 17:00",
      description:
        "専門スタッフによる1日お預かりサービス。愛犬が安心して過ごせる環境で、他のワンちゃんとの交流も楽しめます。",
      features: ["食事提供（朝・昼・おやつ）", "運動・遊び時間", "健康チェック", "写真日記サービス", "個別ケア対応"],
      icon: "🏫",
      timeSlots: ["9:00"],
      needsTimeSelection: false,
      maxCapacity: 15,
    },
    halfday: {
      id: "halfday",
      name: "犬の保育園（半日コース）",
      price: "¥2,000",
      duration: "4時間",
      description: "半日お預かりサービス。午前または午後のどちらかを選択できます。",
      features: ["軽食提供", "運動・遊び時間", "健康チェック", "写真サービス"],
      icon: "🕐",
      timeSlots: ["9:00-13:00", "13:00-17:00"],
      needsTimeSelection: true,
      maxCapacity: 10,
    },
    dogrun: {
      id: "dogrun",
      name: "ドッグラン利用",
      price: "¥800",
      duration: "1時間",
      description: "里山の自然豊かなドッグランで自由に遊べます。小型犬専用エリアもあります。",
      features: ["広々とした敷地", "小型犬専用エリア", "水飲み場完備", "ベンチ・休憩スペース"],
      icon: "🏃",
      timeSlots: ["9:00", "10:00", "11:00", "13:00", "14:00", "15:00", "16:00"],
      needsTimeSelection: true,
      maxCapacity: 20,
    },
  } as const

  const service = services[params.serviceId as keyof typeof services]

  if (!service) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">サービスが見つかりません</h2>
          <ThemedButton onClick={() => router.push("/booking")}>予約画面に戻る</ThemedButton>
        </div>
      </div>
    )
  }

  // 利用可能な日付（今日から2週間）
  const availableDates = Array.from({ length: 14 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() + i + 1)
    const value = date.toISOString().split("T")[0]
    const display = `${date.getMonth() + 1}/${date.getDate()}`
    const dayOfWeek = ["日", "月", "火", "水", "木", "金", "土"][date.getDay()]
    const isWeekend = date.getDay() === 0 || date.getDay() === 6
    const availableSlots = Math.floor(Math.random() * service.maxCapacity * 0.7) + 3
    return {
      value,
      display,
      dayOfWeek,
      isWeekend,
      availableSlots,
      totalSlots: service.maxCapacity,
    }
  })

  const handleDateTimeConfirm = () => {
    if (!selectedDate || (service.needsTimeSelection && !selectedTime)) {
      alert("日付と時間を選択してください")
      return
    }

    const params = new URLSearchParams({
      serviceId: service.id,
      date: selectedDate,
      ...(selectedTime && { time: selectedTime }),
    })
    router.push(`/booking/confirm?${params.toString()}`)
  }

  return (
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
            <button onClick={() => router.push("/booking")}>
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <h1 className="text-lg font-semibold text-gray-800">サービス詳細</h1>
          </div>
        </div>
      </header>

      <div className="max-w-md mx-auto px-4 py-6 space-y-6">
        {/* Service Header */}
        <ThemedCard variant="primary">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-4xl mb-3">
                {service.icon}
                {service.id === "trial" && <Camera className="inline-block w-5 h-5 ml-2" />}
              </div>
              <h2 className="text-xl font-bold text-gray-800 mb-2">{service.name}</h2>
              <div className="flex items-center justify-center space-x-4 mb-3">
                <div className="flex items-center text-sm text-gray-600">
                  <Clock className="w-4 h-4 mr-1" />
                  {service.duration}
                </div>
                <div className="text-2xl font-bold" style={{ color: currentTheme.primary[600] }}>
                  {service.price}
                </div>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">{service.description}</p>
              {service.id === "trial" && (
                <div className="mt-2 text-xs rounded-md bg-gray-50 p-2 text-gray-600">
                  少人数枠での実施を優先します。スタッフが距離調整を行います。
                </div>
              )}
            </div>
          </CardContent>
        </ThemedCard>

        {/* Service Features */}
        <ThemedCard>
          <ThemedCardHeader>
            <CardTitle className="text-base flex items-center">
              <Star className="w-4 h-4 mr-2" style={{ color: currentTheme.accent[600] }} />
              サービス内容
            </CardTitle>
          </ThemedCardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-2">
              {service.features.map((feature, index) => (
                <div key={index} className="flex items-center space-x-2 text-sm text-gray-700">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: currentTheme.accent[500] }}></div>
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </ThemedCard>

        {/* Date Selection */}
        <ThemedCard>
          <ThemedCardHeader>
            <CardTitle className="text-base flex items-center">
              <Calendar className="w-4 h-4 mr-2" style={{ color: currentTheme.primary[600] }} />
              日付を選択
            </CardTitle>
          </ThemedCardHeader>
          <CardContent>
            <div className="grid grid-cols-4 gap-2">
              {availableDates.map((date) => (
                <button
                  key={date.value}
                  onClick={() => setSelectedDate(date.value)}
                  className={`p-3 rounded-lg text-center transition-colors ${date.isWeekend ? "text-red-600" : ""}`}
                  style={{
                    backgroundColor:
                      selectedDate === date.value ? currentTheme.primary[600] : currentTheme.primary[100],
                    color:
                      selectedDate === date.value ? "white" : date.isWeekend ? "#dc2626" : currentTheme.primary[700],
                  }}
                >
                  <div className="text-sm font-medium">{date.display}</div>
                  <div className="text-xs">{date.dayOfWeek}</div>
                </button>
              ))}
            </div>
          </CardContent>
        </ThemedCard>

        {/* Availability Info */}
        {selectedDate && (
          <ThemedCard variant="accent">
            <ThemedCardHeader variant="accent">
              <CardTitle className="text-base flex items-center">
                <Users className="w-4 h-4 mr-2" />
                {availableDates.find((d) => d.value === selectedDate)?.display}の空き状況
              </CardTitle>
            </ThemedCardHeader>
            <CardContent>
              {(() => {
                const dateInfo = availableDates.find((d) => d.value === selectedDate)
                if (!dateInfo) return null

                return (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">空き状況</span>
                      <span className="font-medium">
                        {dateInfo.availableSlots}/{dateInfo.totalSlots}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                      <div
                        className="h-2 rounded-full"
                        style={{
                          backgroundColor: currentTheme.accent[500],
                          width: `${(dateInfo.availableSlots / dateInfo.totalSlots) * 100}%`,
                        }}
                      />
                    </div>
                    <p className="text-xs" style={{ color: currentTheme.accent[700] }}>
                      {dateInfo.availableSlots > 0 ? `あと${dateInfo.availableSlots}枠空きがあります` : "満席です"}
                    </p>
                  </div>
                )
              })()}
            </CardContent>
          </ThemedCard>
        )}

        {/* Time Selection */}
        {service.needsTimeSelection && selectedDate && (
          <ThemedCard>
            <ThemedCardHeader>
              <CardTitle className="text-base flex items-center">
                <Clock className="w-4 h-4 mr-2" style={{ color: currentTheme.accent[600] }} />
                時間を選択
              </CardTitle>
            </ThemedCardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2">
                {service.timeSlots.map((time) => (
                  <button
                    key={time}
                    onClick={() => setSelectedTime(time)}
                    className="p-3 rounded-lg text-sm font-medium transition-colors"
                    style={{
                      backgroundColor: selectedTime === time ? currentTheme.accent[500] : currentTheme.accent[100],
                      color: selectedTime === time ? "white" : currentTheme.accent[700],
                    }}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </CardContent>
          </ThemedCard>
        )}

        {/* Important Notes */}
        <ThemedCard variant="accent">
          <ThemedCardHeader variant="accent">
            <CardTitle className="text-base flex items-center">
              <Info className="w-4 h-4 mr-2" />
              ご利用にあたって
            </CardTitle>
          </ThemedCardHeader>
          <CardContent>
            <div className="space-y-2 text-sm" style={{ color: currentTheme.accent[700] }}>
              <p>• 予約は利用日の前日まで可能です</p>
              <p>• キャンセルは前日まで無料です</p>
              <p>• 当日キャンセルは料金の50%をいただきます</p>
              <p>• 混合ワクチン接種証明書をお持ちください</p>
              {service.id === "trial" && <p>• 初回限定プランのため、お一人さま1回まで</p>}
            </div>
          </CardContent>
        </ThemedCard>

        {/* Confirm Button */}
        <div className="pb-20">
          <ThemedButton
            variant="primary"
            className="w-full py-4 text-lg"
            onClick={handleDateTimeConfirm}
            disabled={!selectedDate || (service.needsTimeSelection && !selectedTime)}
          >
            {selectedDate && (!service.needsTimeSelection || selectedTime)
              ? "予約内容を確認する"
              : service.needsTimeSelection
                ? "日付と時間を選択してください"
                : "日付を選択してください"}
          </ThemedButton>
        </div>
      </div>
    </div>
  )
}
