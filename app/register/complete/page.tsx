"use client"

import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, ArrowRight, Heart } from "lucide-react"

export default function RegisterCompletePage() {
  const router = useRouter()

  const handleGetStarted = () => {
    // 登録完了後、ホームページへ遷移
    router.push("/")
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-md mx-auto px-4">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">登録完了！</h1>
          <p className="text-gray-600">愛犬との素敵な時間をサポートします</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-center justify-center">
              <Heart className="w-5 h-5 text-red-500" />
              ようこそ、DogMATEsへ
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🐕</span>
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">登録が完了しました</h3>
              <p className="text-sm text-gray-600 mb-4">
                愛犬の情報が正常に登録されました。これで施設の予約やサービスをご利用いただけます。
              </p>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-800 mb-2">次にできること</h4>
                <ul className="space-y-2 text-sm text-blue-700">
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    近くの施設を検索・予約
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    愛犬の健康記録を確認
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    他の飼い主さんと交流
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    イベントに参加
                  </li>
                </ul>
              </div>

              <div className="p-4 bg-green-50 rounded-lg">
                <h4 className="font-medium text-green-800 mb-2">安心・安全への取り組み</h4>
                <p className="text-sm text-green-700">
                  登録いただいた愛犬の情報は、より良いケアを提供するために活用されます。
                  個人情報は厳重に管理し、第三者に提供することはありません。
                </p>
              </div>
            </div>

            <Button onClick={handleGetStarted} className="w-full bg-blue-600 hover:bg-blue-700 py-3">
              アプリを始める
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </CardContent>
        </Card>

        <div className="text-center mt-6">
          <p className="text-sm text-gray-600">
            ご不明な点がございましたら{" "}
            <button onClick={() => router.push("/help")} className="text-blue-600 hover:underline font-medium">
              ヘルプセンター
            </button>{" "}
            をご確認ください
          </p>
        </div>
      </div>
    </div>
  )
}
