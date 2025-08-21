"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { AuthService, DogService, OwnerService } from "@/lib/api-services"
import { tokenManager } from "@/lib/api-client"
import { USE_MOCK_DATA } from "@/lib/api-config"
import { Dog, Owner } from "@/lib/types"

export type UserRole = "user" | "admin" | "super_admin"

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  avatar?: string
}

export interface UserProfile {
  user: User
  owner?: Owner
  dogs: Dog[]
  primaryDog?: Dog
}

interface AuthContextType {
  user: User | null
  userProfile: UserProfile | null
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  refreshProfile: () => Promise<void>
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
    email: "tanaka@example.com", // モックオーナーと同じメール
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
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // ユーザープロファイルを取得
  const refreshProfile = async () => {
    if (!user) {
      setUserProfile(null)
      return
    }

    try {
      // オーナー情報を取得（ユーザーIDでオーナーを検索）
      const ownersResponse = await OwnerService.getOwners({ q: user.email })
      let owner: Owner | undefined
      
      if (ownersResponse.success && ownersResponse.data) {
        const owners = Array.isArray(ownersResponse.data) ? ownersResponse.data : (ownersResponse.data as any).items || []
        owner = owners.find((o: Owner) => o.email === user.email)
      }

      // 犬情報を取得
      let dogs: Dog[] = []
      if (owner) {
        const dogsResponse = await DogService.getDogsByOwner(owner.id)
        if (dogsResponse.success && dogsResponse.data) {
          dogs = dogsResponse.data
        }
      }

      // プライマリドッグ（最初の犬）を設定
      const primaryDog = dogs.length > 0 ? dogs[0] : undefined

      const profile: UserProfile = {
        user,
        owner,
        dogs,
        primaryDog
      }

      setUserProfile(profile)
    } catch (error) {
      console.error('Error refreshing profile:', error)
      setUserProfile({ user, dogs: [] })
    }
  }

  useEffect(() => {
    // ローカルストレージから認証情報を復元
    const savedUser = localStorage.getItem("auth_user")
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser)
        setUser(parsedUser)
      } catch (error) {
        console.error("Failed to parse saved user:", error)
        localStorage.removeItem("auth_user")
      }
    }
    setIsLoading(false)
  }, [])

  // ユーザーが変更されたときにプロファイルを更新
  useEffect(() => {
    if (user) {
      refreshProfile()
    } else {
      setUserProfile(null)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

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
    setUserProfile(null)
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
      userProfile,
      login, 
      logout, 
      refreshProfile,
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
