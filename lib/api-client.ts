import { API_CONFIG, USE_MOCK_DATA, HEALTH_CHECK_ENDPOINT } from './api-config'

// 共通のAPIレスポンス型（バックエンドがPydanticモデルを直接返すため）
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  success: boolean
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// リクエストオプション型
interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  headers?: Record<string, string>
  body?: any
  timeout?: number
  requireAuth?: boolean
}

// 認証トークン管理（バックエンドJWT対応）
class TokenManager {
  private static instance: TokenManager

  static getInstance(): TokenManager {
    if (!TokenManager.instance) {
      TokenManager.instance = new TokenManager()
    }
    return TokenManager.instance
  }

  setToken(token: string): void {
    console.log('🎫 TokenManager.setToken called:', token.substring(0, 50) + '...')
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token)
      console.log('🎫 Token saved to localStorage')
    }
  }

  getToken(): string | null {
    // 常に最新のlocalStorageから取得（キャッシュしない）
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('auth_token')
      
      // トークンの有効期限をチェック
      if (token && this.isTokenExpired(token)) {
        console.log('🎫 Token expired, clearing...')
        this.clearToken()
        return null
      }
      
      console.log('🎫 TokenManager.getToken:', token ? token.substring(0, 50) + '...' : 'null')
      return token
    }
    return null
  }

  private isTokenExpired(token: string): boolean {
    // フォールバックトークンの場合は期限切れでない
    if (token.startsWith('fallback_token_') || token.startsWith('mock_token_')) {
      return false
    }
    
    try {
      // JWT トークンのペイロード部分をデコード
      const base64Url = token.split('.')[1]
      if (!base64Url) {
        // JWTトークンではない場合（base64Urlが存在しない）
        return false
      }
      
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
      console.log('🎫 Token expiration check:', { 
        currentTime, 
        expirationTime, 
        isExpired,
        remainingSeconds: expirationTime - currentTime
      })
      
      return isExpired
    } catch (error) {
      console.error('🎫 Failed to decode token:', error)
      // デコード失敗時は、フォールバックトークンなら有効とみなす
      return token.startsWith('fallback_token_') || token.startsWith('mock_token_') ? false : true
    }
  }

  clearToken(): void {
    console.log('🎫 TokenManager.clearToken called')
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token')
    }
  }

  isAuthenticated(): boolean {
    const token = this.getToken()
    const authenticated = !!token
    console.log('🎫 TokenManager.isAuthenticated:', authenticated)
    return authenticated
  }
}

// APIクライアントクラス（バックエンド対応）
class ApiClient {
  private baseURL: string
  private tokenManager: TokenManager

  constructor(baseURL: string) {
    this.baseURL = baseURL
    this.tokenManager = TokenManager.getInstance()
  }

  // TokenManager メソッドの公開
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

