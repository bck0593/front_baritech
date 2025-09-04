// API設定とベースURL管理
export const API_CONFIG = {
  // FastAPI バックエンドのベースURL（環境変数から取得）
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
  
  // 各エンドポイントの定義（バックエンド構造に合わせて修正）
  ENDPOINTS: {
    // 認証関連 - /api/v1/auth
    AUTH: {
      LOGIN: '/api/v1/auth/login',
      REGISTER: '/api/v1/auth/register',
      ME: '/api/v1/auth/me',
      LOGOUT: '/auth/logout', // フロントエンド側処理
      VERIFY_TOKEN: '/auth/verify-token', // フロントエンド側処理
      REFRESH: '/auth/refresh', // フロントエンド側処理
    },
    
    // ユーザー管理 - 認証情報経由でアクセス
    USERS: {
      LIST: '/api/v1/users',
      CREATE: '/api/v1/users',
      GET: (id: string) => `/api/v1/users/${id}`,
      UPDATE: (id: string) => `/api/v1/users/${id}`,
      DELETE: (id: string) => `/api/v1/users/${id}`,
    },
    
    // 飼い主管理 - バックエンドでは認証済みユーザーの飼い主情報を自動取得
    OWNERS: {
      LIST: '/api/v1/owners',
      CREATE: '/api/v1/owners',
      GET: (id: string) => `/api/v1/owners/${id}`,
      UPDATE: (id: string) => `/api/v1/owners/${id}`,
      DELETE: (id: string) => `/api/v1/owners/${id}`,
      SEARCH: '/api/v1/owners/search',
    },
    
    // 犬管理 - /api/v1/dogs
    DOGS: {
      LIST: '/api/v1/dogs',
      CREATE: '/api/v1/dogs',
      GET: (id: string) => `/api/v1/dogs/${id}`,
      UPDATE: (id: string) => `/api/v1/dogs/${id}`,
      DELETE: (id: string) => `/api/v1/dogs/${id}`,
      BY_OWNER: (ownerId: string) => `/api/v1/dogs?owner_id=${ownerId}`,
      SEARCH: '/api/v1/dogs/search',
    },
    
    // 予約管理 - /api/v1/bookings
    BOOKINGS: {
      LIST: '/api/v1/bookings',
      CREATE: '/api/v1/bookings',
      GET: (id: string) => `/api/v1/bookings/${id}`,
      UPDATE: (id: string) => `/api/v1/bookings/${id}`,
      DELETE: (id: string) => `/api/v1/bookings/${id}`,
      BY_DATE: (date: string) => `/api/v1/bookings?date_from=${date}&date_to=${date}`,
      BY_STATUS: (status: string) => `/api/v1/bookings?status=${status}`,
    },
    
    // 日誌管理 - /api/v1/diary-entries
    DIARY: {
      LIST: '/api/v1/diary-entries',
      CREATE: '/api/v1/diary-entries',
      GET: (id: string) => `/api/v1/diary-entries/${id}`,
      UPDATE: (id: string) => `/api/v1/diary-entries/${id}`,
      DELETE: (id: string) => `/api/v1/diary-entries/${id}`,
      BY_DOG: (dogId: string) => `/api/v1/diary-entries?dog_id=${dogId}`,
      BY_DATE: (date: string) => `/api/v1/diary-entries?date=${date}`,
    },
    
    // 健康記録 - /api/v1/health-records
    HEALTH: {
      LIST: '/api/v1/health-records',
      CREATE: '/api/v1/health-records',
      GET: (id: string) => `/api/v1/health-records/${id}`,
      UPDATE: (id: string) => `/api/v1/health-records/${id}`,
      DELETE: (id: string) => `/api/v1/health-records/${id}`,
      BY_DOG: (dogId: string) => `/api/v1/health-records?dog_id=${dogId}`,
    },
    
    // 食事記録 - /api/v1/meals
    MEALS: {
      LIST: '/api/v1/meals',
      CREATE: '/api/v1/meals',
      GET: (id: string) => `/api/v1/meals/${id}`,
      UPDATE: (id: string) => `/api/v1/meals/${id}`,
      DELETE: (id: string) => `/api/v1/meals/${id}`,
      BY_DOG: (dogId: string) => `/api/v1/meals?dog_id=${dogId}`,
    },
    
    // お散歩イベント - /api/v1/walk-events
    WALK_EVENTS: {
      LIST: '/api/v1/walk-events',
      CREATE: '/api/v1/walk-events',
      GET: (id: string) => `/api/v1/walk-events/${id}`,
      UPDATE: (id: string) => `/api/v1/walk-events/${id}`,
      DELETE: (id: string) => `/api/v1/walk-events/${id}`,
    },
    
    // お散歩参加者 - /api/v1/walk-participants
    WALK_PARTICIPANTS: {
      LIST: '/api/v1/walk-participants',
      CREATE: '/api/v1/walk-participants',
      GET: (id: string) => `/api/v1/walk-participants/${id}`,
      UPDATE: (id: string) => `/api/v1/walk-participants/${id}`,
      DELETE: (id: string) => `/api/v1/walk-participants/${id}`,
      BY_EVENT: (eventId: string) => `/api/v1/walk-participants?walk_event_id=${eventId}`,
    },
    
    // 犬評価 - /api/v1/dog-evaluations
    DOG_EVALUATIONS: {
      LIST: '/api/v1/dog-evaluations',
      CREATE: '/api/v1/dog-evaluations',
      GET: (id: string) => `/api/v1/dog-evaluations/${id}`,
      UPDATE: (id: string) => `/api/v1/dog-evaluations/${id}`,
      DELETE: (id: string) => `/api/v1/dog-evaluations/${id}`,
      BY_DOG: (dogId: string) => `/api/v1/dog-evaluations?dog_id=${dogId}`,
    },
    
    // 投稿 - /api/v1/posts
    POSTS: {
      LIST: '/api/v1/posts',
      CREATE: '/api/v1/posts',
      GET: (id: string) => `/api/v1/posts/${id}`,
      UPDATE: (id: string) => `/api/v1/posts/${id}`,
      DELETE: (id: string) => `/api/v1/posts/${id}`,
    },
    
    // コメント - /api/v1/comments
    COMMENTS: {
      LIST: '/api/v1/comments',
      CREATE: '/api/v1/comments',
      GET: (id: string) => `/api/v1/comments/${id}`,
      UPDATE: (id: string) => `/api/v1/comments/${id}`,
      DELETE: (id: string) => `/api/v1/comments/${id}`,
      BY_POST: (postId: string) => `/api/v1/comments?post_id=${postId}`,
    },
    
    // 通知 - /api/v1/notifications
    NOTIFICATIONS: {
      LIST: '/api/v1/notifications',
      CREATE: '/api/v1/notifications',
      GET: (id: string) => `/api/v1/notifications/${id}`,
      UPDATE: (id: string) => `/api/v1/notifications/${id}`,
      DELETE: (id: string) => `/api/v1/notifications/${id}`,
    },
    
    // ワクチン接種記録 - /api/v1/vaccinations
    VACCINATIONS: {
      LIST: '/api/v1/vaccinations',
      CREATE: '/api/v1/vaccinations',
      GET: (id: string) => `/api/v1/vaccinations/${id}`,
      UPDATE: (id: string) => `/api/v1/vaccinations/${id}`,
      DELETE: (id: string) => `/api/v1/vaccinations/${id}`,
      BY_DOG: (dogId: string) => `/api/v1/vaccinations?dog_id=${dogId}`,
    },
    
    // 寄生虫予防記録 - /api/v1/parasite-preventions
    PARASITE_PREVENTIONS: {
      LIST: '/api/v1/parasite-preventions',
      CREATE: '/api/v1/parasite-preventions',
      GET: (id: string) => `/api/v1/parasite-preventions/${id}`,
      UPDATE: (id: string) => `/api/v1/parasite-preventions/${id}`,
      DELETE: (id: string) => `/api/v1/parasite-preventions/${id}`,
      BY_DOG: (dogId: string) => `/api/v1/parasite-preventions?dog_id=${dogId}`,
    },
    
    // 証明書 - /api/v1/certificates
    CERTIFICATES: {
      LIST: '/api/v1/certificates',
      CREATE: '/api/v1/certificates',
      GET: (id: string) => `/api/v1/certificates/${id}`,
      UPDATE: (id: string) => `/api/v1/certificates/${id}`,
      DELETE: (id: string) => `/api/v1/certificates/${id}`,
      BY_DOG: (dogId: string) => `/api/v1/certificates?dog_id=${dogId}`,
    },
    
    // 犬種マスターデータ（バックエンドにない場合はモックで対応）
    BREEDS: {
      LIST: '/breeds', // フロントエンド側で実装
    },
    
    // イベント管理（投稿システムとして実装）
    EVENTS: {
      BASE: '/api/v1/posts',
      LIST: '/api/v1/posts?type=event',
      CREATE: '/api/v1/posts',
      GET: (id: string) => `/api/v1/posts/${id}`,
      UPDATE: (id: string) => `/api/v1/posts/${id}`,
      DELETE: (id: string) => `/api/v1/posts/${id}`,
      BY_CATEGORY: (category: string) => `/api/v1/posts?category=${category}`,
      BY_STATUS: (status: string) => `/api/v1/posts?status=${status}`,
    },
    
    // 設定・マスターデータ（フロントエンド側で定義）
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
  TIMEOUT: 30000, // 30秒（バックエンドが遅い可能性があるため延長）
} as const

// 環境判定
export const IS_DEVELOPMENT = process.env.NODE_ENV === 'development'
export const IS_PRODUCTION = process.env.NODE_ENV === 'production'

// API使用可能性チェック（開発中はモックデータを使用）
export const USE_MOCK_DATA = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true'

// ヘルスチェックエンドポイント
export const HEALTH_CHECK_ENDPOINT = '/healthz'
