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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Camera, Check, Heart, Search, Plus, User } from "lucide-react"

interface Owner {
  id: string
  name: string
  email: string
  phone: string
  avatar: string
}

const mockOwners: Owner[] = [
  {
    id: "1",
    name: "田中太郎",
    email: "tanaka@example.com",
    phone: "090-1234-5678",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "2",
    name: "佐藤花子",
    email: "sato@example.com",
    phone: "090-8765-4321",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "3",
    name: "鈴木一郎",
    email: "suzuki@example.com",
    phone: "090-5555-6666",
    avatar: "/placeholder.svg?height=40&width=40",
  },
]

export default function AdminDogRegistrationPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("existing")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedOwner, setSelectedOwner] = useState<Owner | null>(null)
  const [dogData, setDogData] = useState({
    name: "",
    breed: "",
    gender: "",
    birthDate: "",
    weight: "",
    color: "",
    microchipId: "",
    vaccinations: [] as string[],
    allergies: "",
    medications: "",
    behaviorNotes: "",
    staffNotes: "",
    photo: null as File | null,
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [photoPreview, setPhotoPreview] = useState<string>("")

  const breeds = [
    "トイプードル",
    "チワワ",
    "ダックスフンド",
    "ポメラニアン",
    "ヨークシャーテリア",
    "マルチーズ",
    "シーズー",
    "フレンチブルドッグ",
    "柴犬",
    "ゴールデンレトリバー",
    "ラブラドールレトリバー",
    "ボーダーコリー",
    "その他",
  ]

  const vaccinationTypes = ["狂犬病ワクチン", "混合ワクチン（5種）", "混合ワクチン（8種）", "混合ワクチン（10種）"]

  const filteredOwners = mockOwners.filter(
    (owner) =>
      owner.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      owner.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      owner.phone.includes(searchQuery),
  )

  const handleInputChange = (field: string, value: string | string[]) => {
    setDogData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setDogData((prev) => ({ ...prev, photo: file }))
      const reader = new FileReader()
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleVaccinationChange = (vaccination: string, checked: boolean) => {
    const updatedVaccinations = checked
      ? [...dogData.vaccinations, vaccination]
      : dogData.vaccinations.filter((v) => v !== vaccination)
    handleInputChange("vaccinations", updatedVaccinations)
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!dogData.name.trim()) newErrors.name = "犬の名前を入力してください"
    if (!dogData.breed) newErrors.breed = "犬種を選択してください"
    if (!dogData.gender) newErrors.gender = "性別を選択してください"
    if (!dogData.birthDate) newErrors.birthDate = "生年月日を入力してください"
    if (!dogData.weight) newErrors.weight = "体重を入力してください"
    if (activeTab === "existing" && !selectedOwner) newErrors.owner = "飼い主を選択してください"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      // 犬情報登録処理
      console.log("Dog profile data:", { ...dogData, owner: selectedOwner })
      alert("犬の情報を登録しました")
      router.push("/admin")
    }
  }

  const selectOwner = (owner: Owner) => {
    setSelectedOwner(owner)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">犬の情報登録（スタッフ用）</h1>
            <p className="text-gray-600 text-sm">保育園に通う犬の情報を登録します</p>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mb-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="existing">既存の飼い主</TabsTrigger>
            <TabsTrigger value="new">新規飼い主</TabsTrigger>
          </TabsList>

          <TabsContent value="existing" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5 text-blue-500" />
                  飼い主を選択
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="飼い主を検索（名前、メール、電話番号）..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {filteredOwners.length > 0 ? (
                    filteredOwners.map((owner) => (
                      <div
                        key={owner.id}
                        className={`p-3 border rounded-lg flex items-center justify-between cursor-pointer hover:bg-gray-50 ${
                          selectedOwner?.id === owner.id ? "border-blue-500 bg-blue-50" : ""
                        }`}
                        onClick={() => selectOwner(owner)}
                      >
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={owner.avatar || "/placeholder.svg"} />
                            <AvatarFallback>{owner.name[0]}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{owner.name}</p>
                            <p className="text-sm text-gray-600">{owner.email}</p>
                            <p className="text-xs text-gray-500">{owner.phone}</p>
                          </div>
                        </div>
                        {selectedOwner?.id === owner.id && <Check className="w-5 h-5 text-blue-500" />}
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-4 text-gray-500">
                      <p>飼い主が見つかりません</p>
                      <Button
                        variant="link"
                        onClick={() => setActiveTab("new")}
                        className="mt-2 text-blue-600 hover:text-blue-800"
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        新規飼い主を登録
                      </Button>
                    </div>
                  )}
                </div>

                {errors.owner && <p className="text-red-500 text-sm mt-2">{errors.owner}</p>}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="new">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5 text-blue-500" />
                  新規飼い主情報
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="ownerName">飼い主の名前 *</Label>
                    <Input id="ownerName" placeholder="例：田中太郎" />
                  </div>
                  <div>
                    <Label htmlFor="ownerEmail">メールアドレス *</Label>
                    <Input id="ownerEmail" type="email" placeholder="例：tanaka@example.com" />
                  </div>
                  <div>
                    <Label htmlFor="ownerPhone">電話番号 *</Label>
                    <Input id="ownerPhone" placeholder="例：090-1234-5678" />
                  </div>
                  <div>
                    <Label htmlFor="ownerAddress">住所</Label>
                    <Input id="ownerAddress" placeholder="例：東京都新宿区新宿1-1-1" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-red-500" />
              犬のプロフィール
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* 写真アップロード */}
              <div className="text-center">
                <div className="relative inline-block">
                  <Avatar className="w-24 h-24">
                    <AvatarImage src={photoPreview || "/placeholder.svg"} />
                    <AvatarFallback>
                      <Camera className="w-8 h-8 text-gray-400" />
                    </AvatarFallback>
                  </Avatar>
                  <label
                    htmlFor="photo"
                    className="absolute bottom-0 right-0 bg-blue-600 text-white rounded-full p-2 cursor-pointer hover:bg-blue-700"
                  >
                    <Camera className="w-4 h-4" />
                  </label>
                  <input id="photo" type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
                </div>
                <p className="text-sm text-gray-600 mt-2">犬の写真をアップロード</p>
              </div>

              {/* 基本情報 */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">犬の名前 *</Label>
                  <Input
                    id="name"
                    value={dogData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className={errors.name ? "border-red-500" : ""}
                    placeholder="例：ルイ"
                  />
                  {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                </div>

                <div>
                  <Label htmlFor="breed">犬種 *</Label>
                  <Select value={dogData.breed} onValueChange={(value) => handleInputChange("breed", value)}>
                    <SelectTrigger className={errors.breed ? "border-red-500" : ""}>
                      <SelectValue placeholder="犬種を選択してください" />
                    </SelectTrigger>
                    <SelectContent>
                      {breeds.map((breed) => (
                        <SelectItem key={breed} value={breed}>
                          {breed}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.breed && <p className="text-red-500 text-sm mt-1">{errors.breed}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="gender">性別 *</Label>
                    <Select value={dogData.gender} onValueChange={(value) => handleInputChange("gender", value)}>
                      <SelectTrigger className={errors.gender ? "border-red-500" : ""}>
                        <SelectValue placeholder="性別" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">オス</SelectItem>
                        <SelectItem value="female">メス</SelectItem>
                        <SelectItem value="neutered_male">オス（去勢済み）</SelectItem>
                        <SelectItem value="spayed_female">メス（避妊済み）</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.gender && <p className="text-red-500 text-sm mt-1">{errors.gender}</p>}
                  </div>

                  <div>
                    <Label htmlFor="weight">体重 (kg) *</Label>
                    <Input
                      id="weight"
                      type="number"
                      step="0.1"
                      value={dogData.weight}
                      onChange={(e) => handleInputChange("weight", e.target.value)}
                      className={errors.weight ? "border-red-500" : ""}
                      placeholder="5.0"
                    />
                    {errors.weight && <p className="text-red-500 text-sm mt-1">{errors.weight}</p>}
                  </div>
                </div>

                <div>
                  <Label htmlFor="birthDate">生年月日 *</Label>
                  <Input
                    id="birthDate"
                    type="date"
                    value={dogData.birthDate}
                    onChange={(e) => handleInputChange("birthDate", e.target.value)}
                    className={errors.birthDate ? "border-red-500" : ""}
                  />
                  {errors.birthDate && <p className="text-red-500 text-sm mt-1">{errors.birthDate}</p>}
                </div>

                <div>
                  <Label htmlFor="color">毛色</Label>
                  <Input
                    id="color"
                    value={dogData.color}
                    onChange={(e) => handleInputChange("color", e.target.value)}
                    placeholder="例：ブラウン、ホワイト"
                  />
                </div>

                <div>
                  <Label htmlFor="microchipId">マイクロチップID</Label>
                  <Input
                    id="microchipId"
                    value={dogData.microchipId}
                    onChange={(e) => handleInputChange("microchipId", e.target.value)}
                    placeholder="15桁の番号"
                  />
                </div>
              </div>

              {/* ワクチン接種歴 */}
              <div>
                <Label className="text-base font-medium">ワクチン接種歴</Label>
                <div className="space-y-2 mt-2">
                  {vaccinationTypes.map((vaccination) => (
                    <div key={vaccination} className="flex items-center space-x-2">
                      <Checkbox
                        id={vaccination}
                        checked={dogData.vaccinations.includes(vaccination)}
                        onCheckedChange={(checked) => handleVaccinationChange(vaccination, checked as boolean)}
                      />
                      <Label htmlFor={vaccination} className="text-sm">
                        {vaccination}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* 健康情報 */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="allergies">アレルギー・食べ物の制限</Label>
                  <Textarea
                    id="allergies"
                    value={dogData.allergies}
                    onChange={(e) => handleInputChange("allergies", e.target.value)}
                    placeholder="例：鶏肉アレルギー、小麦不耐症など"
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="medications">服用中のお薬</Label>
                  <Textarea
                    id="medications"
                    value={dogData.medications}
                    onChange={(e) => handleInputChange("medications", e.target.value)}
                    placeholder="薬名、用量、服用時間など"
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="behaviorNotes">性格・行動の特徴</Label>
                  <Textarea
                    id="behaviorNotes"
                    value={dogData.behaviorNotes}
                    onChange={(e) => handleInputChange("behaviorNotes", e.target.value)}
                    placeholder="例：人懐っこい、他の犬が苦手、音に敏感など"
                    rows={4}
                  />
                </div>

                <div>
                  <Label htmlFor="staffNotes">スタッフ用メモ</Label>
                  <Textarea
                    id="staffNotes"
                    value={dogData.staffNotes}
                    onChange={(e) => handleInputChange("staffNotes", e.target.value)}
                    placeholder="スタッフ間で共有すべき情報"
                    rows={4}
                  />
                </div>
              </div>

              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                登録を完了する
                <Check className="w-4 h-4 ml-2" />
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
