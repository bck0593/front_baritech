"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { TriangleAlert, CheckCircle2, XCircle, CloudRain } from "lucide-react"
import { ThemedCard, ThemedCardHeader, CardContent, CardTitle } from "@/components/themed-card"
import { ThemedButton } from "@/components/themed-button"
import { useTheme } from "@/contexts/theme-context"
import { approveWalk, cancelWalk, listWalks, type WalkEvent } from "@/lib/walks-store"

export default function AdminWalksPage() {
  const { currentTheme } = useTheme()
  const [walks, setWalks] = useState<WalkEvent[]>([])

  const refresh = () => setWalks(listWalks())

  useEffect(() => {
    refresh()
  }, [])

  const pending = walks.filter((w) => w.status === "pending")
  const published = walks.filter((w) => w.status === "published")
  const cancelled = walks.filter((w) => w.status === "cancelled")

  const bulkCancel = () => {
    const ids = published.map((w) => w.id)
    ids.forEach((id) => cancelWalk(id, "荒天のため中止"))
    refresh()
    alert("荒天中止の一括通知（ダミー）を送信しました")
  }

  return (
    <div
      className="min-h-screen"
      style={{
        background: `linear-gradient(to bottom, ${currentTheme.primary[50]}, white, ${currentTheme.primary[100]})`,
      }}
    >
      <header className="bg-white shadow-sm border-b" style={{ borderColor: currentTheme.primary[100] }}>
        <div className="max-w-md mx-auto px-4 py-4 flex items-center gap-2">
          <TriangleAlert className="w-5 h-5 text-ink-3" />
          <h1 className="text-lg font-semibold text-gray-800">お散歩会 管理</h1>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-6 space-y-6 pb-20">
        <ThemedCard variant="accent">
          <ThemedCardHeader variant="accent">
            <CardTitle className="text-base">荒天中止</CardTitle>
          </ThemedCardHeader>
          <CardContent>
            <ThemedButton variant="primary" onClick={bulkCancel} className="w-full">
              <CloudRain className="w-4 h-4 mr-2" />
              公開中のイベントを一括中止（ダミー通知）
            </ThemedButton>
          </CardContent>
        </ThemedCard>

        <Section title="審査待ち" items={pending} empty="審査待ちはありません">
          {(w) => (
            <div className="flex items-center justify-between">
              <div className="text-sm">
                <div className="font-medium text-gray-800">{w.title}</div>
                <div className="text-xs text-gray-600">
                  {w.date} {w.time} • {w.distanceKm}km • {w.level}
                </div>
              </div>
              <div className="flex gap-2">
                <ThemedButton
                  variant="outline"
                  onClick={() => {
                    approveWalk(w.id)
                    refresh()
                  }}
                >
                  <CheckCircle2 className="w-4 h-4 mr-1" />
                  承認
                </ThemedButton>
                <ThemedButton
                  variant="outline"
                  onClick={() => {
                    cancelWalk(w.id, "不適切")
                    refresh()
                  }}
                >
                  <XCircle className="w-4 h-4 mr-1" />
                  却下
                </ThemedButton>
              </div>
            </div>
          )}
        </Section>

        <Section title="公開中" items={published} empty="公開中のイベントはありません">
          {(w) => (
            <div className="flex items-center justify-between">
              <div className="text-sm">
                <div className="font-medium text-gray-800">{w.title}</div>
                <div className="text-xs text-gray-600">
                  {w.date} {w.time} • {w.distanceKm}km • 参加 {w.participants.length}/{w.capacity}
                </div>
              </div>
              <ThemedButton
                variant="outline"
                onClick={() => {
                  cancelWalk(w.id, "中止")
                  refresh()
                }}
              >
                中止
              </ThemedButton>
            </div>
          )}
        </Section>

        <Section title="中止" items={cancelled} empty="中止のイベントはありません">
          {(w) => (
            <div className="text-sm">
              <div className="font-medium text-gray-800">{w.title}</div>
              <div className="text-xs text-gray-600">
                {w.date} {w.time} • {w.distanceKm}km
              </div>
            </div>
          )}
        </Section>
      </main>
    </div>
  )
}

function Section({
  title,
  items,
  empty,
  children,
}: {
  title: string
  items: WalkEvent[]
  empty: string
  children: (w: WalkEvent) => React.ReactNode
}) {
  return (
    <ThemedCard>
      <ThemedCardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
      </ThemedCardHeader>
      <CardContent>
        {items.length === 0 ? (
          <div className="text-sm text-gray-600">{empty}</div>
        ) : (
          <div className="space-y-2">
            {items.map((w) => (
              <div key={w.id} className="rounded-lg bg-gray-50 p-3">
                {children(w)}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </ThemedCard>
  )
}
