// Silent version of API client - no console logging
const USE_MOCK_DATA = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true'
const BACKEND_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_BASE_URL || '/api/proxy'
console.log('🌍 Environment Config:', { 
  USE_MOCK_DATA, 
  BACKEND_BASE_URL,
  env: process.env.NODE_ENV
})

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
}

class TokenManager {
  // 🔍 デバッグ用：トークン状態を確認
  debugTokenState() {
    const token = this.getToken()
    const isAuth = this.isAuthenticated()
    console.log('🔍 [TOKEN DEBUG] 現在の状態:', {
      hasToken: !!token,
      tokenLength: token?.length || 0,
      isAuthenticated: isAuth,
      tokenPreview: token ? token.substring(0, 30) + '...' : null,
      timestamp: new Date().toISOString()
    })
    return { hasToken: !!token, isAuthenticated: isAuth }
  }

  setToken(token: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token)
    }
  }

  getToken(): string | null {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('auth_token')
      
      // トークンが存在する場合は有効期限をチェック
      if (token && this.isTokenExpired(token)) {
        this.clearToken()
        return null
      }
      
      return token
    }
    return null
  }

  private isTokenExpired(token: string): boolean {
    try {
      // JWT の payload 部分をデコード（簡易チェック）
      const base64Url = token.split('.')[1]
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      )
      
      const decoded = JSON.parse(jsonPayload)
      
      // 現在時刻と比較（5分のマージンを設ける）
      const currentTime = Math.floor(Date.now() / 1000)
      const expirationTime = decoded.exp
      const margin = 5 * 60 // 5分
      
      const isExpired = currentTime >= (expirationTime - margin)
      
      return isExpired
    } catch (error) {
      return true // デコード失敗時は期限切れとみなす
    }
  }

  clearToken(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token')
    }
  }

  isAuthenticated(): boolean {
    const token = this.getToken()
    const authenticated = !!token
    return authenticated
  }
}

export class ApiClient {
  private tokenManager: TokenManager
  private baseURL: string

  constructor() {
    this.tokenManager = new TokenManager()
    this.baseURL = BACKEND_BASE_URL
    
    // 🔍 初期化時にトークン状態をチェック
    console.log('🚀 [API CLIENT] 初期化完了 - トークン状態チェック')
    this.tokenManager.debugTokenState()
  }

  // 🔍 外部からトークン状態を確認できるメソッド
  getTokenDebugInfo() {
    return this.tokenManager.debugTokenState()
  }

  setToken(token: string): void {
    this.tokenManager.setToken(token)
  }

  getToken(): string | null {
    return this.tokenManager.getToken()
  }

  clearToken(): void {
    this.tokenManager.clearToken()
  }

  isAuthenticated(): boolean {
    return this.tokenManager.isAuthenticated()
  }

  private getAuthHeaders(): Record<string, string> {
    const headers: Record<string, string> = {}
    const token = this.tokenManager.getToken()
    
    // 一時的なデバッグログ
    console.log('🔍 Silent API Client - getAuthHeaders called')
    console.log('🔍 Silent API Client - Token from TokenManager:', token ? `${token.substring(0, 30)}...` : 'null')
    console.log('🔍 Silent API Client - TokenManager isAuthenticated:', this.tokenManager.isAuthenticated())
    
    if (token) {
      headers.Authorization = `Bearer ${token}`
      console.log('🔍 Silent API Client - Authorization header set:', `Bearer ${token.substring(0, 30)}...`)
    } else {
      console.log('🔍 Silent API Client - No Authorization header (no token)')
    }

    console.log('🔍 Silent API Client - Final headers keys:', Object.keys(headers))
    return headers
  }

  async request<T = any>(
    endpoint: string,
    options: {
      method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
      body?: any
      headers?: Record<string, string>
      requireAuth?: boolean
      timeout?: number
    } = {}
  ): Promise<ApiResponse<T>> {
    const {
      method = 'GET',
      body,
      headers: customHeaders = {},
      requireAuth = true,
      timeout = 30000
    } = options

    // URL構築
    const url = endpoint.startsWith('http') 
      ? endpoint 
      : `${this.baseURL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`

    // リクエストヘッダー設定
    const requestHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
      ...customHeaders
    }

