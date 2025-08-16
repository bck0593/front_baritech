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
import { Heart, Camera, ArrowLeft, Check } from "lucide-react"

export default function DogProfilePage() {
  const router = useRouter()
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
    emergencyContact: "",
    vetInfo: "",
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

    if (!dogData.name.trim()) newErrors.name = "愛犬の名前を入力してください"
    if (!dogData.breed) newErrors.breed = "犬種を選択してください"
    if (!dogData.gender) newErrors.gender = "性別を選択してください"
    if (!dogData.birthDate) newErrors.birthDate = "生年月日を入力してください"
    if (!dogData.weight) newErrors.weight = "体重を入力してください"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      // 愛犬情報登録処理
      console.log("Dog profile data:", dogData)
      router.push("/register/complete")
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-md mx-auto px-4">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">愛犬情報の登録</h1>
            <p className="text-gray-600 text-sm">安全なお預かりのために詳しく教えてください</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-red-500" />
              愛犬のプロフィール
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
                <p className="text-sm text-gray-600 mt-2">愛犬の写真をアップロード</p>
              </div>

              {/* 基本情報 */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">愛犬の名前 *</Label>
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
              </div>

              {/* 緊急連絡先 */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="emergencyContact">緊急連絡先</Label>
                  <Input
                    id="emergencyContact"
                    value={dogData.emergencyContact}
                    onChange={(e) => handleInputChange("emergencyContact", e.target.value)}
                    placeholder="家族・友人の連絡先"
                  />
                </div>

                <div>
                  <Label htmlFor="vetInfo">かかりつけ動物病院</Label>
                  <Textarea
                    id="vetInfo"
                    value={dogData.vetInfo}
                    onChange={(e) => handleInputChange("vetInfo", e.target.value)}
                    placeholder="病院名、住所、電話番号"
                    rows={3}
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
