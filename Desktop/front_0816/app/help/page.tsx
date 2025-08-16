"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { PageHeader } from "@/components/page-header"
import { Search, ChevronDown, ChevronUp, HelpCircle, Phone, Mail } from "lucide-react"
import { useTheme } from "@/contexts/theme-context"

interface FAQ {
  id: string
  question: string
  answer: string
  category: string
}

const faqs: FAQ[] = [
  {
    id: "1",
    question: "予約をキャンセルしたい場合はどうすればよいですか？",
    answer:
      "予約のキャンセルは、マイページの「予約履歴」から行えます。キャンセル料については、予約日の24時間前までは無料、それ以降は50%のキャンセル料が発生します。",
    category: "予約・キャンセル",
  },
  {
    id: "2",
    question: "愛犬の健康状態に変化があった場合は？",
    answer:
      "愛犬の健康状態に変化がある場合は、必ず事前にご連絡ください。症状によっては、お預かりをお断りする場合があります。また、お預かり中に体調不良が発生した場合は、すぐにご連絡いたします。",
    category: "健康・安全",
  },
  {
    id: "3",
    question: "初回利用時に必要な持ち物は？",
    answer:
      "初回利用時には、ワクチン接種証明書、狂犬病予防接種証明書、健康診断書（3ヶ月以内）をお持ちください。また、普段使用しているフードやおやつ、お気に入りのおもちゃなどもお持ちいただけます。",
    category: "初回利用",
  },
  {
    id: "4",
    question: "料金の支払い方法は？",
    answer:
      "お支払いは、クレジットカード、デビットカード、電子マネーに対応しています。月額プランをご利用の場合は、毎月自動で決済されます。",
    category: "料金・支払い",
  },
]

export default function HelpPage() {
  const { currentTheme } = useTheme()
  const [searchQuery, setSearchQuery] = useState("")
  const [openItems, setOpenItems] = useState<string[]>([])

  const filteredFAQs = faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.category.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const toggleItem = (id: string) => {
    setOpenItems((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]))
  }

  const categories = Array.from(new Set(faqs.map((faq) => faq.category)))

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="max-w-md mx-auto bg-white">
        <PageHeader title="ヘルプ・FAQ" subtitle="よくある質問と回答" showBackButton />

        <div className="p-4 space-y-6">
          {/* 検索 */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="質問を検索..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* FAQ一覧 */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">よくある質問</h2>
            {filteredFAQs.length > 0 ? (
              <div className="space-y-3">
                {filteredFAQs.map((faq) => (
                  <Card key={faq.id}>
                    <Collapsible open={openItems.includes(faq.id)} onOpenChange={() => toggleItem(faq.id)}>
                      <CollapsibleTrigger asChild>
                        <CardHeader className="cursor-pointer hover:bg-gray-50 transition-colors">
                          <div className="flex items-center justify-between">
                            <div className="flex items-start gap-3 text-left">
                              <HelpCircle
                                className="w-5 h-5 mt-0.5 flex-shrink-0"
                                style={{ color: currentTheme.primary[600] }}
                              />
                              <div>
                                <CardTitle className="text-sm font-medium">{faq.question}</CardTitle>
                                <p className="text-xs text-gray-500 mt-1">{faq.category}</p>
                              </div>
                            </div>
                            {openItems.includes(faq.id) ? (
                              <ChevronUp className="w-4 h-4 text-gray-400" />
                            ) : (
                              <ChevronDown className="w-4 h-4 text-gray-400" />
                            )}
                          </div>
                        </CardHeader>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <CardContent className="pt-0">
                          <p className="text-sm text-gray-700 leading-relaxed">{faq.answer}</p>
                        </CardContent>
                      </CollapsibleContent>
                    </Collapsible>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="text-center py-8">
                  <HelpCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">該当する質問が見つかりませんでした</p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* お問い合わせ */}
          <Card>
            <CardHeader>
              <CardTitle>お困りの場合は</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-gray-600">上記で解決しない場合は、お気軽にお問い合わせください。</p>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <Phone className="w-4 h-4 mr-2" />
                  電話でお問い合わせ
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <Mail className="w-4 h-4 mr-2" />
                  メールでお問い合わせ
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
