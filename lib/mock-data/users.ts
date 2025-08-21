export interface MockUser {
  id: string
  name: string
  email: string
  role: 'user' | 'admin' | 'super_admin'
  password: string
}

export const mockUsers: MockUser[] = [
  {
    id: "1",
    name: "田中太郎",
    email: "tanaka@example.com",
    role: "user",
    password: "password123",
  },
  {
    id: "2",
    name: "管理者 花子",
    email: "admin@example.com",
    role: "admin",
    password: "admin123",
  },
  {
    id: "3",
    name: "スーパー管理者",
    email: "super@example.com",
    role: "super_admin",
    password: "super123",
  },
  {
    id: "4",
    name: "佐藤花子",
    email: "sato@example.com",
    role: "user",
    password: "password123",
  },
  {
    id: "5",
    name: "鈴木一郎",
    email: "suzuki@example.com",
    role: "user",
    password: "password123",
  },
]
