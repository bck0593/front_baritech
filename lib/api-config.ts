// API設定とベースURL管理
export const API_CONFIG = {
  // FastAPI バックエンドのベースURL（環境変数から取得）
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
  
  // 各エンドポイントの定義
  ENDPOINTS: {
    // 認証関連
    AUTH: {
      LOGIN: '/auth/login',
      LOGOUT: '/auth/logout',
      REGISTER: '/auth/register',
      VERIFY_TOKEN: '/auth/verify-token',
      REFRESH: '/auth/refresh',
    },
    
    // ユーザー管理
    USERS: {
      LIST: '/users',
      CREATE: '/users',
      GET: (id: string) => `/users/${id}`,
      UPDATE: (id: string) => `/users/${id}`,
      DELETE: (id: string) => `/users/${id}`,
    },
    
    // 飼い主管理
    OWNERS: {
      LIST: '/owners',
      CREATE: '/owners',
      GET: (id: string) => `/owners/${id}`,
      UPDATE: (id: string) => `/owners/${id}`,
      DELETE: (id: string) => `/owners/${id}`,
      SEARCH: '/owners/search',
    },
    
    // 犬管理
    DOGS: {
      LIST: '/dogs',
      CREATE: '/dogs',
      GET: (id: string) => `/dogs/${id}`,
      UPDATE: (id: string) => `/dogs/${id}`,
      DELETE: (id: string) => `/dogs/${id}`,
      BY_OWNER: (ownerId: string) => `/owners/${ownerId}/dogs`,
      SEARCH: '/dogs/search',
    },
    
    // 予約管理
    BOOKINGS: {
      LIST: '/bookings',
      CREATE: '/bookings',
      GET: (id: string) => `/bookings/${id}`,
      UPDATE: (id: string) => `/bookings/${id}`,
      DELETE: (id: string) => `/bookings/${id}`,
      BY_DATE: (date: string) => `/bookings?date=${date}`,
      BY_STATUS: (status: string) => `/bookings?status=${status}`,
    },
    
    // 日誌管理
    DIARY: {
      LIST: '/diary-entries',
      CREATE: '/diary-entries',
      GET: (id: string) => `/diary-entries/${id}`,
      UPDATE: (id: string) => `/diary-entries/${id}`,
      DELETE: (id: string) => `/diary-entries/${id}`,
      BY_DOG: (dogId: string) => `/dogs/${dogId}/diary-entries`,
      BY_DATE: (date: string) => `/diary-entries?date=${date}`,
    },
    
    // 健康記録
    HEALTH: {
      LIST: '/health-records',
      CREATE: '/health-records',
      GET: (id: string) => `/health-records/${id}`,
      UPDATE: (id: string) => `/health-records/${id}`,
      DELETE: (id: string) => `/health-records/${id}`,
      BY_DOG: (dogId: string) => `/dogs/${dogId}/health-records`,
    },
    
    // 食事記録
    MEALS: {
      LIST: '/meals',
      CREATE: '/meals',
      GET: (id: string) => `/meals/${id}`,
      UPDATE: (id: string) => `/meals/${id}`,
      DELETE: (id: string) => `/meals/${id}`,
      BY_DOG: (dogId: string) => `/dogs/${dogId}/meals`,
    },
    
    // 犬種マスターデータ
    BREEDS: {
      LIST: '/breeds',
    },
    
    // 設定・マスターデータ
    SETTINGS: {
      SERVICE_TYPES: '/settings/service-types',
      BEHAVIOR_OPTIONS: '/settings/behavior-options',
      EVALUATION_OPTIONS: '/settings/evaluation-options',
    }
  },
  
  // デフォルトヘッダー
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  
  // タイムアウト設定
  TIMEOUT: 10000, // 10秒
} as const

// 環境判定
export const IS_DEVELOPMENT = process.env.NODE_ENV === 'development'
export const IS_PRODUCTION = process.env.NODE_ENV === 'production'

// API使用可能性チェック（開発中はモックデータを使用）
export const USE_MOCK_DATA = IS_DEVELOPMENT && !process.env.NEXT_PUBLIC_API_URL
