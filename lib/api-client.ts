import { API_CONFIG, USE_MOCK_DATA } from './api-config'

// 共通のAPIレスポンス型
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
}

// 認証トークン管理
class TokenManager {
  private static instance: TokenManager
  private token: string | null = null

  static getInstance(): TokenManager {
    if (!TokenManager.instance) {
      TokenManager.instance = new TokenManager()
    }
    return TokenManager.instance
  }

  setToken(token: string): void {
    this.token = token
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token)
    }
  }

  getToken(): string | null {
    if (this.token) return this.token
    
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('auth_token')
    }
    return this.token
  }

  clearToken(): void {
    this.token = null
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token')
    }
  }
}

// APIクライアントクラス
class ApiClient {
  private baseURL: string
  private tokenManager: TokenManager

  constructor(baseURL: string) {
    this.baseURL = baseURL
    this.tokenManager = TokenManager.getInstance()
  }

  private async makeRequest<T>(
    endpoint: string, 
    options: RequestOptions = {}
  ): Promise<ApiResponse<T>> {
    const { 
      method = 'GET', 
      headers = {}, 
      body, 
      timeout = API_CONFIG.TIMEOUT 
    } = options

    const url = `${this.baseURL}${endpoint}`
    
    // ヘッダー構築
    const requestHeaders: Record<string, string> = {
      ...API_CONFIG.DEFAULT_HEADERS,
      ...headers,
    }

    // 認証トークンを追加
    const token = this.tokenManager.getToken()
    if (token) {
      requestHeaders.Authorization = `Bearer ${token}`
    }

    // リクエスト設定
    const config: RequestInit = {
      method,
      headers: requestHeaders,
    }

    if (body && method !== 'GET') {
      config.body = JSON.stringify(body)
    }

    try {
      // タイムアウト制御
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), timeout)
      config.signal = controller.signal

      const response = await fetch(url, config)
      clearTimeout(timeoutId)

      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()
      return data

    } catch (error) {
      console.error('API Request Error:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      }
    }
  }

  // GET リクエスト
  async get<T>(endpoint: string, headers?: Record<string, string>): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, { method: 'GET', headers })
  }

  // POST リクエスト
  async post<T>(
    endpoint: string, 
    body?: any, 
    headers?: Record<string, string>
  ): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, { method: 'POST', body, headers })
  }

  // PUT リクエスト
  async put<T>(
    endpoint: string, 
    body?: any, 
    headers?: Record<string, string>
  ): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, { method: 'PUT', body, headers })
  }

  // DELETE リクエスト
  async delete<T>(endpoint: string, headers?: Record<string, string>): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, { method: 'DELETE', headers })
  }

  // PATCH リクエスト
  async patch<T>(
    endpoint: string, 
    body?: any, 
    headers?: Record<string, string>
  ): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, { method: 'PATCH', body, headers })
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

// API接続状態チェック
export async function checkApiHealth(): Promise<boolean> {
  if (USE_MOCK_DATA) {
    return true // モックモードでは常にOK
  }

  try {
    const response = await apiClient.get('/health')
    return response.success
  } catch {
    return false
  }
}
