"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Save, Heart, Users, Activity } from "lucide-react"

interface BodyHandlingEvaluation {
  ears: "ok" | "slightly_dislikes" | "clearly_dislikes"
  mouth: "ok" | "slightly_dislikes" | "clearly_dislikes"
  paws: "ok" | "slightly_dislikes" | "clearly_dislikes"
  tail: "ok" | "slightly_dislikes" | "clearly_dislikes"
  back: "ok" | "slightly_dislikes" | "clearly_dislikes"
}

interface DogEvaluation {
  // 対人関係・ハンドリング
  bodyHandling: BodyHandlingEvaluation
  separationAnxiety: 1 | 2 | 3 | 4

  // 犬の基本特性
  energyLevel: 1 | 2 | 3 | 4 | 5
  greetingStyle: string[]

  // 興奮時の行動と対処法
  excitedBehaviors: string[]
  cooldownMethods: string[]

  // 他の犬との相性
  preferredDogTypes: string[]
  dislikedDogTypes: string[]
  specificPairings: string

  // 保育園利用実績
  totalVisits: number
  totalHours: number
  frequency: string
  toiletSuccessRate: number

  // トレーニング・イベント参加実績
  trainingPrograms: string[]
  eventParticipation: { [key: string]: number }
}

const bodyParts = [
  { key: "ears", label: "耳" },
  { key: "mouth", label: "口周り" },
  { key: "paws", label: "足先" },
  { key: "tail", label: "尻尾" },
  { key: "back", label: "背中" },
]

const handlingOptions = [
  { value: "ok", label: "OK（問題なし）", color: "bg-green-100 text-green-800" },
  { value: "slightly_dislikes", label: "少し嫌がる", color: "bg-yellow-100 text-yellow-800" },
  { value: "clearly_dislikes", label: "明確に嫌がる", color: "bg-red-100 text-red-800" },
]

const separationAnxietyLevels = [
  { value: 1, label: "レベル1: 落ち着いている" },
  { value: 2, label: "レベル2: 少し鳴く・クンクン言う" },
  { value: 3, label: "レベル3: 鳴き続ける" },
  { value: 4, label: "レベル4: パニック・破壊行動の兆候" },
]

const energyLevels = [
  { value: 1, label: "1: 非常に穏やか（ほとんど寝ている）" },
  { value: 2, label: "2: 穏やか（ゆっくり歩き回る程度）" },
  { value: 3, label: "3: 普通（適度に遊び、適度に休む）" },
  { value: 4, label: "4: 活発（よく走り回る、遊び好き）" },
  { value: 5, label: "5: 非常に活発（常に動き回っている）" },
]

const greetingStyles = [
  "友好的（積極的に匂いを嗅ぐ）",
  "慎重派（距離を置いて様子を見る）",
  "マイペース（関心を示さない）",
  "受け身（相手の出方を待つ）",
  "やや苦手（避ける、後ずさりする）",
]

const excitedBehaviorOptions = [
  "要求吠え",
  "飛びつき",
  "甘噛み",
  "マウンティング",
  "走り回る",
  "他の犬を執拗に追いかける",
]

const cooldownMethodOptions = [
  "ハウス/クレートでの休息",
  "知育トイ/ノーズワーク",
  "マッサージ/撫でる",
  "他の犬から隔離し、静かな場所で休ませる",
  "コマンドでの指示（ふせ、まて）",
]

const dogTypeOptions = [
  "自分より小さい犬",
  "自分より大きい犬",
  "同程度のサイズの犬",
  "オス",
  "メス",
  "去勢済みオス",
  "避妊済みメス",
  "パピー",
  "成犬",
  "老犬",
  "穏やかな犬",
  "遊び好きな犬",
]

const trainingProgramOptions = [
  "パピー教室",
  "基礎しつけクラス",
  "中級クラス",
  "上級クラス",
  "アジリティ",
  "ノーズワーク",
]