    // 認証ヘッダー追加
    if (requireAuth) {
      const authHeaders = this.getAuthHeaders()
      Object.assign(requestHeaders, authHeaders)
      
      // 一時的なデバッグログ
      console.log('🔍 Silent API Client - Request to:', endpoint)
      console.log('🔍 Silent API Client - RequireAuth:', requireAuth)
      console.log('🔍 Silent API Client - Final request headers:', Object.keys(requestHeaders))
      console.log('🔍 Silent API Client - Has Authorization in final headers:', !!requestHeaders.Authorization)
      if (requestHeaders.Authorization) {
        console.log('🔍 Silent API Client - Authorization value:', requestHeaders.Authorization.substring(0, 50) + '...')
      }
    }

    // Fetch設定
    const config: RequestInit = {
      method,
      headers: requestHeaders,
      cache: 'no-store'
    }

    if (body && method !== 'GET') {
      if (typeof body === 'string') {
        config.body = body
      } else {
        config.body = JSON.stringify(body)
      }
    }

    try {
      // タイムアウト制御（サイレント）
      const controller = new AbortController()
      const timeoutId = setTimeout(() => {
        controller.abort()
      }, timeout)
      config.signal = controller.signal

      // 🔍 追加デバッグ: 実際のfetchリクエスト詳細
      console.log('🚀 About to fetch:', url)
      console.log('🚀 Method:', method)
      console.log('🚀 Request Headers:', JSON.stringify(requestHeaders, null, 2))
      console.log('🚀 Authorization header present:', !!requestHeaders.Authorization)
      if (requestHeaders.Authorization) {
        console.log('🚀 Authorization value preview:', requestHeaders.Authorization.substring(0, 50) + '...')
      }
      
      const response = await fetch(url, config)
      clearTimeout(timeoutId)

      // バックエンドレスポンス処理（サイレント）
      if (!response.ok) {
        const rawText = await response.text()
        let errorDetail = `HTTP Error: ${response.status} ${response.statusText}`
        
        if (response.status === 404) {
          errorDetail = 'API endpoint not implemented'
        } else if (response.status === 403) {
          errorDetail = 'Access forbidden (missing owner record or permissions)'
        }
        
        try {
          const errorData = JSON.parse(rawText)
          if (errorData.detail) {
            errorDetail = errorData.detail
          } else if (errorData.message) {
            errorDetail = errorData.message
          } else if (typeof errorData === 'string') {
            errorDetail = errorData
          }
        } catch (parseError) {
          if (rawText.includes('<html>') || rawText.includes('<!DOCTYPE')) {
            errorDetail = 'Server returned HTML error page (likely Azure/proxy error)'
          } else if (rawText) {
            errorDetail = rawText.substring(0, 100)
          }
        }
        
        return {
          success: false,
          error: errorDetail
        }
      }

      const data = await response.json()
      
      return {
        success: true,
        data: data
      }

    } catch (error) {
      // エラー処理（サイレント）
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          return {
            success: false,
            error: 'Request timeout - サーバーの応答が遅すぎます'
          }
        }
        
        if (error.message.includes('Failed to fetch')) {
          return {
            success: false,
            error: 'Network/CORS Error - ネットワーク接続またはCORSの問題が発生しました。バックエンドのCORS設定を確認してください。'
          }
        }
        
        return {
          success: false,
          error: error.message
        }
      }
      
      return {
        success: false,
        error: 'Unknown error occurred'
      }
    }
  }

  // 便利メソッド
  async get<T = any>(endpoint: string, options?: Omit<Parameters<ApiClient['request']>[1], 'method'>): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: 'GET' })
  }

  async post<T = any>(endpoint: string, body?: any, options?: Omit<Parameters<ApiClient['request']>[1], 'method' | 'body'>): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: 'POST', body })
  }

  async put<T = any>(endpoint: string, body?: any, options?: Omit<Parameters<ApiClient['request']>[1], 'method' | 'body'>): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: 'PUT', body })
  }

  async delete<T = any>(endpoint: string, options?: Omit<Parameters<ApiClient['request']>[1], 'method'>): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' })
  }

  async patch<T = any>(endpoint: string, body?: any, options?: Omit<Parameters<ApiClient['request']>[1], 'method' | 'body'>): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: 'PATCH', body })
  }
}

// シングルトンインスタンス
const apiClient = new ApiClient()

// 🔍 ブラウザコンソールからアクセス可能にする
if (typeof window !== 'undefined') {
  ;(window as any).debugApiClient = {
    checkToken: () => apiClient.getTokenDebugInfo(),
    getToken: () => apiClient.getToken(),
    isAuthenticated: () => apiClient.isAuthenticated(),
    clearToken: () => apiClient.clearToken()
  }
  console.log('🛠️ Debug Tools: window.debugApiClient でトークン状態を確認できます')
}

export default apiClient
