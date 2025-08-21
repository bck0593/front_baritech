"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PageHeader } from "@/components/page-header"
import BottomNavigation from "@/components/bottom-navigation"
import { Heart, Activity, Calendar, Plus, FileText, AlertTriangle } from "lucide-react"
import { useTheme } from "@/contexts/theme-context"

export default function HealthPage() {
  const router = useRouter()
  const { currentTheme } = useTheme()
  const [healthRecords, setHealthRecords] = useState([
    {
      id: "1",
      type: "予防接種",
      date: "2024年1月10日",
      description: "狂犬病ワクチン接種",
      veterinarian: "田中動物病院",
      status: "完了"
    },
    {
      id: "2", 
      type: "健康診断",
      date: "2023年12月15日",
      description: "年次健康診断、血液検査、尿検査",
      veterinarian: "田中動物病院",
      status: "異常なし"
    },
    {
      id: "3",
      type: "治療",
      date: "2023年11月20日", 
      description: "皮膚炎の治療",
      veterinarian: "田中動物病院",
      status: "治癒"
    }
  ])

  const upcomingEvents = [
    {
      id: "1",
      type: "予防接種",
      date: "2024年2月15日",
      description: "混合ワクチン接種予定"
    },
    {
      id: "2",
      type: "健康診断", 
      date: "2024年3月10日",
      description: "定期健康診断予定"
    }
  ]

  const handleAddRecord = () => {
    // 健康記録追加処理
    console.log("新しい健康記録を追加")
  }

  return (
    <>
      <div className="min-h-screen bg-gray-50 pb-20">
        <div className="max-w-md mx-auto bg-white">
          <PageHeader 
            title="健康管理" 
            subtitle="愛犬の健康記録とスケジュール" 
            showBackButton 
          />

          <div className="p-4 space-y-6">
            {/* 健康状態サマリー */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="w-5 h-5 text-red-500" />
                  健康状態
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">良好</div>
                    <div className="text-sm text-gray-600">総合評価</div>
                  </div>
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">3</div>
                    <div className="text-sm text-gray-600">記録数</div>
                  </div>
                </div>
                <div className="mt-4 p-3 rounded-lg" style={{ backgroundColor: 'rgb(224, 242, 254)' }}>
                  <div className="flex items-center gap-2" style={{ color: 'rgb(0, 50, 115)' }}>
                    <AlertTriangle className="w-4 h-4" />
                    <span className="text-sm font-medium">次回予定</span>
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    2024年2月15日 - 混合ワクチン接種
                  </div>
                </div>
              </CardContent>
            </Card>

            <Tabs defaultValue="records" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="records">健康記録</TabsTrigger>
                <TabsTrigger value="schedule">予定</TabsTrigger>
              </TabsList>

              {/* 健康記録タブ */}
              <TabsContent value="records" className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold">記録一覧</h3>
                  <Button size="sm" onClick={handleAddRecord}>
                    <Plus className="w-4 h-4 mr-1" />
                    追加
                  </Button>
                </div>

                {healthRecords.map((record) => (
                  <Card key={record.id}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{record.type}</Badge>
                          <span className="text-sm text-gray-500">{record.date}</span>
                        </div>
                        <Badge 
                          variant={record.status === "完了" ? "default" : "secondary"}
                        >
                          {record.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-700 mb-2">{record.description}</p>
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <FileText className="w-3 h-3" />
                        {record.veterinarian}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              {/* 予定タブ */}
              <TabsContent value="schedule" className="space-y-4">
                <h3 className="font-semibold">今後の予定</h3>
                
                {upcomingEvents.map((event) => (
                  <Card key={event.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Calendar className="w-4 h-4 text-blue-500" />
                        <Badge variant="outline">{event.type}</Badge>
                        <span className="text-sm text-gray-500">{event.date}</span>
                      </div>
                      <p className="text-sm text-gray-700">{event.description}</p>
                    </CardContent>
                  </Card>
                ))}

                {upcomingEvents.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    予定されている健康管理はありません
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
      <BottomNavigation />
    </>
  )
}
