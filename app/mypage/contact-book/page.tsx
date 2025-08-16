"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, Heart, Users, Zap, AlertTriangle, Trophy, CheckCircle, AlertCircle, XCircle } from "lucide-react"
import { useTheme } from "@/contexts/theme-context"

export default function ContactBookViewPage() {
  const router = useRouter()
  const { currentTheme } = useTheme()
  const [activeTab, setActiveTab] = useState("handling")

  // サンプルデータ（実際はAPIから取得）
  const contactBookData = {
    dogName: "ルイ",
    lastUpdated: "2024年1月15日",
    bodyHandling: {
      ears: "ok",
      mouth: "slightly_dislikes",
      paws: "ok",
      tail: "ok",
      back: "ok",
    },
    separationAnxiety: "level2",
    energyLevel: 3,
    greetingStyle: ["friendly", "cautious"],
    excitedBehaviors: ["barking", "jumping"],
    cooldownMethods: ["crate", "toys"],
    preferredDogTypes: ["smaller", "calm"],
    difficultDogTypes: ["larger", "energetic"],
    pairingNotes:
      "園の『ももちゃん（トイプードル）』とはいつも楽しそうに遊んでいます。『たろうくん（ボーダーコリー）』の素早い動きには少し驚くことがありますが、慣れてきています。",
    totalVisits: 50,
    totalHours: 200,
    frequency: "weekly",
    toiletSuccessRate: 98,
    trainingPrograms: ["puppy_class", "basic_obedience"],
    eventParticipation: {
      walks: 5,
      dogRun: 3,
    },
  }

  const getHandlingIcon = (level: string) => {
    switch (level) {
      case "ok":
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case "slightly_dislikes":
        return <AlertCircle className="w-4 h-4 text-yellow-600" />
      case "clearly_dislikes":
        return <XCircle className="w-4 h-4 text-red-600" />
      default:
        return <CheckCircle className="w-4 h-4 text-gray-400" />
    }
  }

  const getHandlingText = (level: string) => {
    switch (level) {
      case "ok":
        return "問題なし"
      case "slightly_dislikes":
        return "少し嫌がる"
      case "clearly_dislikes":
        return "明確に嫌がる"
      default:
        return "未記録"
    }
  }

  const getSeparationAnxietyText = (level: string) => {
    switch (level) {
      case "level1":
        return "落ち着いている"
      case "level2":
        return "少し鳴く・クンクン言う"
      case "level3":
        return "鳴き続ける"
      case "level4":
        return "パニック・破壊行動の兆候"
      default:
        return "未記録"
    }
  }

  const getSeparationAnxietyColor = (level: string) => {
    switch (level) {
      case "level1":
        return "text-green-600"
      case "level2":
        return "text-yellow-600"
      case "level3":
        return "text-orange-600"
      case "level4":
        return "text-red-600"
      default:
        return "text-gray-400"
    }
  }

  const bodyParts = [
    { key: "ears", label: "耳" },
    { key: "mouth", label: "口周り" },
    { key: "paws", label: "足先" },
    { key: "tail", label: "尻尾" },
    { key: "back", label: "背中" },
  ]

  const greetingLabels: { [key: string]: string } = {
    friendly: "友好的",
    cautious: "慎重派",
    independent: "マイペース",
    passive: "受け身",
    avoidant: "やや苦手",
  }

  const behaviorLabels: { [key: string]: string } = {
    barking: "要求吠え",
    jumping: "飛びつき",
    biting: "甘噛み",
    mounting: "マウンティング",
    running: "走り回る",
    chasing: "他の犬を執拗に追いかける",
  }

  const cooldownLabels: { [key: string]: string } = {
    crate: "ハウス/クレートでの休息",
    toys: "知育トイ/ノーズワーク",
    massage: "マッサージ/撫でる",
    isolation: "他の犬から隔離し、静かな場所で休ませる",
    commands: "コマンドでの指示（ふせ、まて）",
  }

  const dogTypeLabels: { [key: string]: string } = {
    smaller: "自分より小さい",
    larger: "自分より大きい",
    same_size: "同程度",
    male: "オス",
    female: "メス",
    neutered: "去勢済",
    spayed: "避妊済",
    puppy: "パピー",
    adult: "成犬",
    senior: "老犬",
    calm: "穏やかな犬",
    energetic: "遊び好きな犬",
  }

  const frequencyLabels: { [key: string]: string } = {
    daily: "毎日",
    weekly: "週1回",
    biweekly: "月2回",
    monthly: "月1回",
    irregular: "不定期",
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="max-w-md mx-auto bg-white">
        {/* ヘッダー */}
        <div className="p-4 border-b flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-gray-900">連絡帳</h1>
            <p className="text-sm text-gray-600">{contactBookData.dogName}ちゃんの園での様子</p>
          </div>
        </div>

        {/* 最終更新日 */}
        <div className="p-4 bg-blue-50 border-b">
          <p className="text-sm text-blue-700">最終更新: {contactBookData.lastUpdated}</p>
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
              <CardContent className="space-y-3">
                {bodyParts.map((part) => (
                  <div key={part.key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium">{part.label}</span>
                    <div className="flex items-center gap-2">
                      {getHandlingIcon(
                        contactBookData.bodyHandling[part.key as keyof typeof contactBookData.bodyHandling],
                      )}
                      <span className="text-sm">
                        {getHandlingText(
                          contactBookData.bodyHandling[part.key as keyof typeof contactBookData.bodyHandling],
                        )}
                      </span>
                    </div>
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
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className={`font-medium ${getSeparationAnxietyColor(contactBookData.separationAnxiety)}`}>
                    {getSeparationAnxietyText(contactBookData.separationAnxiety)}
                  </p>
                </div>
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
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>非常に穏やか</span>
                    <span>非常に活発</span>
                  </div>
                  <Progress value={contactBookData.energyLevel * 20} className="w-full" />
                  <p className="text-center text-sm font-medium">レベル {contactBookData.energyLevel}/5</p>
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
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {contactBookData.greetingStyle.map((style) => (
                    <Badge key={style} variant="secondary">
                      {greetingLabels[style]}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" style={{ color: currentTheme.primary[600] }} />
                  興奮時の行動
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {contactBookData.excitedBehaviors.map((behavior) => (
                    <Badge key={behavior} variant="outline" className="text-orange-600 border-orange-200">
                      {behaviorLabels[behavior]}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="w-5 h-5" style={{ color: currentTheme.primary[600] }} />
                  効果的な落ち着かせ方
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {contactBookData.cooldownMethods.map((method) => (
                    <Badge key={method} variant="outline" className="text-green-600 border-green-200">
                      {cooldownLabels[method]}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="records" className="p-4 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="w-5 h-5" style={{ color: currentTheme.primary[600] }} />
                  お友達との相性
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium text-green-600 mb-2">好きなお友達のタイプ</h4>
                  <div className="flex flex-wrap gap-2">
                    {contactBookData.preferredDogTypes.map((type) => (
                      <Badge key={type} variant="outline" className="text-green-600 border-green-200">
                        {dogTypeLabels[type]}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-orange-600 mb-2">苦手なお友達のタイプ</h4>
                  <div className="flex flex-wrap gap-2">
                    {contactBookData.difficultDogTypes.map((type) => (
                      <Badge key={type} variant="outline" className="text-orange-600 border-orange-200">
                        {dogTypeLabels[type]}
                      </Badge>
                    ))}
                  </div>
                </div>
                {contactBookData.pairingNotes && (
                  <div>
                    <h4 className="font-medium mb-2">園内でのお友達関係</h4>
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm text-blue-800">{contactBookData.pairingNotes}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