export default function DogEvaluationPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [evaluation, setEvaluation] = useState<DogEvaluation>({
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
    dislikedDogTypes: [],
    specificPairings: "",
    totalVisits: 0,
    totalHours: 0,
    frequency: "",
    toiletSuccessRate: 100,
    trainingPrograms: [],
    eventParticipation: {
      共同散歩会: 0,
      ドッグラン: 0,
      しつけ教室: 0,
    },
  })

  const handleBodyHandlingChange = (part: keyof BodyHandlingEvaluation, value: string) => {
    setEvaluation((prev) => ({
      ...prev,
      bodyHandling: {
        ...prev.bodyHandling,
        [part]: value,
      },
    }))
  }

  const handleArrayToggle = (field: keyof DogEvaluation, value: string) => {
    setEvaluation((prev) => {
      const currentArray = prev[field] as string[]
      const newArray = currentArray.includes(value)
        ? currentArray.filter((item) => item !== value)
        : [...currentArray, value]
      return { ...prev, [field]: newArray }
    })
  }

  const handleEventParticipationChange = (event: string, value: number) => {
    setEvaluation((prev) => ({
      ...prev,
      eventParticipation: {
        ...prev.eventParticipation,
        [event]: value,
      },
    }))
  }

  const handleSave = () => {
    // 評価データを保存
    console.log("Saving evaluation:", evaluation)
    alert("評価データを保存しました")
    router.back()
  }

  const getHandlingBadge = (value: string) => {
    const option = handlingOptions.find((opt) => opt.value === value)
    return option ? <Badge className={option.color}>{option.label}</Badge> : null
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">犬の詳細評価</h1>
            <p className="text-gray-600 text-sm">保育園での行動観察に基づく詳細評価</p>
          </div>
        </div>

        <Tabs defaultValue="handling" className="w-full">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="handling">ハンドリング</TabsTrigger>
            <TabsTrigger value="characteristics">基本特性</TabsTrigger>
            <TabsTrigger value="excitement">興奮時対応</TabsTrigger>
            <TabsTrigger value="socialization">犬社会性</TabsTrigger>
          </TabsList>

          <TabsContent value="handling" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="w-5 h-5 text-red-500" />
                  身体接触への許容度（ボディ・ハンドリング）
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {bodyParts.map((part) => (
                    <div key={part.key} className="space-y-3">
                      <Label className="text-base font-medium">{part.label}</Label>
                      <div className="space-y-2">
                        {handlingOptions.map((option) => (
                          <div key={option.value} className="flex items-center space-x-2">
                            <input
                              type="radio"
                              id={`${part.key}-${option.value}`}
                              name={part.key}
                              value={option.value}
                              checked={
                                evaluation.bodyHandling[part.key as keyof BodyHandlingEvaluation] === option.value
                              }
                              onChange={(e) =>
                                handleBodyHandlingChange(part.key as keyof BodyHandlingEvaluation, e.target.value)
                              }
                              className="w-4 h-4"
                            />
                            <Label htmlFor={`${part.key}-${option.value}`} className="text-sm">
                              {option.label}
                            </Label>
                          </div>
                        ))}
                      </div>
                      <div className="mt-2">
                        {getHandlingBadge(evaluation.bodyHandling[part.key as keyof BodyHandlingEvaluation])}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-500" />
                  分離不安のレベル
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {separationAnxietyLevels.map((level) => (
                    <div key={level.value} className="flex items-center space-x-2">
                      <input
                        type="radio"
                        id={`separation-${level.value}`}
                        name="separationAnxiety"
                        value={level.value}
                        checked={evaluation.separationAnxiety === level.value}
                        onChange={(e) =>
                          setEvaluation((prev) => ({
                            ...prev,
                            separationAnxiety: Number.parseInt(e.target.value) as 1 | 2 | 3 | 4,
                          }))
                        }
                        className="w-4 h-4"
                      />
                      <Label htmlFor={`separation-${level.value}`} className="text-sm">
                        {level.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="characteristics" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-green-500" />
                  エネルギーレベル
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {energyLevels.map((level) => (
                    <div key={level.value} className="flex items-center space-x-2">
                      <input
                        type="radio"
                        id={`energy-${level.value}`}
                        name="energyLevel"
                        value={level.value}
                        checked={evaluation.energyLevel === level.value}
                        onChange={(e) =>
                          setEvaluation((prev) => ({
                            ...prev,
                            energyLevel: Number.parseInt(e.target.value) as 1 | 2 | 3 | 4 | 5,
                          }))
                        }
                        className="w-4 h-4"
                      />
                      <Label htmlFor={`energy-${level.value}`} className="text-sm">
                        {level.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>挨拶のスタイル（複数選択可）</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {greetingStyles.map((style) => (
                    <div key={style} className="flex items-center space-x-2">
                      <Checkbox
                        id={`greeting-${style}`}
                        checked={evaluation.greetingStyle.includes(style)}
                        onCheckedChange={() => handleArrayToggle("greetingStyle", style)}
                      />
                      <Label htmlFor={`greeting-${style}`} className="text-sm">
                        {style}
                      </Label>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="excitement" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>興奮時の主な行動（複数選択可）</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {excitedBehaviorOptions.map((behavior) => (
                    <div key={behavior} className="flex items-center space-x-2">
                      <Checkbox
                        id={`excited-${behavior}`}
                        checked={evaluation.excitedBehaviors.includes(behavior)}
                        onCheckedChange={() => handleArrayToggle("excitedBehaviors", behavior)}
                      />
                      <Label htmlFor={`excited-${behavior}`} className="text-sm">
                        {behavior}
                      </Label>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>有効なクールダウン方法（複数選択可）</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {cooldownMethodOptions.map((method) => (
                    <div key={method} className="flex items-center space-x-2">
                      <Checkbox
                        id={`cooldown-${method}`}
                        checked={evaluation.cooldownMethods.includes(method)}
                        onCheckedChange={() => handleArrayToggle("cooldownMethods", method)}
                      />
                      <Label htmlFor={`cooldown-${method}`} className="text-sm">
                        {method}
                      </Label>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="socialization" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>好きな犬のタイプ（複数選択可）</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {dogTypeOptions.map((type) => (
                    <div key={type} className="flex items-center space-x-2">
                      <Checkbox
                        id={`preferred-${type}`}
                        checked={evaluation.preferredDogTypes.includes(type)}
                        onCheckedChange={() => handleArrayToggle("preferredDogTypes", type)}
                      />
                      <Label htmlFor={`preferred-${type}`} className="text-sm">
                        {type}
                      </Label>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>苦手な犬のタイプ（複数選択可）</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {dogTypeOptions.map((type) => (
                    <div key={type} className="flex items-center space-x-2">
                      <Checkbox
                        id={`disliked-${type}`}
                        checked={evaluation.dislikedDogTypes.includes(type)}
                        onCheckedChange={() => handleArrayToggle("dislikedDogTypes", type)}
                      />
                      <Label htmlFor={`disliked-${type}`} className="text-sm">
                        {type}
                      </Label>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>具体的なペアリング実績</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={evaluation.specificPairings}
                  onChange={(e) => setEvaluation((prev) => ({ ...prev, specificPairings: e.target.value }))}
                  placeholder="相性が良い犬や注意が必要な犬について具体的に記載してください。&#10;例：「園の『ポチちゃん（トイプードル）』とはいつも楽しそうに遊ぶ」"
                  rows={6}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="mt-8 flex justify-end">
          <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
            <Save className="w-4 h-4 mr-2" />
            評価を保存
          </Button>
        </div>
      </div>
    </div>
  )
}
