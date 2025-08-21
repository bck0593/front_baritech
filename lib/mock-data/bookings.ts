import { Booking } from '../types'

export const mockBookings: Booking[] = [
  // 今日のテスト用予約
  {
    id: "today-1",
    owner_id: "1",
    dog_id: "1",
    service_type: "保育園",
    booking_date: new Date().toISOString().split('T')[0], // 今日の日付
    booking_time: "09:00-17:00",
    status: "確定",
    amount: 5000,
    payment_status: "支払い済み",
    memo: "今日の一日預かりコース",
    dog: {
      id: "1",
      name: "ポチ",
      owner_id: "1",
      breed: "柴犬",
      sex: "オス",
      birthdate: "2021-01-01",
      avatar: "/placeholder-user.jpg"
    }
  },
  // 次回の予約（明日）
  {
    id: "next-1",
    owner_id: "1",
    dog_id: "1",
    service_type: "保育園",
    booking_date: new Date(new Date().getTime() + 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 明日の日付
    booking_time: "09:00-17:00",
    status: "確定",
    amount: 5000,
    payment_status: "支払い済み",
    memo: "明日の一日預かりコース",
    dog: {
      id: "1",
      name: "ポチ",
      owner_id: "1",
      breed: "ゴールデンレトリバー",
      sex: "オス",
      birthdate: "2021-01-01",
      avatar: "/placeholder-user.jpg"
    }
  },
  {
    id: "1",
    owner_id: "1",
    dog_id: "1",
    service_type: "保育園",
    booking_date: "2024-01-15",
    booking_time: "09:00",
    status: "確定",
    amount: 5000,
    payment_status: "支払い済み",
    memo: "一日預かりコース",
  },
  {
    id: "2",
    owner_id: "2",
    dog_id: "2",
    service_type: "体験",
    booking_date: "2024-01-15",
    booking_time: "13:00",
    status: "受付中",
    amount: 2000,
    payment_status: "未払い",
    memo: "初回体験",
  },
  {
    id: "3",
    owner_id: "3",
    dog_id: "3",
    service_type: "保育園",
    booking_date: "2024-01-16",
    booking_time: "10:00",
    status: "完了",
    amount: 5000,
    payment_status: "支払い済み",
    memo: "半日コース",
  },
  {
    id: "4",
    owner_id: "1",
    dog_id: "4",
    service_type: "イベント",
    booking_date: "2024-01-16",
    booking_time: "14:00",
    status: "確定",
    amount: 3000,
    payment_status: "支払い済み",
    memo: "しつけ教室",
  },
  {
    id: "5",
    owner_id: "4",
    dog_id: "6",
    service_type: "保育園",
    booking_date: "2024-01-17",
    booking_time: "09:30",
    status: "受付中",
    amount: 5000,
    payment_status: "未払い",
    memo: "一日預かり",
  },
]
