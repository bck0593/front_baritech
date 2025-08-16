"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, Calendar, Clock, Heart, MapPin, Camera, Check, Users } from "lucide-react"

export default function AdminEventCreatePage() {
  const router = useRouter()
  const [eventData, setEventData] = useState({
    title: "",
    description: "",
    eventType: "",
    date: "",
    startTime: "",
    endTime: "",
    location: "",
    address: "",
    capacity: "",
    price: "",
    isPublished: true,
    requiresRegistration: true,
    photo: null as File | null,
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [photoPreview, setPhotoPreview] = useState<string>("")

  const eventTypes = ["しつけ教室", "ドッグラン", "健康診断", "グルーミング", "お誕生日会", "その他"]

  const handleInputChange = (field: string, value: string | boolean) => {
    setEventData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setEventData((prev) => ({ ...prev, photo: file }))
      const reader = new FileReader()
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!eventData.title.trim()) newErrors.title = "イベント名を入力してください"
    if (!eventData.description.trim()) newErrors.description = "イベント説明を入力してください"
    if (!eventData.eventType) newErrors.eventType = "イベントタイプを選択してください"
    if (!eventData.date) newErrors.date = "開催日を入力してください"
    if (!eventData.startTime) newErrors.startTime = "開始時間を入力してください"
    if (!eventData.endTime) newErrors.endTime = "終了時間を入力してください"
    if (!eventData.location.trim()) newErrors.location = "開催場所を入力してください"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      // イベント登録処理
      console.log("Event data:", eventData)
      alert("イベントを登録しました")
      router.push("/admin")
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">イベント作成</h1>
            <p className="text-gray-600 text-sm">新しいイベントを登録します</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-red-500" />
              イベント情報
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* 基本情報 */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">イベント名 *</Label>
                  <Input
                    id="title"
                    value={eventData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    className={errors.title ? "border-red-500" : ""}
                    placeholder="例：夏のドッグラン大会"
                  />
                  {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
                </div>

                <div>
                  <Label htmlFor="eventType">イベントタイプ *</Label>
                  <Select value={eventData.eventType} onValueChange={(value) => handleInputChange("eventType", value)}>
                    <SelectTrigger className={errors.eventType ? "border-red-500" : ""}>
                      <SelectValue placeholder="イベントタイプを選択" />
                    </SelectTrigger>
                    <SelectContent>
                      {eventTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.eventType && <p className="text-red-500 text-sm mt-1">{errors.eventType}</p>}
                </div>

                <div>
                  <Label htmlFor="description">イベント説明 *</Label>
                  <Textarea
                    id="description"
                    value={eventData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    className={errors.description ? "border-red-500" : ""}
                    placeholder="イベントの詳細説明を入力してください"
                    rows={4}
                  />
                  {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
                </div>
              </div>

              {/* 日時・場所 */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="date">開催日 *</Label>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <Input
                      id="date"
                      type="date"
                      value={eventData.date}
                      onChange={(e) => handleInputChange("date", e.target.value)}
                      className={errors.date ? "border-red-500" : ""}
                    />
                  </div>
                  {errors.date && <p className="text-red-500 text-sm mt-1">{errors.date}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="startTime">開始時間 *</Label>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <Input
                        id="startTime"
                        type="time"
                        value={eventData.startTime}
                        onChange={(e) => handleInputChange("startTime", e.target.value)}
                        className={errors.startTime ? "border-red-500" : ""}
                      />
                    </div>
                    {errors.startTime && <p className="text-red-500 text-sm mt-1">{errors.startTime}</p>}
                  </div>
                  <div>
                    <Label htmlFor="endTime">終了時間 *</Label>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <Input
                        id="endTime"
                        type="time"
                        value={eventData.endTime}
                        onChange={(e) => handleInputChange("endTime", e.target.value)}
                        className={errors.endTime ? "border-red-500" : ""}
                      />
                    </div>
                    {errors.endTime && <p className="text-red-500 text-sm mt-1">{errors.endTime}</p>}
                  </div>
                </div>

                <div>
                  <Label htmlFor="location">開催場所 *</Label>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    <Input
                      id="location"
                      value={eventData.location}
                      onChange={(e) => handleInputChange("location", e.target.value)}
                      className={errors.location ? "border-red-500" : ""}
                      placeholder="例：ワンワン保育園 新宿店"
                    />
                  </div>
                  {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
                </div>

                <div>
                  <Label htmlFor="address">住所</Label>
                  <Input
                    id="address"
                    value={eventData.address}
                    onChange={(e) => handleInputChange("address", e.target.value)}
                    placeholder="例：東京都新宿区新宿1-1-1"
                  />
                </div>
              </div>

              {/* 参加情報 */}
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="capacity">定員</Label>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-gray-500" />
                      <Input
                        id="capacity"
                        type="number"
                        value={eventData.capacity}
                        onChange={(e) => handleInputChange("capacity", e.target.value)}
                        placeholder="例：20"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="price">参加費</Label>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500">¥</span>
                      <Input
                        id="price"
                        type="number"
                        value={eventData.price}
                        onChange={(e) => handleInputChange("price", e.target.value)}
                        placeholder="例：1000"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="requiresRegistration"
                    checked={eventData.requiresRegistration}
                    onCheckedChange={(checked) => handleInputChange("requiresRegistration", Boolean(checked))}
                  />
                  <Label htmlFor="requiresRegistration">事前予約が必要</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="isPublished"
                    checked={eventData.isPublished}
                    onCheckedChange={(checked) => handleInputChange("isPublished", Boolean(checked))}
                  />
                  <Label htmlFor="isPublished">公開する</Label>
                </div>
              </div>

              {/* 写真アップロード */}
              <div>
                <Label className="block mb-2">イベント画像</Label>
                <div className="flex items-center gap-4">
                  <div className="relative w-40 h-40 bg-gray-100 rounded-lg overflow-hidden">
                    {photoPreview ? (
                      <img
                        src={photoPreview || "/placeholder.svg"}
                        alt="イベント画像"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full">
                        <Camera className="w-8 h-8 text-gray-400 mb-1" />
                        <span className="text-sm text-gray-500">画像なし</span>
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-lg cursor-pointer inline-block">
                      画像を選択
                      <input type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
                    </label>
                    <p className="text-sm text-gray-500 mt-2">推奨サイズ: 1200 x 800px</p>
                  </div>
                </div>
              </div>

              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                イベントを登録する
                <Check className="w-4 h-4 ml-2" />
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
