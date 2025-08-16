"use client"

import { useEffect, useMemo, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import {
  Calendar,
  MapPin,
  Timer,
  Footprints,
  Users,
  QrCode,
  CreditCard,
  Share2,
  BadgeCheck,
  Gift,
  Tag,
} from "lucide-react"
import { ThemedCard, ThemedCardHeader, CardContent, CardTitle } from "@/components/themed-card"
import { ThemedButton } from "@/components/themed-button"
import { useTheme } from "@/contexts/theme-context"
import { getWalk, registerParticipant, type WalkEvent, currentUser } from "@/lib/walks-store"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { QRImage } from "@/components/qr-image"
import { createIcs } from "@/lib/ics"

type TicketPayload = {
  t: "walk-ticket"
  walkId: string
  participantId: string
  email: string
}

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

export default function WalkDetailPage() {
  const router = useRouter()
  const { id } = useParams<{ id: string }>()
  const { currentTheme } = useTheme()
  const [walk, setWalk] = useState<WalkEvent | undefined>(undefined)
  const [joined, setJoined] = useState(false)
  const [ticketOpen, setTicketOpen] = useState(false)
  const [ticket, setTicket] = useState<TicketPayload | null>(null)
  const [checkoutOpen, setCheckoutOpen] = useState(false)

  useEffect(() => {
    setWalk(getWalk(id))
  }, [id])

  useEffect(() => {
    if (!walk) return
    const me = currentUser()
    const exists = walk.participants.find((p) => p.email === me.email)
    setJoined(!!exists)
    if (exists) {
      setTicket({ t: "walk-ticket", walkId: walk.id, participantId: exists.id, email: exists.email })
    }
  }, [walk])

  const startISO = useMemo(() => {
    if (!walk) return ""
    const [y, m, d] = walk.date.split("-").map(Number)
    const [hh, mm] = walk.time.split(":").map(Number)
    const dt = new Date(y, (m || 1) - 1, d || 1, hh || 0, mm || 0)
    return new Date(dt.getTime() - dt.getTimezoneOffset() * 60000).toISOString() // local->ISO
  }, [walk])

  const handleJoin = () => {
    if (!walk) return
    if (walk.paid) {
      setCheckoutOpen(true)
      return
    }
    try {
      const updated = registerParticipant(walk.id)
      setWalk(updated)
    } catch (e: any) {
      alert(e.message || "参加できませんでした")
    }
  }

  const completePaidJoin = () => {
    if (!walk) return
    try {
      const updated = registerParticipant(walk.id, currentUser(), { paid: true })
      setWalk(updated)
      setCheckoutOpen(false)
    } catch (e: any) {
      alert(e.message || "参加できませんでした")
    }
  }

  const icsUrl = useMemo(() => {
    if (!walk || !startISO) return ""
    return createIcs({
      title: `WalkMeetup: ${walk.title}`,
      startISO,
      durationMin: walk.durationMin,
      location: walk.meeting.name,
      description: `${walk.distanceKm}km / ${walk.durationMin}分 / 定員${walk.capacity} / 条件:${walk.conditions}`,
    })
  }, [walk, startISO])

  const shareLink = typeof window !== "undefined" ? `${window.location.origin}/walks/${id}` : ""

  if (!walk) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-sm text-gray-600">読み込み中...</div>
      </div>
    )
  }

  return (
    <div
      className="min-h-screen"
      style={{
        background: `linear-gradient(to bottom, ${currentTheme.primary[50]}, white, ${currentTheme.primary[100]})`,
      }}
    >
      <header className="bg-white shadow-sm border-b" style={{ borderColor: currentTheme.primary[100] }}>
        <div className="max-w-md mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-lg font-semibold text-gray-800">WalkMeetup 詳細</h1>
          <ThemedButton size="sm" variant="outline" onClick={() => router.push(`/walks/${walk.id}/host`)}>
            主催者画面
          </ThemedButton>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-6 space-y-6 pb-24">
        <ThemedCard variant="primary">
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-lg font-semibold text-gray-800">{walk.title}</h2>
              <TypeBadge w={walk} />
              <Badge variant="outline" className="text-xs">
                {walk.level}
              </Badge>
            </div>

            {walk.type === "sponsor" && walk.sponsor?.name && (
              <div className="mt-1 text-xs text-pink-700 flex items-center gap-1">
                <Gift className="w-3 h-3" />
                協賛: {walk.sponsor.name}
                {walk.sponsor.gift ? (
                  <span className="ml-2 inline-flex items-center gap-1 text-pink-700">
                    <Tag className="w-3 h-3" />
                    配布物: {walk.sponsor.gift}
                  </span>
                ) : null}
              </div>
            )}

            <div className="mt-3 grid grid-cols-2 gap-2 text-sm text-gray-700">
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                {walk.date} {walk.time}
              </div>
              <div className="flex items-center">
                <Timer className="w-4 h-4 mr-2" />約{walk.durationMin}分
              </div>
              <div className="flex items-center">
                <Footprints className="w-4 h-4 mr-2" />
                {walk.distanceKm}km
              </div>
              <div className="flex items-center">
                <MapPin className="w-4 h-4 mr-2" />
                {walk.meeting.name}
              </div>
            </div>

            {walk.route && (
              <div className="mt-3 rounded-md bg-white p-3 text-sm shadow-sm">
                <div className="font-medium text-gray-800 mb-1">ルート</div>
                <p className="text-gray-600">{walk.route}</p>
              </div>
            )}

            <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-gray-600">
              <div>参加条件: {walk.conditions}</div>
              <div>定員: {walk.capacity}名</div>
              <div className="col-span-2">注意事項: {walk.notes}</div>
            </div>
          </CardContent>
        </ThemedCard>

        <ThemedCard>
          <ThemedCardHeader>
            <CardTitle className="text-base">参加</CardTitle>
          </ThemedCardHeader>
          <CardContent>
            {!walk.participants.some((p) => p.email === currentUser().email) ? (
              <>
                <ThemedButton variant="primary" className="w-full py-3" onClick={handleJoin}>
                  <Users className="w-4 h-4 mr-2" />
                  {walk.paid ? (
                    <>
                      参加する（{walk.price?.toLocaleString()}円）
                      <CreditCard className="w-4 h-4 ml-2" />
                    </>
                  ) : (
                    "参加する（無料）"
                  )}
                </ThemedButton>
                <p className="mt-2 text-[11px] text-gray-500">
                  参加確定後、QRチケットが表示されます。前日にリマインドします。
                </p>
              </>
            ) : (
              <>
                <div className="rounded-md bg-gray-50 p-3 text-sm text-gray-700">
                  参加が確定しました。チェックイン時にQRをご提示ください。
                </div>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  <ThemedButton variant="outline" onClick={() => setTicketOpen(true)} className="w-full">
                    <QrCode className="w-4 h-4 mr-2" />
                    参加QRを表示
                  </ThemedButton>
                  {icsUrl && (
                    <a href={icsUrl} download="walk.ics" className="w-full">
                      <ThemedButton variant="outline" className="w-full">
                        カレンダー登録
                      </ThemedButton>
                    </a>
                  )}
                </div>
              </>
            )}

            <div className="mt-3 flex items-center justify-between">
              <span className="text-xs text-gray-500">
                参加者 {walk.participants.length}名 / {walk.capacity}名
              </span>
              <button
                onClick={async () => {
                  if (navigator.share) {
                    try {
                      await navigator.share({ title: walk.title, text: "WalkMeetupに参加しませんか？", url: shareLink })
                    } catch {}
                  } else {
                    await navigator.clipboard.writeText(shareLink)
                    alert("リンクをコピーしました")
                  }
                }}
                className="text-xs flex items-center gap-1 text-gray-600"
              >
                <Share2 className="w-3 h-3" /> 共有
              </button>
            </div>
          </CardContent>
        </ThemedCard>
      </main>

      {/* Checkout simulation */}
      <Dialog open={checkoutOpen} onOpenChange={setCheckoutOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Stripe Checkout（テスト）</DialogTitle>
            <DialogDescription className="text-xs text-gray-500">
              決済テストを行います。完了すると参加が確定します。
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div className="rounded-md bg-gray-50 p-3 text-sm">金額: {walk?.price?.toLocaleString()}円</div>
            <ThemedButton variant="primary" className="w-full" onClick={completePaidJoin}>
              決済を完了する（ダミー）
            </ThemedButton>
          </div>
        </DialogContent>
      </Dialog>

      {/* Ticket QR */}
      <Dialog open={ticketOpen} onOpenChange={setTicketOpen}>
        <DialogContent className="sm:max-w-[360px]">
          <DialogHeader>
            <DialogTitle>参加QR</DialogTitle>
            <DialogDescription className="text-xs text-gray-500">当日、主催者に提示してください</DialogDescription>
          </DialogHeader>
          {ticket && (
            <div className="flex flex-col items-center gap-2">
              <QRImage text={btoa(JSON.stringify(ticket))} size={220} alt="参加QR" />
              <div className="text-sm font-medium">{currentUser().name}</div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
