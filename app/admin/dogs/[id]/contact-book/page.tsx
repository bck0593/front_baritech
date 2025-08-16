"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Save, Heart, Users, Zap, AlertTriangle, Calendar } from "lucide-react"
import { useTheme } from "@/contexts/theme-context"

export default function ContactBookPage() {
  const router = useRouter()
  const { currentTheme } = useTheme()
  const [activeTab, setActiveTab] = useState("handling")

  // フォームデータの状態管理
  const [formData, setFormData] = useState({
    // 1. 対人関係・ハンドリング
    bodyHandling: {
      ears: "ok",
      mouth: "slightly_dislikes",
      paws: "ok",
      tail: "ok",
      back: "ok",
    },
    separationAnxiety: "level2",

    // 2. 犬の基本特性
    energyLevel: 3,
    greetingStyle: ["friendly", "cautious"],

    // 3. 興奮時の行動と対処法
    excitedBehaviors: ["barking", "jumping"],
    cooldownMethods: ["crate", "toys"],

    // 4. 他の犬との相性
    preferredDogTypes: ["smaller", "calm"],
    difficultDogTypes: ["larger", "energetic"],
    pairingNotes: "",

    // 5. 保育園利用実績
    totalVisits: 50,
    totalHours: 200,
    frequency: "weekly",
    toiletSuccessRate: 98,

    // 6. トレーニング・イベント参加実績
    trainingPrograms: ["puppy_class"],
    eventParticipation: {
      walks: 5,
      dogRun: 3,
    },
  })

  const handleSave = () => {
    console.log("保存データ:", formData)
    // 保存処理の実装
    router.back()
  }

  const bodyParts = [
    { key: "ears", label: "耳" },
    { key: "mouth", label: "口周り" },
    { key: "paws", label: "足先" },
    { key: "tail", label: "尻尾" },
    { key: "back", label: "背中" },
  ]

  const handlingOptions = [
    { value: "ok", label: "問題なし", color: "text-green-600" },
    { value: "slightly_dislikes", label: "少し嫌がる", color: "text-yellow-600" },
    { value: "clearly_dislikes", label: "明確に嫌がる", color: "text-red-600" },
  ]

  const greetingOptions = [
    { value: "friendly", label: "友好的" },
    { value: "cautious", label: "慎重派" },
    { value: "independent", label: "マイペース" },
    { value: "passive", label: "受け身" },
    { value: "avoidant", label: "やや苦手" },
  ]

  const excitedBehaviorOptions = [
    { value: "barking", label: "要求吠え" },
    { value: "jumping", label: "飛びつき" },
    { value: "biting", label: "甘噛み" },
    { value: "mounting", label: "マウンティング" },
    { value: "running", label: "走り回る" },
    { value: "chasing", label: "他の犬を執拗に追いかける" },
  ]

  const cooldownOptions = [
    { value: "crate", label: "ハウス/クレートでの休息" },
    { value: "toys", label: "知育トイ/ノーズワーク" },
    { value: "massage", label: "マッサージ/撫でる" },
    { value: "isolation", label: "他の犬から隔離し、静かな場所で休ませる" },
    { value: "commands", label: "コマンドでの指示（ふせ、まて）" },
  ]

  const dogTypeOptions = [
    { value: "smaller", label: "自分より小さい" },
    { value: "larger", label: "自分より大きい" },
    { value: "same_size", label: "同程度" },
    { value: "male", label: "オス" },
    { value: "female", label: "メス" },
    { value: "neutered", label: "去勢済" },
    { value: "spayed", label: "避妊済" },
    { value: "puppy", label: "パピー" },
    { value: "adult", label: "成犬" },
    { value: "senior", label: "老犬" },
    { value: "calm", label: "穏やかな犬" },
    { value: "energetic", label: "遊び好きな犬" },
  ]

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="max-w-md mx-auto bg-white">
        {/* ヘッダー */}
        <div className="p-4 border-b flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-gray-900">連絡帳記録</h1>
            <p className="text-sm text-gray-600">ルイちゃんの園での様子</p>
          </div>
          <Button onClick={handleSave} size="sm" style={{ backgroundColor: currentTheme.primary[600] }}>
            <Save className="w-4 h-4 mr-2" />
            保存
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 sticky top-0 z-10 bg-white border-b">
            <TabsTrigger value="handling">ふれあい</TabsTrigger>
            <TabsTrigger value="behavior">行動・性格</TabsTrigger>
            <TabsTrigger value="records">記録・実績</TabsTrigger>
          </TabsList>

          <TabsContent value="handling" className="p-4 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="w-5 h-5" style={{ color: currentTheme.primary[600] }} />
                  身体のふれあい（お手入れ時の様子）
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {bodyParts.map((part) => (
                  <div key={part.key} className="space-y-2">
                    <Label className="text-sm font-medium">{part.label}</Label>
                    <RadioGroup
                      value={formData.bodyHandling[part.key as keyof typeof formData.bodyHandling]}
                      onValueChange={(value) =>
                        setFormData({
                          ...formData,
                          bodyHandling: { ...formData.bodyHandling, [part.key]: value },
                        })
                      }
                    >
                      {handlingOptions.map((option) => (
                        <div key={option.value} className="flex items-center space-x-2">
                          <RadioGroupItem value={option.value} id={`${part.key}-${option.value}`} />
                          <Label htmlFor={`${part.key}-${option.value}`} className={option.color}>
                            {option.label}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" style={{ color: currentTheme.primary[600] }} />
                  お別れの時の様子
                </CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup
                  value={formData.separationAnxiety}
                  onValueChange={(value) => setFormData({ ...formData, separationAnxiety: value })}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="level1" id="level1" />
                    <Label htmlFor="level1" className="text-green-600">
                      レベル1: 落ち着いている
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="level2" id="level2" />
                    <Label htmlFor="level2" className="text-yellow-600">
                      レベル2: 少し鳴く・クンクン言う
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="level3" id="level3" />
                    <Label htmlFor="level3" className="text-orange-600">
                      レベル3: 鳴き続ける
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="level4" id="level4" />
                    <Label htmlFor="level4" className="text-red-600">
                      レベル4: パニック・破壊行動の兆候
                    </Label>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="behavior" className="p-4 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5" style={{ color: currentTheme.primary[600] }} />
                  元気度・活発さ
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>非常に穏やか</span>
                    <span>非常に活発</span>
                  </div>
                  <Progress value={formData.energyLevel * 20} className="w-full" />
                  <div className="flex justify-center">
                    <Input
                      type="range"
                      min="1"
                      max="5"
                      value={formData.energyLevel}
                      onChange={(e) => setFormData({ ...formData, energyLevel: Number.parseInt(e.target.value) })}
                      className="w-full"
                    />
                  </div>
                  <p className="text-center text-sm text-gray-600">現在のレベル: {formData.energyLevel}/5</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" style={{ color: currentTheme.primary[600] }} />
                  お友達への挨拶の仕方
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {greetingOptions.map((option) => (
                  <div key={option.value} className="flex items-center space-x-2">
                    <Checkbox
                      id={option.value}
                      checked={formData.greetingStyle.includes(option.value)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setFormData({
                            ...formData,
                            greetingStyle: [...formData.greetingStyle, option.value],
                          })
                        } else {
                          setFormData({
                            ...formData,
                            greetingStyle: formData.greetingStyle.filter((style) => style !== option.value),
                          })
                        }
                      }}
                    />
                    <Label htmlFor={option.value}>{option.label}</Label>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" style={{ color: currentTheme.primary[600] }} />
                  興奮時の行動
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {excitedBehaviorOptions.map((option) => (
                  <div key={option.value} className="flex items-center space-x-2">
                    <Checkbox
                      id={`excited-${option.value}`}
                      checked={formData.excitedBehaviors.includes(option.value)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setFormData({
                            ...formData,
                            excitedBehaviors: [...formData.excitedBehaviors, option.value],
                          })
                        } else {
                          setFormData({
                            ...formData,
                            excitedBehaviors: formData.excitedBehaviors.filter((behavior) => behavior !== option.value),
                          })
                        }
                      }}
                    />
                    <Label htmlFor={`excited-${option.value}`}>{option.label}</Label>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="w-5 h-5" style={{ color: currentTheme.primary[600] }} />
                  効果的な落ち着かせ方
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {cooldownOptions.map((option) => (
                  <div key={option.value} className="flex items-center space-x-2">
                    <Checkbox
                      id={`cooldown-${option.value}`}
                      checked={formData.cooldownMethods.includes(option.value)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setFormData({
                            ...formData,
                            cooldownMethods: [...formData.cooldownMethods, option.value],
                          })
                        } else {
                          setFormData({
                            ...formData,
                            cooldownMethods: formData.cooldownMethods.filter((method) => method !== option.value),
                          })
                        }
                      }}
                    />
                    <Label htmlFor={`cooldown-${option.value}`}>{option.label}</Label>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="records" className="p-4 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" style={{ color: currentTheme.primary[600] }} />
                  基本記録
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-sm font-medium mb-2 block">今日の特記事項</Label>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">今日も元気に過ごしました。お友達とも仲良く遊んでいます。</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
