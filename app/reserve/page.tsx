"use client"

import { useMemo, useState } from "react"
import { CalendarDays, ChevronRight, CreditCard, CheckCircle2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Toaster } from "@/components/ui/toaster"
import { ToastProvider } from "@/components/ui/toast"
import { SlotPicker } from "@/components/slot-picker"
import BottomNavigation from "@/components/bottom-navigation"
import { motion } from "framer-motion"

const SLOTS = ["10:00-11:00", "12:00-13:00", "14:00-15:00"]

export default function ReservePage() {
  const [step, setStep] = useState<1 | 2>(1)
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [selectedSlot, setSelectedSlot] = useState<string | undefined>(undefined)
  const [agree, setAgree] = useState(false)
  const canNext = !!selectedDate && !!selectedSlot

  const week = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date()
      d.setDate(d.getDate() + i)
      const value = d.toISOString().split("T")[0]
      const label = `${d.getMonth() + 1}/${d.getDate()}`
      const dow = ["日", "月", "火", "水", "木", "金", "土"][d.getDay()]
      const isWeekend = d.getDay() === 0 || d.getDay() === 6
      return { value, label, dow, isWeekend }
    })
  }, [])

  const handlePay = () => {
    const el = document.createElement("div")
    el.textContent = "Stripeでの支払いフローを開始しました（ダミー）"
    el.className =
      "fixed left-1/2 top-4 -translate-x-1/2 rounded-md bg-brand-blue px-4 py-2 text-white shadow-md z-[60]"
    document.body.appendChild(el)
    setTimeout(() => el.remove(), 1800)
  }

  return (
    <ToastProvider>
      <Toaster />
      <div className="min-h-screen">
        <header className="border-b bg-white" style={{ borderColor: "var(--brand-sky)" }}>
          <div className="mx-auto max-w-[480px] px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CalendarDays className="h-5 w-5 text-ink-3" />
                <h1 className="text-lg font-semibold text-gray-800">予約（2ステップ）</h1>
              </div>
              <div className="text-xs text-ink-3">Step {step}/2</div>
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-[480px] px-4 py-6 space-y-6 pb-28">
          <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.12 }}>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">日付を選択</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {week.map((d) => {
                    const active = selectedDate === d.value
                    return (
                      <button
                        key={d.value}
                        onClick={() => setSelectedDate(d.value)}
                        className="flex w-16 flex-shrink-0 flex-col items-center rounded-lg p-2 text-center"
                        style={{
                          backgroundColor: active ? "var(--brand-blue)" : "var(--brand-sky)",
                          color: active ? "white" : d.isWeekend ? "#dc2626" : "var(--ink-2)",
                        }}
                      >
                        <span className="text-xs font-medium">{d.label}</span>
                        <span className="text-[10px]">{d.dow}</span>
                      </button>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.12 }}>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">時間帯を選択</CardTitle>
              </CardHeader>
              <CardContent>
                <SlotPicker slots={SLOTS} value={selectedSlot} onChange={setSelectedSlot} />
                <div className="mt-3 text-[11px] text-ink-3">
                  空き状況は仮表示です。次のステップで内容をご確認ください。
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {step === 2 && (
            <>
              <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.12 }}>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">選択内容の確認</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">日付</span>
                        <span className="text-sm font-medium">{selectedDate}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">時間帯</span>
                        <span className="text-sm font-medium">{selectedSlot}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">料金</span>
                        <span className="text-base font-bold text-brand-navy">¥3,500</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.12 }}>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">利用規約</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-start gap-2">
                      <Checkbox id="agree" checked={agree} onCheckedChange={(v) => setAgree(!!v)} />
                      <label htmlFor="agree" className="text-sm text-gray-600">
                        利用規約とキャンセルポリシーに同意します
                      </label>
                    </div>
                    <div className="mt-2 text-[11px]" style={{ color: "var(--ink-3)" }}>
                      キャンセルは前日まで無料。詳細は規約をご確認ください。
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </>
          )}
        </main>

        {/* Bottom CTA */}
        <div className="fixed inset-x-0 bottom-0 z-40 border-t bg-white pb-[calc(env(safe-area-inset-bottom))]">
          <div className="mx-auto max-w-[480px] px-4 py-3">
            {step === 1 ? (
              <Button
                className="w-full"
                disabled={!canNext}
                onClick={() => setStep(2)}
                style={{
                  backgroundColor: "var(--brand-blue)",
                  color: "white",
                }}
              >
                次へ
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            ) : (
              <Button
                className="w-full"
                disabled={!agree}
                onClick={handlePay}
                style={{
                  backgroundColor: "var(--brand-blue)",
                  color: "white",
                }}
              >
                <CreditCard className="mr-2 h-4 w-4" />
                Stripeで支払う（ダミー）
              </Button>
            )}
            <div className="mt-2 flex items-center justify-center gap-2 text-[11px]" style={{ color: "var(--ink-3)" }}>
              <CheckCircle2 className="h-3.5 w-3.5" />
              安全な決済（テスト表示）
            </div>
          </div>
        </div>

        <BottomNavigation />
      </div>
    </ToastProvider>
  )
}
