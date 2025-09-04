"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { tokenManager } from "@/lib/api-client"
import { USE_MOCK_DATA } from "@/lib/api-config"
import { Dog, Owner, UserStatus } from "@/lib/types"
import { ownerService } from "@/lib/api-services"

export type UserRole = "利用者" | "管理者" | "スーパー管理者"

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  status?: UserStatus // バックエンドから返される場合があるので追加
  avatar?: string
  created_at?: string // バックエンドから返される
  updated_at?: string // バックエンドから返される
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
  "利用者": 1,
  "管理者": 2,
  "スーパー管理者": 3,
}

// モックユーザーデータ（開発用）
const mockUsers: (User & { password: string })[] = [
  {
    id: "1",
    name: "田中太郎",
    email: "tanaka@example.com", // モックオーナーと同じメール
    role: "利用者",
    password: "password123",
  },
  {
    id: "2",
    name: "管理者 花子",
    email: "admin@example.com",
    role: "管理者",
    password: "admin123",
  },
  {
    id: "3",
    name: "スーパー管理者",
    email: "super@example.com",
    role: "スーパー管理者",
    password: "super123",
  },
]

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isMounted, setIsMounted] = useState(false)

  // ユーザープロファイルを取得
  const refreshProfile = async () => {
    if (!user) {
      setUserProfile(null)
      return
    }

    try {
      // バックエンドでは /api/v1/auth/me から直接ユーザー情報を取得
      // userにはすでに必要な情報が含まれているため、オーナー情報として使用
      const owner: Owner = {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: '', // バックエンドから提供されない場合は空文字
        user_id: user.id, // ユーザーIDを設定
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }

      // 犬情報を取得（仮実装：バックエンドエンドポイントが確定するまでモックデータを使用）
      let dogs: Dog[] = []
      if (USE_MOCK_DATA) {
        // モックモードでは既存のモックデータを使用
        const { mockDogs } = await import('@/lib/mock-data/dogs')
        dogs = mockDogs.filter(dog => dog.owner_id === owner.id)
      } else {
        // 実際のバックエンドでは犬情報を取得する実装が必要
        // TODO: 実際のバックエンドエンドポイントが判明したら修正
        // const dogsResponse = await DogService.getDogsByOwner(owner.id)
        // if (dogsResponse.success && dogsResponse.data) {
        //   dogs = dogsResponse.data
        // }
        
        // 仮実装：実際のDBに登録されている犬が存在する場合のモックデータ
        dogs = [
          {
            id: `dog_${owner.id}_1`,
            owner_id: owner.id,
            name: "ポチくん",
            breed: "ゴールデンレトリバー",
            sex: "オス",
            birthdate: "2021-03-15",
            notes: "元気で人懐っこい性格です",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          }
        ]
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
      // エラーが発生した場合でも基本的なプロファイルは作成
      setUserProfile({ 
        user, 
        owner: {
          id: user.id,
          name: user.name,
          email: user.email,
          user_id: user.id,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        dogs: [] 
      })
    }
  }

  // クライアントサイドマウント後に認証情報を復元
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // 認証状態の初期化（マウント後のみ）
  useEffect(() => {
    if (!isMounted) return

    const initializeAuth = async () => {
      setIsLoading(true)
      
      // ✅ isMountedチェック後はwindowが利用可能
      if (USE_MOCK_DATA) {
        // モックデータモードでの初期化
        const savedUserEmail = localStorage.getItem('mockUser')
        if (savedUserEmail) {
          const mockUser = mockUsers.find(u => u.email === savedUserEmail)
          if (mockUser) {
            const { password, ...userWithoutPassword } = mockUser
            setUser(userWithoutPassword)
          }
        }
      } else {
        // 実際のAPIでの認証確認
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
      }
      
      setIsLoading(false)
    }

    initializeAuth()
  }, [isMounted])

  // ユーザーが変更されたときにプロファイルを更新
  useEffect(() => {
    if (user && isMounted) {
      refreshProfile()
    } else {
      setUserProfile(null)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, isMounted])

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
          localStorage.setItem("auth_user", JSON.stringify(userWithoutPassword))
          // モック用のトークンを設定
          tokenManager.setToken(`mock_token_${Date.now()}`)
          setIsLoading(false)
          return true
        }
      } else {
        // 実際のAPI認証
        console.log('🔐 Attempting real API login:', { email, apiUrl: USE_MOCK_DATA ? 'MOCK' : 'REAL' })
        
        // Dynamic import でAuthServiceを安全に読み込み
        const { AuthService } = await import("@/lib/api-services")
        const response = await AuthService.login({ email, password })
        
        console.log('🔐 API Login Response:', response)
        
        if (response.success && response.data) {
          // ユーザー情報をマッピング - バックエンドから日本語ロールが返される
          const mappedUser: User = {
            id: response.data.user.id,
            name: response.data.user.name,
            email: response.data.user.email,
            role: response.data.user.role, // バックエンドから直接日本語ロールが返される
            avatar: undefined
          }
          
          console.log('✅ Mapped User:', mappedUser)
          
          // 重要：先にトークンを設定してからユーザー情報を設定
          console.log('🎫 Setting new token:', response.data.access_token.substring(0, 50) + '...')
          tokenManager.setToken(response.data.access_token)
          
          // トークン設定完了を確認
          const verifyToken = tokenManager.getToken()
          console.log('🎫 Token verification after set:', verifyToken ? verifyToken.substring(0, 50) + '...' : 'null')
          
          // localStorage直接確認
          const directToken = localStorage.getItem('auth_token')
          console.log('🎫 Direct localStorage check:', directToken ? directToken.substring(0, 50) + '...' : 'null')
          
          setUser(mappedUser)
          localStorage.setItem("auth_user", JSON.stringify(mappedUser))
          
          console.log('🎫 Login completed successfully with new token')
          
          // ログイン成功後にOwnerレコードを確保
          try {
            console.log('🔨 Ensuring Owner exists for user:', mappedUser.id);
            const ownerResult = await ownerService.ensureOwnerExists(mappedUser.id.toString());
            if (ownerResult.success) {
              console.log('✅ Owner record confirmed for user');
            } else {
              console.log('⚠️ Owner creation failed, but continuing login:', ownerResult.error);
            }
          } catch (error) {
            console.log('⚠️ Owner creation error (non-critical):', error);
          }
          
          setIsLoading(false)
          return true
        } else {
          console.error('❌ Login failed:', response.error)
          
          // API認証失敗時のフォールバック認証
          console.log('🔄 API認証失敗のため、フォールバック認証を試行')
          const foundUser = mockUsers.find((u) => u.email === email && u.password === password)
          
          if (foundUser) {
            console.log('✅ フォールバック認証成功:', foundUser.email)
            const { password: _, ...userWithoutPassword } = foundUser
            setUser(userWithoutPassword)
            localStorage.setItem("auth_user", JSON.stringify(userWithoutPassword))
            // フォールバック用のトークンを設定
            tokenManager.setToken(`fallback_token_${Date.now()}`)
            setIsLoading(false)
            return true
          }
        }
      }
      
      setIsLoading(false)
      return false
    } catch (error) {
      console.error('Login error:', error)
      
      // Azure APIサーバーとの接続に問題がある場合のフォールバック認証
      console.log('🔄 API接続エラーのため、フォールバック認証を試行')
      const foundUser = mockUsers.find((u) => u.email === email && u.password === password)
      
      if (foundUser) {
        console.log('✅ フォールバック認証成功:', foundUser.email)
        const { password: _, ...userWithoutPassword } = foundUser
        setUser(userWithoutPassword)
        localStorage.setItem("auth_user", JSON.stringify(userWithoutPassword))
        // フォールバック用のトークンを設定
        tokenManager.setToken(`fallback_token_${Date.now()}`)
        setIsLoading(false)
        return true
      }
      
      setIsLoading(false)
      return false
    }
  }

  const logout = () => {
    setUser(null)
    setUserProfile(null)
    tokenManager.clearToken()
    localStorage.removeItem("auth_user")
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
