"use client"

import { useMemo, useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Calendar, Footprints, Timer, MapPin, Info, CheckCircle2, Sparkles, BadgeInfo } from "lucide-react"
import { ThemedCard, ThemedCardHeader, CardContent, CardTitle } from "@/components/themed-card"
import { ThemedButton } from "@/components/themed-button"
import { useTheme } from "@/contexts/theme-context"
import { createWalk, currentUser, seedWalks, type WalkLevel, type WalkType } from "@/lib/walks-store"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

export default function NewWalkPage() {
  const router = useRouter()
  const { currentTheme } = useTheme()
  const me = currentUser()

  useEffect(() => {
    seedWalks()
  }, [])

  const [title, setTitle] = useState("")
  const [date, setDate] = useState(new Date(Date.now() + 24 * 3600 * 1000).toISOString().split("T")[0])
  const [time, setTime] = useState("09:00")
  const [distanceKm, setDistanceKm] = useState(2)
  const [durationMin, setDurationMin] = useState(60)
  const [meetingName, setMeetingName] = useState("FC今治 里山ドッグラン")
  const [route, setRoute] = useState("")
  const [capacity, setCapacity] = useState(10)
  const [conditions, setConditions] = useState("犬同士の距離を確保")
  const [notes, setNotes] = useState("給水・排泄マナーにご協力ください")
  const [level, setLevel] = useState<WalkLevel>("ゆるめ")

  // 種別と料金
  const canOfficial = me.role === "official" || me.role === "trainer" || me.role === "admin"
  const [type, setType] = useState<WalkType>(canOfficial ? "community" : "community")
  const [paid, setPaid] = useState(false)
  const [price, setPrice] = useState<number>(1000)

  // スポンサー情報
  const [sponsorName, setSponsorName] = useState("")
  const [sponsorGift, setSponsorGift] = useState("")

  useEffect(() => {
    // ルール適用: 一般ユーザーは community 固定
    if (!canOfficial) {
      setType("community")
      setPaid(false)
    } else {
      // typeに応じて料金UIを調整
      if (type === "community" || type === "sponsor") {
        setPaid(false)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type, canOfficial])

  const canPublish =
    title.trim().length > 0 &&
    date &&
    time &&
    capacity > 0 &&
    durationMin > 0 &&
    distanceKm > 0 &&
    (type !== "sponsor" || sponsorName.trim().length > 0)

  const pace = useMemo(() => {
    if (!distanceKm || !durationMin) return "-"
    const perKm = durationMin / distanceKm
    const mm = Math.floor(perKm)
    const ss = Math.round((perKm - mm) * 60)
    return `${mm}:${String(ss).padStart(2, "0")} / km`
  }, [distanceKm, durationMin])

  const aiDraft = () => {
    // 将来的にAI SDKで自動下書きに置換可能
    // 例: generateText({...}) の利用で説明文サジェストを生成 [AI SDKで後日対応]
    if (!notes || notes.trim().length < 10) {
      setNotes("安全第一で、途中に給水・日陰休憩をとります。ノーリード不可、拾い食いにご注意ください。")
    }
    alert("AI下書きを挿入しました（ダミー）")
  }

  const publish = async () => {
    if (!canPublish) {
      alert("必要項目を入力してください")
      return
    }
    const walk = createWalk({
      type,
      title,
      date,
      time,
      distanceKm,
      durationMin,
      capacity,
      conditions,
      notes,
      paid: canOfficial && type === "official" ? paid : false,
      price: canOfficial && type === "official" && paid ? price : undefined,
      meeting: { name: meetingName },
      route: route.trim(),
      level,
      host: { id: me.id, name: me.name, role: me.role },
      status: "published",
      sponsor: type === "sponsor" ? { name: sponsorName.trim(), gift: sponsorGift.trim() || undefined } : undefined,
    })
    router.push(`/walks/${walk.id}`)
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
          <h1 className="text-lg font-semibold text-gray-800">WalkMeetup を企画</h1>
          <p className="text-xs text-gray-600">
            現実的な運用: ユーザー主催=無料、公式/トレーナー主催のみ有料可。スポンサー型は無料で試供品配布。
          </p>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-6 space-y-6 pb-28">
        <ThemedCard>
          <ThemedCardHeader>
            <CardTitle className="text-base">種別</CardTitle>
          </ThemedCardHeader>
          <CardContent>
            <div className="space-y-3">
              <RadioGroup
                value={type}
                onValueChange={(v) => setType(v as WalkType)}
                className="grid grid-cols-1 sm:grid-cols-3 gap-2"
              >
                <div className="flex items-center space-x-2 rounded-md border px-3 py-2">
                  <RadioGroupItem id="t-community" value="community" />
                  <Label htmlFor="t-community" className="text-sm">
                    コミュニティ（無料）
                  </Label>
                </div>
                <div
                  className={`flex items-center space-x-2 rounded-md border px-3 py-2 ${
                    !canOfficial ? "opacity-50" : ""
                  }`}
                >
                  <RadioGroupItem id="t-official" value="official" disabled={!canOfficial} />
                  <Label htmlFor="t-official" className="text-sm">
                    公式/トレーナー（有料可）
                  </Label>
                </div>
                <div
                  className={`flex items-center space-x-2 rounded-md border px-3 py-2 ${
                    !canOfficial ? "opacity-50" : ""
                  }`}
                >
                  <RadioGroupItem id="t-sponsor" value="sponsor" disabled={!canOfficial} />
                  <Label htmlFor="t-sponsor" className="text-sm">
                    スポンサー（無料）
                  </Label>
                </div>
              </RadioGroup>

              <div className="rounded-md bg-amber-50 border border-amber-200 p-3 text-xs text-amber-800 flex gap-2">
                <BadgeInfo className="w-4 h-4 shrink-0" />
                <div>
                  MVPルール:
                  一般ユーザーは無料のみ。天候中止時は（将来）自動返金。P2P決済は当面非対応で運営経由に一本化。
                </div>
              </div>
            </div>
          </CardContent>
        </ThemedCard>

        <ThemedCard>
          <ThemedCardHeader>
            <CardTitle className="text-base">基本情報</CardTitle>
          </ThemedCardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <Label className="block text-xs text-gray-600 mb-1">タイトル</Label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="例）合同お散歩会（ウォームアップ）"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="block text-xs text-gray-600 mb-1">
                    <Calendar className="inline w-3 h-3 mr-1" />
                    日付
                  </Label>
                  <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
                </div>
                <div>
                  <Label className="block text-xs text-gray-600 mb-1">時間</Label>
                  <Input type="time" value={time} onChange={(e) => setTime(e.target.value)} />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <Label className="block text-xs text-gray-600 mb-1">
                    <Footprints className="inline w-3 h-3 mr-1" />
                    距離(km)
                  </Label>
                  <Input
                    type="number"
                    min={0.5}
                    step={0.5}
                    value={distanceKm}
                    onChange={(e) => setDistanceKm(Number.parseFloat(e.target.value))}
                  />
                </div>
                <div>
                  <Label className="block text-xs text-gray-600 mb-1">
                    <Timer className="inline w-3 h-3 mr-1" />
                    所要(分)
                  </Label>
                  <Input
                    type="number"
                    min={15}
                    step={5}
                    value={durationMin}
                    onChange={(e) => setDurationMin(Number.parseInt(e.target.value))}
                  />
                </div>
                <div>
                  <Label className="block text-xs text-gray-600 mb-1">レベル</Label>
                  <select
                    value={level}
                    onChange={(e) => setLevel(e.target.value as WalkLevel)}
                    className="w-full rounded border px-3 py-2 text-sm"
                  >
                    <option>ゆるめ</option>
                    <option>ふつう</option>
                    <option>チャレンジ</option>
                  </select>
                </div>
              </div>
              <div>
                <Label className="block text-xs text-gray-600 mb-1">
                  <MapPin className="inline w-3 h-3 mr-1" />
                  集合場所
                </Label>
                <Input
                  value={meetingName}
                  onChange={(e) => setMeetingName(e.target.value)}
                  placeholder="例）○○公園 東口"
                />
              </div>
              <div>
                <Label className="block text-xs text-gray-600 mb-1">ルート（任意）</Label>
                <Textarea
                  value={route}
                  onChange={(e) => setRoute(e.target.value)}
                  rows={3}
                  placeholder="例）東口→川沿い→広場（折り返し）"
                />
              </div>
            </div>
          </CardContent>
        </ThemedCard>

        <ThemedCard>
          <ThemedCardHeader>
            <CardTitle className="text-base">参加条件・注意事項</CardTitle>
          </ThemedCardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="block text-xs text-gray-600 mb-1">定員</Label>
                <Input
                  type="number"
                  min={1}
                  value={capacity}
                  onChange={(e) => setCapacity(Number.parseInt(e.target.value))}
                />
              </div>
              <div>
                <Label className="block text-xs text-gray-600 mb-1">料金</Label>
                {type === "official" && canOfficial ? (
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      className="rounded-md border px-3 py-2 text-xs"
                      onClick={() => setPaid(false)}
                      style={{
                        backgroundColor: !paid ? currentTheme.accent[500] : "white",
                        color: !paid ? "white" : "#374151",
                        borderColor: !paid ? currentTheme.accent[500] : "#e5e7eb",
                      }}
                    >
                      無料
                    </button>
                    <button
                      type="button"
                      className="rounded-md border px-3 py-2 text-xs"
                      onClick={() => setPaid(true)}
                      style={{
                        backgroundColor: paid ? currentTheme.accent[500] : "white",
                        color: paid ? "white" : "#374151",
                        borderColor: paid ? currentTheme.accent[500] : "#e5e7eb",
                      }}
                    >
                      有料
                    </button>
                  </div>
                ) : (
                  <div className="text-sm text-gray-700">無料（固定）</div>
                )}
                {type === "official" && canOfficial && paid && (
                  <div className="mt-2">
                    <Input
                      type="number"
                      min={500}
                      step={100}
                      value={price}
                      onChange={(e) => setPrice(Number.parseInt(e.target.value || "0"))}
                      placeholder="金額（円）"
                    />
                    <p className="mt-1 text-[11px] text-gray-500">
                      目安: ¥500–¥1,500（ゆる歩き・実費）、¥2,000–¥4,000（トレーナー指導付き）
                    </p>
                  </div>
                )}
              </div>
            </div>
            <div className="mt-3">
              <Label className="block text-xs text-gray-600 mb-1">参加条件</Label>
              <Input
                value={conditions}
                onChange={(e) => setConditions(e.target.value)}
                placeholder="例）小型犬のみ／距離確保"
              />
            </div>
            <div className="mt-3">
              <Label className="block text-xs text-gray-600 mb-1">
                <Info className="inline w-3 h-3 mr-1" />
                注意事項
              </Label>
              <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} />
              <button
                type="button"
                className="mt-2 text-xs text-purple-700 hover:underline inline-flex items-center gap-1"
                onClick={aiDraft}
              >
                <Sparkles className="w-3 h-3" />
                AIで下書き（ダミー）
              </button>
            </div>

            {type === "sponsor" && (
              <div className="mt-4 grid grid-cols-2 gap-3">
                <div>
                  <Label className="block text-xs text-gray-600 mb-1">スポンサー名</Label>
                  <Input value={sponsorName} onChange={(e) => setSponsorName(e.target.value)} placeholder="企業名" />
                </div>
                <div>
                  <Label className="block text-xs text-gray-600 mb-1">試供品・配布物（任意）</Label>
                  <Input
                    value={sponsorGift}
                    onChange={(e) => setSponsorGift(e.target.value)}
                    placeholder="例）おやつ"
                  />
                </div>
              </div>
            )}

            <div className="mt-3 rounded-md bg-gray-50 p-3 text-sm text-gray-700">推定ペース: {pace}</div>
          </CardContent>
        </ThemedCard>

        <div className="pb-24">
          <ThemedButton variant="primary" className="w-full py-3" onClick={publish} disabled={!canPublish}>
            <span className="flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4 mr-2" />
              公開する
            </span>
          </ThemedButton>
          <p className="mt-2 text-[11px] text-gray-500">
            有料は公式/トレーナー主催のみ。スポンサー型は無料で試供品配布を想定。
          </p>
        </div>
      </main>
    </div>
  )
}
