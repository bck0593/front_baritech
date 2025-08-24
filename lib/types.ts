// データベースのテーブル構造に対応した型定義

// ユーザー関連
export interface User {
  id: string
  name: string
  email: string
  status: '有効' | '無効' | '停止'
  role: '利用者' | '管理者' | 'スーパー管理者'
  created_at: string
  updated_at: string
}

export interface CreateUserRequest {
  name: string
  email: string
  password: string
  role: '利用者' | '管理者' | 'スーパー管理者'
}

export interface UpdateUserRequest {
  name?: string
  email?: string
  status?: '有効' | '無効' | '停止'
  role?: '利用者' | '管理者' | 'スーパー管理者'
}

// 飼い主関連
export interface Owner {
  id: string
  name: string
  email: string
  phone?: string
  avatar?: string
  created_at: string
}

export interface CreateOwnerRequest {
  name: string
  email: string
  phone?: string
  avatar?: string
}

export interface UpdateOwnerRequest {
  name?: string
  email?: string
  phone?: string
  avatar?: string
}

// 犬関連
export interface Dog {
  id: string
  owner_id: string
  name: string
  breed?: string
  sex?: string
  birthdate?: string
  avatar?: string
  notes?: string
  // 関連データ
  owner?: Owner
}

export interface CreateDogRequest {
  owner_id: string
  name: string
  breed?: string
  sex?: string
  birthdate?: string
  avatar?: string
  notes?: string
}

export interface UpdateDogRequest {
  name?: string
  breed?: string
  sex?: string
  birthdate?: string
  avatar?: string
  notes?: string
}

// 予約関連
export interface Booking {
  id: string
  owner_id: string
  dog_id: string
  service_type: '体験' | '保育園' | 'イベント' | 'その他'
  booking_date: string
  booking_time: string
  status: '受付中' | '確定' | '完了' | '取消'
  amount?: number
  payment_status: '未払い' | '支払い済み' | '返金済み'
  memo?: string
  // 関連データ
  owner?: Owner
  dog?: Dog
}

export interface CreateBookingRequest {
  owner_id: string
  dog_id: string
  service_type: '体験' | '保育園' | 'イベント' | 'その他'
  booking_date: string
  booking_time: string
  amount?: number
  memo?: string
}

export interface UpdateBookingRequest {
  booking_date?: string
  booking_time?: string
  status?: '受付中' | '確定' | '完了' | '取消'
  amount?: number
  payment_status?: '未払い' | '支払い済み' | '返金済み'
  memo?: string
}

// 日誌関連
export interface DiaryEntry {
  id: string
  dog_id: string
  entry_date: string
  note?: string
  photos_json?: string
  mood?: 'うれしい' | 'ふつう' | 'つかれた' | '体調不良'
  author_user_id: string
  // 関連データ
  dog?: Dog
  author?: User
}

export interface CreateDiaryEntryRequest {
  dog_id: string
  entry_date: string
  note?: string
  photos_json?: string
  mood?: 'うれしい' | 'ふつう' | 'つかれた' | '体調不良'
}

export interface UpdateDiaryEntryRequest {
  note?: string
  photos_json?: string
  mood?: 'うれしい' | 'ふつう' | 'つかれた' | '体調不良'
}

// 健康記録関連
export interface HealthRecord {
  id: string
  dog_id: string
  record_date: string
  weight_kg?: number
  temperature_c?: number
  notes?: string
  // 関連データ
  dog?: Dog
}

export interface CreateHealthRecordRequest {
  dog_id: string
  record_date: string
  weight_kg?: number
  temperature_c?: number
  notes?: string
}

export interface UpdateHealthRecordRequest {
  weight_kg?: number
  temperature_c?: number
  notes?: string
}

// 食事記録関連
export interface Meal {
  id: string
  dog_id: string
  fed_at: string
  meal_type?: 'ドライ' | 'ウェット' | '手作り' | 'おやつ'
  amount_g?: number
  brand?: string
  notes?: string
  // 関連データ
  dog?: Dog
}

export interface CreateMealRequest {
  dog_id: string
  fed_at: string
  meal_type?: 'ドライ' | 'ウェット' | '手作り' | 'おやつ'
  amount_g?: number
  brand?: string
  notes?: string
}

export interface UpdateMealRequest {
  meal_type?: 'ドライ' | 'ウェット' | '手作り' | 'おやつ'
  amount_g?: number
  brand?: string
  notes?: string
}

// 認証関連
export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  access_token: string
  token_type: string
  expires_in: number
  user: User
}

export interface RegisterRequest {
  name: string
  email: string
  password: string
}

// 検索・フィルター関連
export interface SearchParams {
  q?: string
  page?: number
  limit?: number
  sort_by?: string
  sort_order?: 'asc' | 'desc'
}

export interface OwnerSearchParams extends SearchParams {
  status?: string
}

export interface DogSearchParams extends SearchParams {
  breed?: string
  owner_id?: string
}

export interface BookingSearchParams extends SearchParams {
  date?: string
  status?: '受付中' | '確定' | '完了' | '取消'
  service_type?: '体験' | '保育園' | 'イベント' | 'その他'
}

// マスターデータ関連
export interface Breed {
  id: string
  name: string
  category?: string
}

export interface ServiceType {
  id: string
  name: string
  description?: string
  price?: number
}

// 設定・評価関連のオプション（現在ハードコーディングされているもの）
export interface BehaviorOption {
  value: string
  label: string
  category: string
}

export interface EvaluationOption {
  value: string
  label: string
  type: string
}

// 犬の評価データ（contact-book, evaluation用）
export interface DogEvaluation {
  id: string
  dog_id: string
  energy_level?: string
  personality_traits: string[]
  greeting_style: string[]
  excited_behaviors: string[]
  cooldown_methods: string[]
  preferred_dog_types: string[]
  disliked_dog_types: string[]
  body_handling: Record<string, string>
  notes?: string
  created_at: string
  updated_at: string
}

export interface CreateDogEvaluationRequest {
  dog_id: string
  energy_level?: string
  personality_traits: string[]
  greeting_style: string[]
  excited_behaviors: string[]
  cooldown_methods: string[]
  preferred_dog_types: string[]
  disliked_dog_types: string[]
  body_handling: Record<string, string>
  notes?: string
}

// イベント関連
export interface Event {
  id: string
  title: string
  description: string
  date: string
  startTime: string
  endTime: string
  location: string
  organizer: string
  category: string
  price: string | number
  status: string
  image?: string
  details: string
  benefits?: string[]
  target?: string[]
  createdAt: string
  updatedAt: string
}

export interface CreateEventRequest {
  title: string
  description: string
  date: string
  startTime: string
  endTime: string
  location: string
  organizer: string
  category: string
  price: string | number
  image?: string
  details: string
  benefits?: string[]
  target?: string[]
}

export interface UpdateEventRequest {
  title?: string
  description?: string
  date?: string
  startTime?: string
  endTime?: string
  location?: string
  organizer?: string
  category?: string
  price?: string | number
  status?: string
  image?: string
  details?: string
  benefits?: string[]
  target?: string[]
}

export interface EventSearchParams {
  category?: string
  status?: string
  startDate?: string
  endDate?: string
  search?: string
  page?: number
  limit?: number
}
