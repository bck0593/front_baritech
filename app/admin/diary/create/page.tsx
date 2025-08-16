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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ArrowLeft, BookOpen, Camera, Check, Search, Calendar } from "lucide-react"

interface Dog {
  id: string
  name: string
  breed: string
  ownerName: string
  avatar: string
}

const mockDogs: Dog[] = [
  {
    id: "1",
    name: "ルイ",
    breed: "トイプードル",
    ownerName: "田中太郎",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "2",
    name: "ココ",
    breed: "チワワ",
    ownerName: "佐藤花子",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "3",
    name: "チョコ",
    breed: "ダックスフンド",
    ownerName: "鈴木一郎",
    avatar: "/placeholder.svg?height=40&width=40",
  },
]

export default function AdminDiaryCreatePage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedDog, setSelectedDog] = useState<Dog | null>(null)
  const [diaryData, setDiaryData] = useState({
    date: new Date().toISOString().split("T")[0],
    activities: {
      meal: { status: "", time: "", note: "" },
      excretion: { status: "", time: "", note: "" },
    },
    staffNote: "",
    photos: [] as File[],
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [photoPreview, setPhotoPreview] = useState<string[]>([])

  const filteredDogs = mockDogs.filter(
    (dog) =>
      dog.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dog.breed.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dog.ownerName.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleInputChange = (field: string, value: string) => {
    setDiaryData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const handleActivityChange = (activity: string, field: string, value: string) => {
    setDiaryData((prev) => ({
      ...prev,
      activities: {
        ...prev.activities,
        [activity]: {
          ...prev.activities[activity as keyof typeof prev.activities],
          [field]: value,
        },
      },
    }))
  }

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      const newPhotos = [...diaryData.photos]
      const newPreviews = [...photoPreview]

      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        newPhotos.push(file)

        const reader = new FileReader()
        reader.onloadend = () => {
          newPreviews.push(reader.result as string)
          setPhotoPreview([...newPreviews])
        }
        reader.readAsDataURL(file)
      }

      setDiaryData((prev) => ({ ...prev, photos: newPhotos }))
    }
  }

  const removePhoto = (index: number) => {
    const newPhotos = [...diaryData.photos]
    const newPreviews = [...photoPreview]
    newPhotos.splice(index, 1)
    newPreviews.splice(index, 1)
    setDiaryData((prev) => ({ ...prev, photos: newPhotos }))
    setPhotoPreview(newPreviews)
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!selectedDog) newErrors.dog = "犬を選択してください"
    if (!diaryData.date) newErrors.date = "日付を入力してください"
    if (!diaryData.staffNote.trim()) newErrors.staffNote = "スタッフメモを入力してください"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      // 連絡帳登録処理
      console.log("Diary data:", { ...diaryData, dog: selectedDog })
      alert("連絡帳を登録しました")
      router.push("/admin")
    }
  }

  const selectDog = (dog: Dog) => {
    setSelectedDog(dog)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">連絡帳作成</h1>
            <p className="text-gray-600 text-sm">犬の一日の様子を記録します</p>
          </div>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="w-5 h-5 text-blue-500" />
              犬を選択
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="犬を検索（名前、犬種、飼い主名）..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="space-y-2 max-h-60 overflow-y-auto">
              {filteredDogs.length > 0 ? (
                filteredDogs.map((dog) => (
                  <div
                    key={dog.id}
                    className={`p-3 border rounded-lg flex items-center justify-between cursor-pointer hover:bg-gray-50 ${
                      selectedDog?.id === dog.id ? "border-blue-500 bg-blue-50" : ""
                    }`}
                    onClick={() => selectDog(dog)}
                  >
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={dog.avatar || "/placeholder.svg"} />
                        <AvatarFallback>{dog.name[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{dog.name}</p>
                        <p className="text-sm text-gray-600">{dog.breed}</p>
                        <p className="text-xs text-gray-500">飼い主: {dog.ownerName}</p>
                      </div>
                    </div>
                    {selectedDog?.id === dog.id && <Check className="w-5 h-5 text-blue-500" />}
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-gray-500">
                  <p>犬が見つかりません</p>
                </div>
              )}
            </div>

            {errors.dog && <p className="text-red-500 text-sm mt-2">{errors.dog}</p>}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-blue-500" />
              連絡帳の内容
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-full">
                  <Label htmlFor="date">日付 *</Label>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <Input
                      id="date"
                      type="date"
                      value={diaryData.date}
                      onChange={(e) => handleInputChange("date", e.target.value)}
                      className={errors.date ? "border-red-500" : ""}
                    />
                  </div>
                  {errors.date && <p className="text-red-500 text-sm mt-1">{errors.date}</p>}
                </div>
              </div>

              {/* 活動記録 */}
              <div>
                <h3 className="font-medium text-lg mb-3">活動記録</h3>

                <div className="space-y-4">
                  {/* 食事 */}
                  <div className="border rounded-lg p-4">
                    <h4 className="font-medium mb-3 flex items-center gap-2">
                      <span className="text-lg">🍽️</span>
                      食事
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="meal-status">状態</Label>
                        <Select
                          value={diaryData.activities.meal.status}
                          onValueChange={(value) => handleActivityChange("meal", "status", value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="選択してください" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="完食">完食</SelectItem>
                            <SelectItem value="半分程度">半分程度</SelectItem>
                            <SelectItem value="少し">少し</SelectItem>
                            <SelectItem value="未食">未食</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="meal-time">時間</Label>
                        <Input
                          id="meal-time"
                          value={diaryData.activities.meal.time}
                          onChange={(e) => handleActivityChange("meal", "time", e.target.value)}
                          placeholder="例：9:30"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <Label htmlFor="meal-note">メモ</Label>
                        <Textarea
                          id="meal-note"
                          value={diaryData.activities.meal.note}
                          onChange={(e) => handleActivityChange("meal", "note", e.target.value)}
                          placeholder="食事の様子など"
                          rows={2}
                        />
                      </div>
                    </div>
                  </div>

                  {/* 排泄 */}
                  <div className="border rounded-lg p-4">
                    <h4 className="font-medium mb-3 flex items-center gap-2">
                      <span className="text-lg">🚽</span>
                      排泄
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="excretion-status">状態</Label>
                        <Select
                          value={diaryData.activities.excretion.status}
                          onValueChange={(value) => handleActivityChange("excretion", "status", value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="選択してください" />
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
                      <div>
                        <Label htmlFor="excretion-time">時間</Label>
                        <Input
                          id="excretion-time"
                          value={diaryData.activities.excretion.time}
                          onChange={(e) => handleActivityChange("excretion", "time", e.target.value)}
                          placeholder="例：10:15"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <Label htmlFor="excretion-note">メモ</Label>
                        <Textarea
                          id="excretion-note"
                          value={diaryData.activities.excretion.note}
                          onChange={(e) => handleActivityChange("excretion", "note", e.target.value)}
                          placeholder="排泄の様子など"
                          rows={2}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* スタッフメモ */}
              <div>
                <Label htmlFor="staffNote">スタッフからのメッセージ *</Label>
                <Textarea
                  id="staffNote"
                  value={diaryData.staffNote}
                  onChange={(e) => handleInputChange("staffNote", e.target.value)}
                  placeholder="一日の様子や特記事項を記入してください"
                  rows={4}
                  className={errors.staffNote ? "border-red-500" : ""}
                />
                {errors.staffNote && <p className="text-red-500 text-sm mt-1">{errors.staffNote}</p>}
              </div>

              {/* 写真アップロード */}
              <div>
                <Label className="block mb-2">写真</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-3">
                  {photoPreview.map((preview, index) => (
                    <div key={index} className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
                      <img
                        src={preview || "/placeholder.svg"}
                        alt={`写真 ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removePhoto(index)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <line x1="18" y1="6" x2="6" y2="18"></line>
                          <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                      </button>
                    </div>
                  ))}
                  <label className="aspect-square bg-gray-100 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-gray-200">
                    <Camera className="w-8 h-8 text-gray-400 mb-1" />
                    <span className="text-sm text-gray-500">写真を追加</span>
                    <input type="file" accept="image/*" multiple onChange={handlePhotoChange} className="hidden" />
                  </label>
                </div>
              </div>

              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                連絡帳を登録する
                <Check className="w-4 h-4 ml-2" />
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
