"use client"

import { useEffect, useRef, useState } from "react"
import { useParams } from "next/navigation"
import { Camera, CheckCircle2, CircleSlash2 } from "lucide-react"
import { ThemedCard, ThemedCardHeader, CardContent, CardTitle } from "@/components/themed-card"
import { ThemedButton } from "@/components/themed-button"
import { useTheme } from "@/contexts/theme-context"
import { getWalk, setCheckIn, setCheckOut, type WalkEvent } from "@/lib/walks-store"

type TicketPayload = { t: "walk-ticket"; walkId: string; participantId: string; email: string }

export default function HostWalkPage() {
  const { currentTheme } = useTheme()
  const { id } = useParams<{ id: string }>()
  const [walk, setWalk] = useState<WalkEvent | undefined>(undefined)
  const [scanOpen, setScanOpen] = useState(false)
  const [error, setError] = useState<string>("")
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    setWalk(getWalk(id))
  }, [id])

  const refresh = () => setWalk(getWalk(id))

  async function startScan() {
    setError("")
    setScanOpen(true)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        await videoRef.current.play()
      }
      // Try BarcodeDetector if available
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const BD: any = (window as any).BarcodeDetector
      if (!BD) {
        setError("このブラウザはQRスキャンをサポートしていません。下の手入力をご利用ください。")
        return
      }
      const detector = new BD({ formats: ["qr_code"] })
      const canvas = document.createElement("canvas")
      const ctx = canvas.getContext("2d")

      const tick = async () => {
        if (!videoRef.current || !ctx) return
        canvas.width = videoRef.current.videoWidth
        canvas.height = videoRef.current.videoHeight
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height)
        const bitmap = await createImageBitmap(canvas)
        const codes = await detector.detect(bitmap)
        if (codes && codes[0]?.rawValue) {
          handleDecoded(codes[0].rawValue)
        } else if (scanOpen) {
          requestAnimationFrame(tick)
        }
      }
      requestAnimationFrame(tick)
    } catch (e) {
      setError("カメラにアクセスできませんでした")
    }
  }

  function handleDecoded(raw: string) {
    try {
      const payload = JSON.parse(atob(raw)) as TicketPayload
      if (payload.t !== "walk-ticket" || payload.walkId !== id) {
        setError("このイベントのQRではありません")
        return
      }
      setCheckIn(payload.walkId, payload.participantId, true)
      refresh()
      setError("")
      alert("チェックイン登録しました")
    } catch {
      setError("QRの読み取りに失敗しました")
    }
  }

  return (
    <div
      className="min-h-screen"
      style={{
        background: `linear-gradient(to bottom, ${currentTheme.primary[50]}, white, ${currentTheme.primary[100]})`,
      }}
    >
      <header className="bg-white shadow-sm border-b" style={{ borderColor: currentTheme.primary[100] }}>
        <div className="max-w-md mx-auto px-4 py-4">
          <h1 className="text-lg font-semibold text-gray-800">主催者ダッシュボード</h1>
          <p className="text-xs text-gray-600">QRチェックイン／参加者一覧</p>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-6 space-y-6 pb-20">
        <ThemedCard variant="accent">
          <ThemedCardHeader variant="accent">
            <CardTitle className="text-base">QRチェックイン</CardTitle>
          </ThemedCardHeader>
          <CardContent>
            {!scanOpen ? (
              <ThemedButton variant="primary" onClick={startScan} className="w-full">
                <Camera className="w-4 h-4 mr-2" />
                カメラでスキャン
              </ThemedButton>
            ) : (
              <div className="space-y-2">
                <video ref={videoRef} className="w-full rounded-lg bg-black" />
                {error && <div className="text-xs text-red-600">{error}</div>}
              </div>
            )}

            <div className="mt-3 text-xs text-gray-500">うまくいかない場合は、手動チェックインをご利用ください。</div>
          </CardContent>
        </ThemedCard>

        <ThemedCard>
          <ThemedCardHeader>
            <CardTitle className="text-base">参加者一覧</CardTitle>
          </ThemedCardHeader>
          <CardContent>
            {!walk ? (
              <div className="text-sm text-gray-600">読み込み中...</div>
            ) : walk.participants.length === 0 ? (
              <div className="text-sm text-gray-600">参加者はいません</div>
            ) : (
              <div className="space-y-2">
                {walk.participants.map((p) => (
                  <div key={p.id} className="flex items-center justify-between rounded-lg bg-gray-50 p-3">
                    <div className="min-w-0">
                      <div className="text-sm font-medium text-gray-800">{p.name}</div>
                      <div className="text-xs text-gray-500">{p.email}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-gray-500">{p.paid ? "支払い済" : "無料"}</span>
                      <button
                        className="rounded-md border px-2 py-1 text-xs"
                        onClick={() => {
                          setCheckIn(id, p.id, !p.checkedIn)
                          refresh()
                        }}
                        style={{
                          backgroundColor: p.checkedIn ? "var(--brand-sky)" : "white",
                        }}
                      >
                        <CheckCircle2 className="inline w-3 h-3 mr-1" />
                        IN
                      </button>
                      <button
                        className="rounded-md border px-2 py-1 text-xs"
                        onClick={() => {
                          setCheckOut(id, p.id, !p.checkedOut)
                          refresh()
                        }}
                      >
                        <CircleSlash2 className="inline w-3 h-3 mr-1" />
                        OUT
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </ThemedCard>

        <ThemedCard>
          <ThemedCardHeader>
            <CardTitle className="text-base">終了後のレポート</CardTitle>
          </ThemedCardHeader>
          <CardContent>
            <div className="space-y-2 text-sm text-gray-700">
              <p>写真アルバムの共有と、AI要約でレポート投稿ができます（将来のAI連携）。</p>
              <button
                className="rounded-md border px-3 py-2 text-xs"
                onClick={() =>
                  alert(
                    "AI要約はAI SDKのgenerateTextで実装可能です（APIキー設定後）。\n例: イベントの出来事や参加者の様子を3行で要約します。",
                  )
                }
              >
                AI要約のサンプルを見る
              </button>
              <p className="text-[11px] text-gray-500">
                実装時はAI SDKのgenerateTextを使用します（OpenAI等のモデル指定）[^1]
              </p>
            </div>
          </CardContent>
        </ThemedCard>
      </main>
    </div>
  )
}
