"use client"

import { useMemo, useState } from "react"
import { Calendar, Filter, Share2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { DiaryCard } from "@/components/diary-card"
import BottomTab from "@/components/bottom-tab"
import { motion } from "framer-motion"

const DIARIES = [
  { time: "12:05", title: "ごはん", note: "食べむら無し。元気。", img: "/images/meal.png", type: "ごはん" },
  {
    time: "13:20",
    title: "おさんぽ",
    note: "他犬を遠巻きに観察。落ち着き◎",
    img: "/images/walk.png",
    type: "おさんぽ",
  },
  { time: "15:00", title: "排泄", note: "固さ良好。問題なし。", img: "/images/health.png", type: "排泄" },
]

const TYPES = ["すべて", "ごはん", "おさんぽ", "排泄", "ケア"]

export default function DiaryStreamPage() {
  const [date, setDate] = useState<string>(() => new Date().toISOString().split("T")[0])
  const [type, setType] = useState<string>("すべて")
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState<(typeof DIARIES)[number] | null>(null)

  const list = useMemo(() => {
    return DIARIES.filter((d) => (type === "すべて" ? true : d.type === type))
  }, [type])

  const openDialog = (item: (typeof DIARIES)[number]) => {
    setSelected(item)
    setOpen(true)
  }

  const copyShare = async () => {
    const url = "https://example.com/share/abc123"
    try {
      await navigator.clipboard.writeText(url)
      // quick non-intrusive toast
      const el = document.createElement("div")
      el.textContent = "共有リンクをコピーしました"
      el.className =
        "fixed left-1/2 top-4 -translate-x-1/2 rounded-md bg-brand-blue px-4 py-2 text-white shadow-md z-[60]"
      document.body.appendChild(el)
      setTimeout(() => el.remove(), 1600)
    } catch {
      alert("コピーに失敗しました")
    }
  }

  return (
    <div className="min-h-screen">
      <header className="border-b bg-white" style={{ borderColor: "var(--brand-sky)" }}>
        <div className="mx-auto max-w-[480px] px-4 py-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-ink-3" />
            <h1 className="text-lg font-semibold text-gray-800">園日記</h1>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[480px] px-4 py-6 space-y-6 pb-28">
        {/* Filters (reuse spacing/font scale) */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">フィルタ</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="h-9" />
              <div className="flex gap-2 overflow-x-auto">
                {TYPES.map((t) => {
                  const active = type === t
                  return (
                    <Button
                      key={t}
                      size="sm"
                      variant={active ? "default" : "outline"}
                      className="text-xs"
                      style={
                        active
                          ? { backgroundColor: "var(--brand-blue)", color: "white" }
                          : { borderColor: "var(--brand-sky)", color: "var(--ink-2)" }
                      }
                      onClick={() => setType(t)}
                    >
                      <Filter className="mr-1 h-3.5 w-3.5" />
                      {t}
                    </Button>
                  )
                })}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* List */}
        <div className="space-y-3">
          {list.length === 0 ? (
            <Card>
              <CardContent className="pt-6 pb-6 text-center">
                <Calendar className="mx-auto mb-3 h-12 w-12 text-gray-400" />
                <p className="text-sm text-gray-600">該当する記録がありません</p>
                <p className="text-xs text-gray-500">日付やタイプを変更して再度お試しください</p>
              </CardContent>
            </Card>
          ) : (
            list.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.12 }}
              >
                <DiaryCard {...item} onClick={() => openDialog(item)} />
              </motion.div>
            ))
          )}
        </div>
      </main>

      {/* Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[425px]">
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle className="text-brand-navy">{selected.title}</DialogTitle>
                <DialogDescription className="text-xs text-gray-500">
                  {date} • {selected.time}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-3">
                <div className="aspect-video w-full overflow-hidden rounded-lg bg-gray-100">
                  <img
                    src={selected.img || "/placeholder.svg"}
                    alt={selected.title}
                    className="h-full w-full object-cover"
                  />
                </div>
                <p className="text-sm text-gray-700">{selected.note}</p>
                <Button
                  onClick={copyShare}
                  className="w-full"
                  style={{ backgroundColor: "var(--brand-blue)", color: "white" }}
                >
                  <Share2 className="mr-2 h-4 w-4" />
                  共有リンクをコピー
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      <BottomTab />
    </div>
  )
}
