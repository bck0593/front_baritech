"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

export type UserRole = "user" | "admin" | "super_admin"

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  avatar?: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  isLoading: boolean
  hasPermission: (requiredRole: UserRole) => boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// ロール階層の定義
const roleHierarchy: Record<UserRole, number> = {
  user: 1,
  admin: 2,
  super_admin: 3,
}

// モックユーザーデータ
const mockUsers: (User & { password: string })[] = [
  {
    id: "1",
    name: "田中太郎",
    email: "user@example.com",
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
]

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // ローカルストレージから認証情報を復元
    const savedUser = localStorage.getItem("auth_user")
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser))
      } catch (error) {
        console.error("Failed to parse saved user:", error)
        localStorage.removeItem("auth_user")
      }
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true)

    // モック認証（実際のアプリではAPIを呼び出し）
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const foundUser = mockUsers.find((u) => u.email === email && u.password === password)

    if (foundUser) {
      const { password: _, ...userWithoutPassword } = foundUser
      setUser(userWithoutPassword)
      localStorage.setItem("auth_user", JSON.stringify(userWithoutPassword))
      setIsLoading(false)
      return true
    }

    setIsLoading(false)
    return false
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("auth_user")
  }

  const hasPermission = (requiredRole: UserRole): boolean => {
    if (!user) return false
    return roleHierarchy[user.role] >= roleHierarchy[requiredRole]
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading, hasPermission }}>{children}</AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
