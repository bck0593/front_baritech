"use client"

import { AdminStatCard } from "@/components/admin-stat-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MiniAreaChart } from "@/components/mini-area-chart"
import { CalendarCheck2, CheckCircle2, Clock4, Activity } from "lucide-react"

const STATS = { bookings: 12, checkedIn: 8, openSlots: 5, utilization: "73%" }
const WEEK_SERIES = [
  { day: "Mon", val: 6 },
  { day: "Tue", val: 8 },
  { day: "Wed", val: 7 },
  { day: "Thu", val: 9 },
  { day: "Fri", val: 12 },
  { day: "Sat", val: 10 },
  { day: "Sun", val: 5 },
]

export default function AdminDashboardPage() {
  const timeline = [
    { t: "09:03", who: "ポチ", action: "チェックイン", badge: "注意なし" },
    { t: "10:15", who: "ココ", action: "チェックイン", badge: "初回" },
    { t: "12:05", who: "ポチ", action: "食事", badge: "快調" },
    { t: "17:10", who: "ポチ", action: "チェックアウト", badge: "OK" },
  ]

  return (
    <div className="min-h-screen">
      <header className="border-b bg-white" style={{ borderColor: "var(--brand-sky)" }}>
        <div className="mx-auto max-w-[480px] px-4 py-4">
          <h1 className="text-lg font-semibold text-gray-800">管理ダッシュボード</h1>
        </div>
      </header>

      <main className="mx-auto max-w-[480px] px-4 py-6 space-y-6 pb-10 md:max-w-3xl">
        {/* Stats */}
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <AdminStatCard label="予約数" value={`${STATS.bookings}`} icon={<CalendarCheck2 className="h-4 w-4" />} />
          <AdminStatCard label="入場済" value={`${STATS.checkedIn}`} icon={<CheckCircle2 className="h-4 w-4" />} />
          <AdminStatCard label="空き枠" value={`${STATS.openSlots}`} icon={<Clock4 className="h-4 w-4" />} />
          <AdminStatCard label="稼働率" value={STATS.utilization} icon={<Activity className="h-4 w-4" />} />
        </div>

        {/* Timeline */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">タイムライン</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {timeline.map((r, i) => (
              <div key={i} className="flex items-center justify-between rounded-lg bg-gray-50 p-3">
                <div className="text-xs text-gray-600">{r.t}</div>
                <div className="flex-1 px-3 text-sm text-gray-800">
                  {r.who} • {r.action}
                </div>
                <span
                  className="rounded-md px-2 py-0.5 text-[10px]"
                  style={{ backgroundColor: "var(--brand-sky)", color: "var(--brand-navy)" }}
                >
                  {r.badge}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Mini chart */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">週間トレンド</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center">
            <MiniAreaChart data={WEEK_SERIES} />
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