  private async makeRequest<T>(
    endpoint: string, 
    options: RequestOptions = {}
  ): Promise<ApiResponse<T>> {
    const { 
      method = 'GET', 
      headers = {}, 
      body, 
      timeout = API_CONFIG.TIMEOUT,
      requireAuth = true
    } = options

    const url = `${this.baseURL}${endpoint}`
    
    // ヘッダー構築
    const requestHeaders: Record<string, string> = {
      ...API_CONFIG.DEFAULT_HEADERS,
      ...headers,
    }

    // 認証トークンを追加（requireAuth が true の場合のみ）
    if (requireAuth) {
      const token = this.tokenManager.getToken()
      console.log('🎫 ApiClient requesting token from TokenManager:', token ? token.substring(0, 50) + '...' : 'null')
      
      if (token) {
        requestHeaders.Authorization = `Bearer ${token}`
        console.log('🎫 Authorization header set:', `Bearer ${token.substring(0, 50)}...`)
      } else {
        console.log('❌ No token available for Authorization header')
      }
    } else {
      console.log('🔓 Auth not required for this request')
    }

    // リクエスト設定
    const config: RequestInit = {
      method,
      headers: requestHeaders,
    }

    if (body && method !== 'GET') {
      // URLSearchParams の場合はそのまま、それ以外はJSONに変換
      if (body instanceof URLSearchParams) {
        config.body = body
      } else {
        config.body = JSON.stringify(body)
      }
    }

    try {
      // タイムアウト制御
      const controller = new AbortController()
      const timeoutId = setTimeout(() => {
        controller.abort()
      }, timeout)
      config.signal = controller.signal

      const response = await fetch(url, config)
      clearTimeout(timeoutId)

      // バックエンドレスポンス処理
      if (!response.ok) {
        // レスポンスの生データを確認
        const rawText = await response.text()
        
        let errorDetail = `HTTP Error: ${response.status} ${response.statusText}`
        
        // 404/403エラーは静かに処理
        if (response.status === 404) {
          errorDetail = 'API endpoint not implemented'
        } else if (response.status === 403) {
          errorDetail = 'Access forbidden (missing owner record or permissions)'
        }
        
        try {
          // rawTextをJSONとしてパース試行
          const errorData = JSON.parse(rawText)
          
          if (errorData.detail) {
            errorDetail = errorData.detail
          } else if (errorData.message) {
            errorDetail = errorData.message
          } else if (typeof errorData === 'string') {
            errorDetail = errorData
          }
        } catch (parseError) {
          // JSON parseに失敗した場合（HTMLエラーページなど）
          if (rawText.includes('<html>') || rawText.includes('<!DOCTYPE')) {
            errorDetail = 'Server returned HTML error page (likely Azure/proxy error)'
          } else if (rawText) {
            errorDetail = rawText.substring(0, 100) // 生テキストの一部を使用
          }
        }
        
        return {
          success: false,
          error: errorDetail
        }
      }

      const data = await response.json()
      
      // バックエンドはPydanticモデルを直接返すため、そのまま返す
      return {
        success: true,
        data: data
      }

    } catch (error) {
      // より詳細なエラー分類とCORS診断
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

  // GET リクエスト
  async get<T>(endpoint: string, options?: { headers?: Record<string, string>, requireAuth?: boolean }): Promise<ApiResponse<T>> {
    const { headers, requireAuth = true } = options || {}
    
    // requireAuth が false の場合、認証ヘッダーを追加しない
    if (!requireAuth) {
      return this.makeRequest<T>(endpoint, { method: 'GET', headers })
    }
    
    return this.makeRequest<T>(endpoint, { method: 'GET', headers })
  }

  // POST リクエスト
  async post<T>(
    endpoint: string, 
    body?: any, 
    options?: { headers?: Record<string, string>, requireAuth?: boolean }
  ): Promise<ApiResponse<T>> {
    const { headers, requireAuth = true } = options || {}
    return this.makeRequest<T>(endpoint, { method: 'POST', body, headers, requireAuth })
  }

  // PUT リクエスト
  async put<T>(
    endpoint: string, 
    body?: any, 
    options?: { headers?: Record<string, string>, requireAuth?: boolean }
  ): Promise<ApiResponse<T>> {
    const { headers, requireAuth = true } = options || {}
    return this.makeRequest<T>(endpoint, { method: 'PUT', body, headers, requireAuth })
  }

  // DELETE リクエスト
  async delete<T>(endpoint: string, options?: { headers?: Record<string, string>, requireAuth?: boolean }): Promise<ApiResponse<T>> {
    const { headers, requireAuth = true } = options || {}
    return this.makeRequest<T>(endpoint, { method: 'DELETE', headers, requireAuth })
  }

  // PATCH リクエスト（バックエンドの予約更新で使用）
  async patch<T>(
    endpoint: string, 
    body?: any, 
    options?: { headers?: Record<string, string>, requireAuth?: boolean }
  ): Promise<ApiResponse<T>> {
    const { headers, requireAuth = true } = options || {}
    return this.makeRequest<T>(endpoint, { method: 'PATCH', body, headers, requireAuth })
  }
}

// シングルトンAPIクライアント
export const apiClient = new ApiClient(API_CONFIG.BASE_URL)
export const tokenManager = TokenManager.getInstance()

// モックデータ用のフォールバック関数
export function createMockResponse<T>(data: T, delay = 500): Promise<ApiResponse<T>> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        data,
      })
    }, delay)
  })
}

export function createMockPaginatedResponse<T>(
  data: T[], 
  page = 1, 
  limit = 10, 
  delay = 500
): Promise<PaginatedResponse<T>> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const start = (page - 1) * limit
      const end = start + limit
      const paginatedData = data.slice(start, end)
      
      resolve({
        success: true,
        data: paginatedData,
        pagination: {
          page,
          limit,
          total: data.length,
          totalPages: Math.ceil(data.length / limit),
        }
      })
    }, delay)
  })
}

// API接続状態チェック（バックエンドの/healthzエンドポイント使用）
export async function checkApiHealth(): Promise<boolean> {
  if (USE_MOCK_DATA) {
    return true // モックモードでは常にOK
  }

  try {
    const response = await apiClient.get<{status: string}>(HEALTH_CHECK_ENDPOINT)
    return response.success && response.data?.status === 'ok'
  } catch {
    return false
  }
}
