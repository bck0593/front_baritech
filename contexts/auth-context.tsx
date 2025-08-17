"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { AuthService } from "@/lib/api-services"
import { tokenManager } from "@/lib/api-client"
import { USE_MOCK_DATA } from "@/lib/api-config"

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
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// ロール階層の定義
const roleHierarchy: Record<UserRole, number> = {
  user: 1,
  admin: 2,
  super_admin: 3,
}

// モックユーザーデータ（開発用）
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

    try {
      if (USE_MOCK_DATA) {
        // モック認証
        await new Promise((resolve) => setTimeout(resolve, 1000))
        const foundUser = mockUsers.find((u) => u.email === email && u.password === password)

        if (foundUser) {
          const { password: _, ...userWithoutPassword } = foundUser
          setUser(userWithoutPassword)
          if (typeof window !== 'undefined') {
            localStorage.setItem("auth_user", JSON.stringify(userWithoutPassword))
          }
          // モック用のトークンを設定
          tokenManager.setToken(`mock_token_${Date.now()}`)
          setIsLoading(false)
          return true
        }
      } else {
        // 実際のAPI認証
        const response = await AuthService.login({ email, password })
        
        if (response.success && response.data) {
          // ユーザー情報をマッピング
          const mappedUser: User = {
            id: response.data.user.id,
            name: response.data.user.name,
            email: response.data.user.email,
            role: response.data.user.role === '利用者' ? 'user' : 
                  response.data.user.role === '管理者' ? 'admin' : 'super_admin',
            avatar: undefined
          }
          
          setUser(mappedUser)
          if (typeof window !== 'undefined') {
            localStorage.setItem("auth_user", JSON.stringify(mappedUser))
          }
          
          // トークンを設定
          tokenManager.setToken(response.data.access_token)
          setIsLoading(false)
          return true
        }
      }
      
      setIsLoading(false)
      return false
    } catch (error) {
      console.error('Login error:', error)
      setIsLoading(false)
      return false
    }
  }

  const logout = () => {
    setUser(null)
    tokenManager.clearToken()
    if (typeof window !== 'undefined') {
      localStorage.removeItem("auth_user")
    }
  }

  const hasPermission = (requiredRole: UserRole): boolean => {
    if (!user) return false
    return roleHierarchy[user.role] >= roleHierarchy[requiredRole]
  }

  const isAuthenticated = !!user

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      logout, 
      isLoading, 
      hasPermission, 
      isAuthenticated 
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
