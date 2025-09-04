import { Event } from '../types'

export const mockEvents: Event[] = [
  {
    id: '1',
    title: 'お散歩イベント - 今治城周辺',
    description: '今治城の周りを愛犬と一緒にお散歩しましょう！',
    event_date: '2025-08-30',
    start_time: '10:00',
    type: 'グループ',
    location: '今治城公園',
    capacity: 15,
    fee: 500,
    sponsor_name: 'イマバリワン',
    sponsor_gift: 'オリジナルおやつセット',
    status: 'active',
    organizer_user_id: 'organizer-1',
    created_at: '2025-08-26T10:00:00Z'
  },
  {
    id: '2',
    title: '個人お散歩 - 海岸沿いコース',
    description: '今治の美しい海岸沿いを個人でゆっくりお散歩',
    event_date: '2025-08-31',
    start_time: '15:30',
    type: '個人',
    location: '今治港周辺',
    capacity: 5,
    fee: 300,
    status: 'active',
    organizer_user_id: 'organizer-2',
    created_at: '2025-08-26T11:00:00Z'
  },
  {
    id: '3',
    title: 'ドッグラン体験',
    description: '広いドッグランで愛犬を自由に遊ばせましょう',
    event_date: '2025-09-01',
    start_time: '09:00',
    type: 'グループ',
    location: 'イマバリワン ドッグラン',
    capacity: 20,
    fee: 800,
    sponsor_name: 'ペットショップ今治',
    sponsor_gift: 'ドッグフードサンプル',
    status: 'active',
    organizer_user_id: 'organizer-1',
    created_at: '2025-08-26T12:00:00Z'
  },
  {
    id: '4',
    title: '夕日お散歩ツアー',
    description: '夕日の美しい時間帯に愛犬とお散歩を楽しみましょう',
    event_date: '2025-09-02',
    start_time: '18:00',
    type: 'グループ',
    location: '今治海岸',
    capacity: 10,
    fee: 400,
    status: 'active',
    organizer_user_id: 'organizer-3',
    created_at: '2025-08-26T13:00:00Z'
  }
]
