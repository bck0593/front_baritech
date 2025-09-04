import { Owner } from '../types'

export const mockOwners: Owner[] = [
  // user@example.com用のオーナー
  {
    id: "0",
    name: "テストユーザー",
    email: "user@example.com",
    phone: "090-0000-0000",
    avatar: "/placeholder.svg?height=40&width=40",
    created_at: "2024-01-10T00:00:00Z",
  },
  {
    id: "1",
    name: "田中太郎",
    email: "tanaka@example.com",
    phone: "090-1234-5678",
    avatar: "/placeholder.svg?height=40&width=40",
    created_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "2",
    name: "佐藤花子",
    email: "sato@example.com",
    phone: "080-2345-6789",
    avatar: "/placeholder.svg?height=40&width=40",
    created_at: "2024-01-02T00:00:00Z",
  },
  {
    id: "3",
    name: "鈴木一郎",
    email: "suzuki@example.com",
    phone: "070-3456-7890",
    avatar: "/placeholder.svg?height=40&width=40",
    created_at: "2024-01-03T00:00:00Z",
  },
  {
    id: "4",
    name: "高橋美咲",
    email: "takahashi@example.com",
    phone: "090-4567-8901",
    created_at: "2024-01-04T00:00:00Z",
  },
  {
    id: "5",
    name: "渡辺健太",
    email: "watanabe@example.com",
    phone: "080-5678-9012",
    created_at: "2024-01-05T00:00:00Z",
  },
]
