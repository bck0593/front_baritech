"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ThemedCard, ThemedCardHeader, CardContent, CardTitle } from "@/components/themed-card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import BottomNavigation from "@/components/bottom-navigation"
import { PageHeader } from "@/components/page-header"
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
        return <AlertCircle className="w-4 h-4" style={{ color: 'rgb(0, 50, 115)' }} />
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
        return "rgb(0, 50, 115)"
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
    <>
      <div className="min-h-screen bg-white pb-20">
        <div className="max-w-md mx-auto">
          {/* ヘッダー */}
          <PageHeader 
            title="連絡帳" 
            subtitle={`${contactBookData.dogName}ちゃんの園での様子`}
            showBackButton 
          />

          {/* 最終更新日 */}
          <div className="px-4 pb-4">
            <div className="p-3 rounded-lg" style={{ backgroundColor: 'rgb(224, 242, 254)' }}>
              <p className="text-sm" style={{ color: 'rgb(0, 50, 115)' }}>最終更新: {contactBookData.lastUpdated}</p>
            </div>
          </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mx-4 mb-4 bg-gray-100 rounded-lg p-1">
            <TabsTrigger value="handling" className="rounded-md">ふれあい</TabsTrigger>
            <TabsTrigger value="behavior" className="rounded-md">行動・性格</TabsTrigger>
            <TabsTrigger value="records" className="rounded-md">記録・実績</TabsTrigger>
          </TabsList>

          <TabsContent value="handling" className="px-4 space-y-4">
            <ThemedCard>
              <ThemedCardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="w-5 h-5" style={{ color: currentTheme.primary[600] }} />
                  身体のふれあい（お手入れ時の様子）
                </CardTitle>
              </ThemedCardHeader>
              <CardContent className="space-y-3">
                {bodyParts.map((part) => (
                  <div key={part.key} className="flex items-center justify-between p-3 rounded-lg" style={{ backgroundColor: 'rgb(248, 250, 252)' }}>
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
            </ThemedCard>

            <ThemedCard>
              <ThemedCardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" style={{ color: currentTheme.primary[600] }} />
                  お別れの時の様子
                </CardTitle>
              </ThemedCardHeader>
              <CardContent>
                <div className="p-4 rounded-lg" style={{ backgroundColor: 'rgb(248, 250, 252)' }}>
                  <p className={`font-medium ${getSeparationAnxietyColor(contactBookData.separationAnxiety)}`}>
                    {getSeparationAnxietyText(contactBookData.separationAnxiety)}
                  </p>
                </div>
              </CardContent>
            </ThemedCard>
          </TabsContent>

          <TabsContent value="behavior" className="px-4 space-y-4">
            <ThemedCard>
              <ThemedCardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5" style={{ color: currentTheme.primary[600] }} />
                  元気度・活発さ
                </CardTitle>
              </ThemedCardHeader>
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
            </ThemedCard>

            <ThemedCard>
              <ThemedCardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" style={{ color: currentTheme.primary[600] }} />
                  お友達への挨拶の仕方
                </CardTitle>
              </ThemedCardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {contactBookData.greetingStyle.map((style) => (
                    <Badge key={style} variant="secondary">
                      {greetingLabels[style]}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </ThemedCard>

            <ThemedCard>
              <ThemedCardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" style={{ color: currentTheme.primary[600] }} />
                  興奮時の行動
                </CardTitle>
              </ThemedCardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {contactBookData.excitedBehaviors.map((behavior) => (
                    <Badge key={behavior} variant="outline" className="border-orange-200" style={{ color: 'rgb(234, 88, 12)' }}>
                      {behaviorLabels[behavior]}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </ThemedCard>

            <ThemedCard>
              <ThemedCardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="w-5 h-5" style={{ color: currentTheme.primary[600] }} />
                  効果的な落ち着かせ方
                </CardTitle>
              </ThemedCardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {contactBookData.cooldownMethods.map((method) => (
                    <Badge key={method} variant="outline" className="border-green-200" style={{ color: 'rgb(34, 197, 94)' }}>
                      {cooldownLabels[method]}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </ThemedCard>
          </TabsContent>

          <TabsContent value="records" className="px-4 space-y-4">
            <ThemedCard>
              <ThemedCardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="w-5 h-5" style={{ color: currentTheme.primary[600] }} />
                  お友達との相性
                </CardTitle>
              </ThemedCardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2" style={{ color: 'rgb(34, 197, 94)' }}>好きなお友達のタイプ</h4>
                  <div className="flex flex-wrap gap-2">
                    {contactBookData.preferredDogTypes.map((type) => (
                      <Badge key={type} variant="outline" className="border-green-200" style={{ color: 'rgb(34, 197, 94)' }}>
                        {dogTypeLabels[type]}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2" style={{ color: 'rgb(234, 88, 12)' }}>苦手なお友達のタイプ</h4>
                  <div className="flex flex-wrap gap-2">
                    {contactBookData.difficultDogTypes.map((type) => (
                      <Badge key={type} variant="outline" className="border-orange-200" style={{ color: 'rgb(234, 88, 12)' }}>
                        {dogTypeLabels[type]}
                      </Badge>
                    ))}
                  </div>
                </div>
                {contactBookData.pairingNotes && (
                  <div>
                    <h4 className="font-medium mb-2">園内でのお友達関係</h4>
                    <div className="p-3 rounded-lg" style={{ backgroundColor: 'rgb(224, 242, 254)' }}>
                      <p className="text-sm" style={{ color: 'rgb(0, 50, 115)' }}>{contactBookData.pairingNotes}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </ThemedCard>
          </TabsContent>
        </Tabs>
      </div>
    </div>
    <BottomNavigation />
    </>
  )
}
