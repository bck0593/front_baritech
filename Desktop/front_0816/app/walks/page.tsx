"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Calendar, MapPin, Timer, Footprints, Plus, Filter, BadgeCheck, Gift } from "lucide-react"
import { ThemedCard, ThemedCardHeader, CardContent, CardTitle } from "@/components/themed-card"
import { ThemedButton } from "@/components/themed-button"
import { Badge } from "@/components/ui/badge"
import { useTheme } from "@/contexts/theme-context"
import { listWalks, seedWalks, type WalkEvent } from "@/lib/walks-store"

function TypeBadge({ w }: { w: WalkEvent }) {
  if (w.type === "official") {
    return (
      <Badge className="text-xs bg-emerald-600 text-white flex items-center gap-1">
        <BadgeCheck className="w-3 h-3" />
        公式
      </Badge>
    )
  }
  if (w.type === "sponsor") {
    return (
      <Badge className="text-xs bg-pink-600 text-white flex items-center gap-1">
        <Gift className="w-3 h-3" />
        スポンサー
      </Badge>
    )
  }
  return (
    <Badge variant="outline" className="text-xs">
      コミュニティ
    </Badge>
  )
}

export default function WalksListPage() {
  const router = useRouter()
  const search = useSearchParams()
  const { currentTheme } = useTheme()
  const [walks, setWalks] = useState<WalkEvent[]>([])
  const [date, setDate] = useState(search.get("date") || "")
  const [maxKm, setMaxKm] = useState<number>(Number.parseInt(search.get("km") || "10"))
  const [level, setLevel] = useState<string>(search.get("level") || "すべて")

  useEffect(() => {
    seedWalks()
    setWalks(listWalks())
  }, [])

  const filtered = useMemo(() => {
    return walks.filter((w) => {
      const okDate = !date || w.date === date
      const okKm = w.distanceKm <= maxKm
      const okLevel = level === "すべて" || w.level === (level as any)
      return okDate && okKm && okLevel && w.status === "published"
    })
  }, [walks, date, maxKm, level])

  return (
    <div className="max-w-md mx-auto">
      <div
        className="min-h-screen"
        style={{
          background: `linear-gradient(to bottom, ${currentTheme.primary[50]}, white, ${currentTheme.primary[100]})`,
        }}
      >
      <header className="bg-white shadow-sm border-b" style={{ borderColor: currentTheme.primary[100] }}>
        <div className="max-w-md mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Footprints className="w-5 h-5 text-ink-3" />
            <h1 className="text-lg font-semibold text-gray-800">WalkMeetup（合同お散歩会）</h1>
          </div>
          <ThemedButton size="sm" variant="primary" onClick={() => router.push("/walks/new")}>
            <Plus className="w-4 h-4 mr-1" />
            企画する
          </ThemedButton>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-6 space-y-6 pb-24">
        <ThemedCard>
          <ThemedCardHeader>
            <CardTitle className="text-base flex items-center">
              <Filter className="w-4 h-4 mr-2" />
              絞り込み
            </CardTitle>
          </ThemedCardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-600 mb-1">日付</label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full rounded border px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">距離（最大 {maxKm}km）</label>
                  <input
                    type="range"
                    min={1}
                    max={20}
                    value={maxKm}
                    onChange={(e) => setMaxKm(Number.parseInt(e.target.value))}
                    className="w-full"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                {["すべて", "ゆるめ", "ふつう", "チャレンジ"].map((lv) => {
                  const active = level === lv
                  return (
                    <button
                      key={lv}
                      onClick={() => setLevel(lv)}
                      className="rounded-md border px-3 py-1.5 text-xs"
                      style={{
                        backgroundColor: active ? currentTheme.accent[500] : "white",
                        color: active ? "white" : "#374151",
                        borderColor: active ? currentTheme.accent[500] : "#e5e7eb",
                      }}
                    >
                      {lv}
                    </button>
                  )
                })}
              </div>
            </div>
          </CardContent>
        </ThemedCard>

        <div className="space-y-3">
          {filtered.length === 0 ? (
            <ThemedCard>
              <CardContent className="pt-6 pb-6 text-center text-sm text-gray-600">
                該当するWalkMeetupがありません
              </CardContent>
            </ThemedCard>
          ) : (
            filtered.map((w) => (
              <ThemedCard
                key={w.id}
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => router.push(`/walks/${w.id}`)}
              >
                <CardContent className="pt-4">
                  <div className="flex items-start gap-3">
                    <div className="w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center text-2xl">🚶</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-sm text-gray-800">{w.title}</h3>
                        <div className="flex items-center gap-2">
                          <TypeBadge w={w} />
                          <Badge variant="outline" className="text-xs">
                            {w.level}
                          </Badge>
                        </div>
                      </div>
                      <div className="mt-1 grid grid-cols-2 gap-2 text-xs text-gray-600">
                        <div className="flex items-center">
                          <Calendar className="w-3 h-3 mr-1" />
                          {w.date} {w.time}
                        </div>
                        <div className="flex items-center">
                          <Timer className="w-3 h-3 mr-1" />約{w.durationMin}分
                        </div>
                        <div className="flex items-center">
                          <Footprints className="w-3 h-3 mr-1" />
                          {w.distanceKm}km
                        </div>
                        <div className="flex items-center">
                          <MapPin className="w-3 h-3 mr-1" />
                          {w.meeting.name}
                        </div>
                      </div>
                      <div className="mt-2 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="text-xs bg-gray-100">
                            定員 {w.capacity}名
                          </Badge>
                          {w.paid ? (
                            <Badge
                              className="text-xs"
                              style={{ backgroundColor: currentTheme.accent[500], color: "white" }}
                            >
                              有料
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="text-xs">
                              無料
                            </Badge>
                          )}
                          {w.type === "sponsor" && w.sponsor?.name && (
                            <Badge variant="outline" className="text-[11px]">
                              協賛: {w.sponsor.name}
                            </Badge>
                          )}
                        </div>
                        <span className="text-[11px] text-gray-500">主催: {w.host.name}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </ThemedCard>
            ))
          )}
        </div>
      </main>
    </div>
    </div>
  )
}
