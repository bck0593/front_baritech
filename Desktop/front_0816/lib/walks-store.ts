"use client"

export type WalkLevel = "ゆるめ" | "ふつう" | "チャレンジ"
export type WalkType = "community" | "official" | "sponsor"

export type UserRole = "user" | "official" | "trainer" | "admin"

export type WalkParticipant = {
  id: string
  name: string
  email: string
  joinedAt: number
  paid?: boolean
  checkedIn?: boolean
  checkedOut?: boolean
  // refund status could be tracked in the future
  refunded?: boolean
}

export type WalkEvent = {
  id: string
  type: WalkType
  title: string
  date: string // YYYY-MM-DD
  time: string // HH:mm
  distanceKm: number
  durationMin: number
  capacity: number
  conditions: string
  notes: string
  paid: boolean
  price?: number
  sponsor?: {
    name: string
    gift?: string
  }
  meeting: {
    name: string
    lat?: number
    lng?: number
  }
  route?: string // 任意のテキスト or URL
  level: WalkLevel
  host: {
    id: string
    name: string
    role?: UserRole
  }
  status: "pending" | "published" | "cancelled"
  participants: WalkParticipant[]
  createdAt: number
}

const STORAGE_KEY = "dogmates-walks"

function safeParse<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback
  try {
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

function saveAll(list: WalkEvent[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
}

function uid(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 8)}-${Date.now().toString(36)}`
}

export function currentUser() {
  // 仮のログインユーザー
  // NOTE: MVPでは一般ユーザーをデフォルト。必要に応じて role を "official" に変えると有料イベントの作成が可能になります。
  return { id: "user-1", name: "田中 太郎", email: "tanaka@example.com", role: "user" as UserRole }
}

export function listWalks(): WalkEvent[] {
  const list = safeParse<WalkEvent[]>(localStorage.getItem(STORAGE_KEY), [])
  return list.sort((a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time))
}

export function getWalk(id: string): WalkEvent | undefined {
  return listWalks().find((w) => w.id === id)
}

export function seedWalks() {
  const existing = listWalks()
  if (existing.length > 0) return
  const seed: WalkEvent[] = [
    {
      id: uid("walk"),
      type: "community",
      title: "コミュニティ朝さんぽ（初参加歓迎）",
      date: new Date(Date.now() + 3 * 24 * 3600 * 1000).toISOString().split("T")[0],
      time: "09:30",
      distanceKm: 2,
      durationMin: 60,
      capacity: 12,
      conditions: "小型〜中型／犬同士の距離確保を優先",
      notes: "給水休憩あり。ハーネス推奨。",
      paid: false,
      meeting: { name: "FC今治 里山ドッグラン（外周）", lat: 34.065, lng: 132.997 },
      route: "園外周→並木道→広場（解散）",
      level: "ゆるめ",
      host: { id: "host-comm-1", name: "コミュ主催 A", role: "user" },
      status: "published",
      participants: [],
      createdAt: Date.now(),
    },
    {
      id: uid("walk"),
      type: "official",
      title: "公式・トレーナー同行ウォーク（基礎練）",
      date: new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString().split("T")[0],
      time: "07:00",
      distanceKm: 4,
      durationMin: 90,
      capacity: 15,
      conditions: "全犬種OK／中級",
      notes: "日差し対策・給水ご持参ください。保険・備品費含む。",
      paid: true,
      price: 2000,
      meeting: { name: "サンライズ糸山 駐車場", lat: 34.103, lng: 133.001 },
      route: "駐車場→海沿い遊歩道→展望台→折り返し",
      level: "ふつう",
      host: { id: "host-off-1", name: "スタッフB", role: "official" },
      status: "published",
      participants: [],
      createdAt: Date.now(),
    },
    {
      id: uid("walk"),
      type: "sponsor",
      title: "スポンサー協賛さんぽ会（試供品あり）",
      date: new Date(Date.now() + 10 * 24 * 3600 * 1000).toISOString().split("T")[0],
      time: "10:00",
      distanceKm: 2.5,
      durationMin: 60,
      capacity: 20,
      conditions: "全犬種OK／距離確保",
      notes: "ユニ・チャーム協賛。試供品配布あり。",
      paid: false,
      sponsor: { name: "ユニ・チャーム", gift: "トイレシーツ/おやつ 試供品" },
      meeting: { name: "市民の森 公園 西口" },
      route: "西口→池の周回→芝生広場",
      level: "ゆるめ",
      host: { id: "host-off-2", name: "公式アカウント", role: "official" },
      status: "published",
      participants: [],
      createdAt: Date.now(),
    },
  ]
  saveAll(seed)
}

export function createWalk(
  input: Omit<WalkEvent, "id" | "participants" | "createdAt" | "status" | "paid" | "price"> & {
    status?: WalkEvent["status"]
    paid?: boolean
    price?: number
  },
) {
  // ルール適用:
  // - community/sponsor は常に無料（paid=false）
  // - official のみ有料可。ただし host.role が "official" | "trainer" 以外の場合は強制的に無料
  const isOfficialHost = input.host?.role === "official" || input.host?.role === "trainer"
  let paid = !!input.paid
  let price = input.price

  if (input.type === "community" || input.type === "sponsor") {
    paid = false
    price = undefined
  } else if (input.type === "official") {
    if (!isOfficialHost) {
      paid = false
      price = undefined
    } else if (!paid) {
      price = undefined
    }
  }

  const list = listWalks()
  const walk: WalkEvent = {
    ...input,
    paid,
    price,
    id: uid("walk"),
    participants: [],
    createdAt: Date.now(),
    status: input.status ?? "published",
  }
  saveAll([walk, ...list])
  return walk
}

export function updateWalk(id: string, patch: Partial<WalkEvent>) {
  const list = listWalks()
  const idx = list.findIndex((w) => w.id === id)
  if (idx === -1) return
  const merged = { ...list[idx], ...patch } as WalkEvent

  // ルール維持: type が community/sponsor の場合、常に無料
  if (merged.type === "community" || merged.type === "sponsor") {
    merged.paid = false
    merged.price = undefined
  }
  list[idx] = merged
  saveAll(list)
  return list[idx]
}

export function registerParticipant(walkId: string, user = currentUser(), opts?: { paid?: boolean }) {
  const walk = getWalk(walkId)
  if (!walk) throw new Error("walk not found")
  if (walk.participants.find((p) => p.email === user.email)) return walk // already joined
  if (walk.participants.length >= walk.capacity) throw new Error("満席です")
  const participant: WalkParticipant = {
    id: uid("pt"),
    name: user.name,
    email: user.email,
    joinedAt: Date.now(),
    paid: walk.paid ? !!opts?.paid : true,
  }
  const updated = updateWalk(walkId, { participants: [...walk.participants, participant] })
  return updated
}

export function setCheckIn(walkId: string, participantId: string, checked: boolean) {
  const walk = getWalk(walkId)
  if (!walk) return
  const updated = walk.participants.map((p) => (p.id === participantId ? { ...p, checkedIn: checked } : p))
  return updateWalk(walkId, { participants: updated })
}

export function setCheckOut(walkId: string, participantId: string, checked: boolean) {
  const walk = getWalk(walkId)
  if (!walk) return
  const updated = walk.participants.map((p) => (p.id === participantId ? { ...p, checkedOut: checked } : p))
  return updateWalk(walkId, { participants: updated })
}

export function approveWalk(id: string) {
  return updateWalk(id, { status: "published" })
}

export function cancelWalk(id: string, reason?: string) {
  return updateWalk(id, {
    status: "cancelled",
    notes: reason ? `${reason}\n${new Date().toLocaleString("ja-JP")}更新` : getWalk(id)?.notes || "",
  })
}
