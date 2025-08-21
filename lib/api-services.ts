import { 
  apiClient, 
  createMockResponse, 
  createMockPaginatedResponse,
  ApiResponse,
  PaginatedResponse 
} from './api-client'
import { API_CONFIG, USE_MOCK_DATA } from './api-config'
import {
  User,
  CreateUserRequest,
  UpdateUserRequest,
  Owner,
  CreateOwnerRequest,
  UpdateOwnerRequest,
  OwnerSearchParams,
  Dog,
  CreateDogRequest,
  UpdateDogRequest,
  DogSearchParams,
  Booking,
  CreateBookingRequest,
  UpdateBookingRequest,
  BookingSearchParams,
  DiaryEntry,
  CreateDiaryEntryRequest,
  UpdateDiaryEntryRequest,
  HealthRecord,
  CreateHealthRecordRequest,
  UpdateHealthRecordRequest,
  Meal,
  CreateMealRequest,
  UpdateMealRequest,
  DogEvaluation,
  CreateDogEvaluationRequest,
  Breed,
  ServiceType,
  BehaviorOption,
  EvaluationOption,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
} from './types'

// モックデータのインポート（既存のmockデータを利用）
import { mockOwners } from './mock-data/owners'
import { mockDogs } from './mock-data/dogs'
import { mockBookings } from './mock-data/bookings'
import { mockUsers } from './mock-data/users'

// 認証サービス
export class AuthService {
  static async login(credentials: LoginRequest): Promise<ApiResponse<LoginResponse>> {
    if (USE_MOCK_DATA) {
      // モックデータでの認証
      const user = mockUsers.find(u => u.email === credentials.email)
      if (user) {
        return createMockResponse({
          access_token: 'mock_token_' + Date.now(),
          token_type: 'Bearer',
          expires_in: 3600,
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            status: '有効' as const,
            role: user.role === 'user' ? '利用者' as const : 
                  user.role === 'admin' ? '管理者' as const : 'スーパー管理者' as const,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          }
        })
      }
      return createMockResponse(null, 1000).then(() => ({
        success: false,
        error: 'Invalid credentials'
      }))
    }

    return apiClient.post<LoginResponse>(API_CONFIG.ENDPOINTS.AUTH.LOGIN, credentials)
  }

  static async register(userData: RegisterRequest): Promise<ApiResponse<User>> {
    if (USE_MOCK_DATA) {
      const newUser: User = {
        id: `mock_${Date.now()}`,
        name: userData.name,
        email: userData.email,
        status: '有効',
        role: '利用者',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
      return createMockResponse(newUser)
    }

    return apiClient.post<User>(API_CONFIG.ENDPOINTS.AUTH.REGISTER, userData)
  }

  static async logout(): Promise<ApiResponse<null>> {
    if (USE_MOCK_DATA) {
      return createMockResponse(null, 200)
    }

    return apiClient.post<null>(API_CONFIG.ENDPOINTS.AUTH.LOGOUT)
  }
}

// ユーザーサービス
export class UserService {
  static async getUsers(): Promise<PaginatedResponse<User>> {
    if (USE_MOCK_DATA) {
      const users: User[] = mockUsers.map(user => ({
        id: user.id,
        name: user.name,
        email: user.email,
        status: '有効',
        role: user.role === 'user' ? '利用者' : 
              user.role === 'admin' ? '管理者' : 'スーパー管理者',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }))
      return createMockPaginatedResponse(users)
    }

    const response = await apiClient.get<User[]>(API_CONFIG.ENDPOINTS.USERS.LIST)
    return response as PaginatedResponse<User>
  }

  static async createUser(userData: CreateUserRequest): Promise<ApiResponse<User>> {
    if (USE_MOCK_DATA) {
      const newUser: User = {
        id: `mock_${Date.now()}`,
        ...userData,
        status: '有効',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
      return createMockResponse(newUser)
    }

    return apiClient.post<User>(API_CONFIG.ENDPOINTS.USERS.CREATE, userData)
  }

  static async getUser(id: string): Promise<ApiResponse<User>> {
    if (USE_MOCK_DATA) {
      const user = mockUsers.find(u => u.id === id)
      if (user) {
        const mappedUser: User = {
          id: user.id,
          name: user.name,
          email: user.email,
          status: '有効',
          role: user.role === 'user' ? '利用者' : 
                user.role === 'admin' ? '管理者' : 'スーパー管理者',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }
        return createMockResponse(mappedUser)
      }
      return createMockResponse(null).then(() => ({ success: false, error: 'User not found' }))
    }

    return apiClient.get<User>(API_CONFIG.ENDPOINTS.USERS.GET(id))
  }

  static async updateUser(id: string, userData: UpdateUserRequest): Promise<ApiResponse<User>> {
    if (USE_MOCK_DATA) {
      const user = mockUsers.find(u => u.id === id)
      if (user) {
        const updatedUser: User = {
          id: user.id,
          name: userData.name || user.name,
          email: userData.email || user.email,
          status: userData.status || '有効',
          role: userData.role || (user.role === 'user' ? '利用者' : 
                                 user.role === 'admin' ? '管理者' : 'スーパー管理者'),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }
        return createMockResponse(updatedUser)
      }
      return createMockResponse(null).then(() => ({ success: false, error: 'User not found' }))
    }

    return apiClient.put<User>(API_CONFIG.ENDPOINTS.USERS.UPDATE(id), userData)
  }

  static async deleteUser(id: string): Promise<ApiResponse<null>> {
    if (USE_MOCK_DATA) {
      return createMockResponse(null)
    }

    return apiClient.delete<null>(API_CONFIG.ENDPOINTS.USERS.DELETE(id))
  }
}

// 飼い主サービス
export class OwnerService {
  static async getOwners(params?: OwnerSearchParams): Promise<PaginatedResponse<Owner>> {
    if (USE_MOCK_DATA) {
      let owners = mockOwners
      
      if (params?.q) {
        const query = params.q.toLowerCase()
        owners = owners.filter(owner => 
          owner.name.toLowerCase().includes(query) ||
          owner.email.toLowerCase().includes(query) ||
          (owner.phone && owner.phone.includes(query))
        )
      }
      
      return createMockPaginatedResponse(owners, params?.page, params?.limit)
    }

    const queryParams = new URLSearchParams()
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, String(value))
        }
      })
    }

    const endpoint = `${API_CONFIG.ENDPOINTS.OWNERS.LIST}?${queryParams.toString()}`
    const response = await apiClient.get<Owner[]>(endpoint)
    return response as PaginatedResponse<Owner>
  }

  static async createOwner(ownerData: CreateOwnerRequest): Promise<ApiResponse<Owner>> {
    if (USE_MOCK_DATA) {
      const newOwner: Owner = {
        id: `mock_${Date.now()}`,
        ...ownerData,
        created_at: new Date().toISOString(),
      }
      return createMockResponse(newOwner)
    }

    return apiClient.post<Owner>(API_CONFIG.ENDPOINTS.OWNERS.CREATE, ownerData)
  }

  static async getOwner(id: string): Promise<ApiResponse<Owner>> {
    if (USE_MOCK_DATA) {
      const owner = mockOwners.find(o => o.id === id)
      return owner ? createMockResponse(owner) : 
        createMockResponse(null).then(() => ({ success: false, error: 'Owner not found' }))
    }

    return apiClient.get<Owner>(API_CONFIG.ENDPOINTS.OWNERS.GET(id))
  }

  static async updateOwner(id: string, ownerData: UpdateOwnerRequest): Promise<ApiResponse<Owner>> {
    if (USE_MOCK_DATA) {
      const owner = mockOwners.find(o => o.id === id)
      if (owner) {
        const updatedOwner: Owner = {
          ...owner,
          ...ownerData,
        }
        return createMockResponse(updatedOwner)
      }
      return createMockResponse(null).then(() => ({ success: false, error: 'Owner not found' }))
    }

    return apiClient.put<Owner>(API_CONFIG.ENDPOINTS.OWNERS.UPDATE(id), ownerData)
  }

  static async deleteOwner(id: string): Promise<ApiResponse<null>> {
    if (USE_MOCK_DATA) {
      return createMockResponse(null)
    }

    return apiClient.delete<null>(API_CONFIG.ENDPOINTS.OWNERS.DELETE(id))
  }

  static async searchOwners(query: string): Promise<ApiResponse<Owner[]>> {
    if (USE_MOCK_DATA) {
      const filtered = mockOwners.filter(owner =>
        owner.name.toLowerCase().includes(query.toLowerCase()) ||
        owner.email.toLowerCase().includes(query.toLowerCase()) ||
        (owner.phone && owner.phone.includes(query))
      )
      return createMockResponse(filtered)
    }

    return apiClient.get<Owner[]>(`${API_CONFIG.ENDPOINTS.OWNERS.SEARCH}?q=${encodeURIComponent(query)}`)
  }
}

// 犬サービス
export class DogService {
  static async getDogs(params?: DogSearchParams): Promise<PaginatedResponse<Dog>> {
    if (USE_MOCK_DATA) {
      let dogs = mockDogs
      
      if (params?.q) {
        const query = params.q.toLowerCase()
        dogs = dogs.filter(dog => 
          dog.name.toLowerCase().includes(query) ||
          (dog.breed && dog.breed.toLowerCase().includes(query))
        )
      }
      
      if (params?.breed) {
        dogs = dogs.filter(dog => dog.breed === params.breed)
      }
      
      if (params?.owner_id) {
        dogs = dogs.filter(dog => dog.owner_id === params.owner_id)
      }
      
      return createMockPaginatedResponse(dogs, params?.page, params?.limit)
    }

    const queryParams = new URLSearchParams()
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, String(value))
        }
      })
    }

    const endpoint = `${API_CONFIG.ENDPOINTS.DOGS.LIST}?${queryParams.toString()}`
    const response = await apiClient.get<Dog[]>(endpoint)
    return response as PaginatedResponse<Dog>
  }

  static async createDog(dogData: CreateDogRequest): Promise<ApiResponse<Dog>> {
    if (USE_MOCK_DATA) {
      const newDog: Dog = {
        id: `mock_${Date.now()}`,
        ...dogData,
      }
      return createMockResponse(newDog)
    }

    return apiClient.post<Dog>(API_CONFIG.ENDPOINTS.DOGS.CREATE, dogData)
  }

  static async getDog(id: string): Promise<ApiResponse<Dog>> {
    if (USE_MOCK_DATA) {
      const dog = mockDogs.find(d => d.id === id)
      return dog ? createMockResponse(dog) : 
        createMockResponse(null).then(() => ({ success: false, error: 'Dog not found' }))
    }

    return apiClient.get<Dog>(API_CONFIG.ENDPOINTS.DOGS.GET(id))
  }

  static async updateDog(id: string, dogData: UpdateDogRequest): Promise<ApiResponse<Dog>> {
    if (USE_MOCK_DATA) {
      const dog = mockDogs.find(d => d.id === id)
      if (dog) {
        const updatedDog: Dog = {
          ...dog,
          ...dogData,
        }
        return createMockResponse(updatedDog)
      }
      return createMockResponse(null).then(() => ({ success: false, error: 'Dog not found' }))
    }

    return apiClient.put<Dog>(API_CONFIG.ENDPOINTS.DOGS.UPDATE(id), dogData)
  }

  static async deleteDog(id: string): Promise<ApiResponse<null>> {
    if (USE_MOCK_DATA) {
      return createMockResponse(null)
    }

    return apiClient.delete<null>(API_CONFIG.ENDPOINTS.DOGS.DELETE(id))
  }

  static async getDogsByOwner(ownerId: string): Promise<ApiResponse<Dog[]>> {
    if (USE_MOCK_DATA) {
      const dogs = mockDogs.filter(dog => dog.owner_id === ownerId)
      return createMockResponse(dogs)
    }

    return apiClient.get<Dog[]>(API_CONFIG.ENDPOINTS.DOGS.BY_OWNER(ownerId))
  }
}

// 予約サービス
export class BookingService {
  static async getBookings(params?: BookingSearchParams): Promise<PaginatedResponse<Booking>> {
    if (USE_MOCK_DATA) {
      let bookings = mockBookings
      
      if (params?.date) {
        bookings = bookings.filter(booking => booking.booking_date === params.date)
      }
      
      if (params?.status) {
        bookings = bookings.filter(booking => booking.status === params.status)
      }
      
      if (params?.service_type) {
        bookings = bookings.filter(booking => booking.service_type === params.service_type)
      }
      
      return createMockPaginatedResponse(bookings, params?.page, params?.limit)
    }

    const queryParams = new URLSearchParams()
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, String(value))
        }
      })
    }

    const endpoint = `${API_CONFIG.ENDPOINTS.BOOKINGS.LIST}?${queryParams.toString()}`
    const response = await apiClient.get<Booking[]>(endpoint)
    return response as PaginatedResponse<Booking>
  }

  static async createBooking(bookingData: CreateBookingRequest): Promise<ApiResponse<Booking>> {
    if (USE_MOCK_DATA) {
      const newBooking: Booking = {
        id: `mock_${Date.now()}`,
        ...bookingData,
        status: '受付中',
        payment_status: '未払い',
      }
      return createMockResponse(newBooking)
    }

    return apiClient.post<Booking>(API_CONFIG.ENDPOINTS.BOOKINGS.CREATE, bookingData)
  }

  static async getBooking(id: string): Promise<ApiResponse<Booking>> {
    if (USE_MOCK_DATA) {
      const booking = mockBookings.find(b => b.id === id)
      return booking ? createMockResponse(booking) : 
        createMockResponse(null).then(() => ({ success: false, error: 'Booking not found' }))
    }

    return apiClient.get<Booking>(API_CONFIG.ENDPOINTS.BOOKINGS.GET(id))
  }

  static async updateBooking(id: string, bookingData: UpdateBookingRequest): Promise<ApiResponse<Booking>> {
    if (USE_MOCK_DATA) {
      const booking = mockBookings.find(b => b.id === id)
      if (booking) {
        const updatedBooking: Booking = {
          ...booking,
          ...bookingData,
        }
        return createMockResponse(updatedBooking)
      }
      return createMockResponse(null).then(() => ({ success: false, error: 'Booking not found' }))
    }

    return apiClient.put<Booking>(API_CONFIG.ENDPOINTS.BOOKINGS.UPDATE(id), bookingData)
  }

  static async deleteBooking(id: string): Promise<ApiResponse<null>> {
    if (USE_MOCK_DATA) {
      return createMockResponse(null)
    }

    return apiClient.delete<null>(API_CONFIG.ENDPOINTS.BOOKINGS.DELETE(id))
  }

  // 今日の予約を取得
  static async getTodayBookings(): Promise<ApiResponse<Booking[]>> {
    const today = new Date().toISOString().split('T')[0] // YYYY-MM-DD format
    
    if (USE_MOCK_DATA) {
      const todayBookings = mockBookings.filter(booking => {
        // booking_dateがYYYY-MM-DD形式の場合の比較
        const bookingDate = booking.booking_date.split('T')[0]
        return bookingDate === today
      })
      return createMockResponse(todayBookings)
    }

    return this.getBookings({ date: today }).then(response => {
      if (response.success && response.data) {
        // PaginatedResponseの場合はitemsプロパティ、通常のApiResponseの場合はdataを使用
        const bookings = Array.isArray(response.data) ? response.data : (response.data as any).items || []
        return createMockResponse(bookings)
      }
      return createMockResponse([])
    })
  }

  // 次回の予約を取得
  static async getNextBooking(): Promise<ApiResponse<Booking | null>> {
    const today = new Date().toISOString().split('T')[0] // YYYY-MM-DD format
    
    if (USE_MOCK_DATA) {
      // 今日以降の予約を取得し、日付順でソート
      const futureBookings = mockBookings
        .filter(booking => {
          const bookingDate = booking.booking_date.split('T')[0]
          return bookingDate >= today
        })
        .sort((a, b) => {
          const dateA = a.booking_date.split('T')[0]
          const dateB = b.booking_date.split('T')[0]
          return dateA.localeCompare(dateB)
        })
      
      const nextBooking = futureBookings.length > 0 ? futureBookings[0] : null
      return createMockResponse(nextBooking)
    }

    // 実際のAPIでは今日以降の最初の予約を取得
    return this.getBookings().then(response => {
      if (response.success && response.data) {
        const bookings = Array.isArray(response.data) ? response.data : (response.data as any).items || []
        // クライアントサイドで今日以降の予約をフィルタリング
        const futureBookings = (bookings as Booking[]).filter((booking: Booking) => {
          const bookingDate = booking.booking_date.split('T')[0]
          return bookingDate >= today
        }).sort((a: Booking, b: Booking) => {
          const dateA = a.booking_date.split('T')[0]
          const dateB = b.booking_date.split('T')[0]
          return dateA.localeCompare(dateB)
        })
        const nextBooking = futureBookings.length > 0 ? futureBookings[0] : null
        return createMockResponse(nextBooking)
      }
      return createMockResponse(null)
    })
  }
}

// その他のサービスクラス（DiaryService, HealthService, MealService等）は
// 同様のパターンで実装...

// マスターデータサービス
export class MasterDataService {
  static async getBreeds(): Promise<ApiResponse<Breed[]>> {
    if (USE_MOCK_DATA) {
      const breeds: Breed[] = [
        { id: '1', name: 'トイプードル' },
        { id: '2', name: 'チワワ' },
        { id: '3', name: 'ダックスフンド' },
        { id: '4', name: 'ポメラニアン' },
        { id: '5', name: 'ヨークシャーテリア' },
        { id: '6', name: 'マルチーズ' },
        { id: '7', name: 'シーズー' },
        { id: '8', name: 'フレンチブルドッグ' },
        { id: '9', name: '柴犬' },
        { id: '10', name: 'ゴールデンレトリバー' },
        { id: '11', name: 'ラブラドールレトリバー' },
        { id: '12', name: 'ボーダーコリー' },
        { id: '13', name: 'その他' },
      ]
      return createMockResponse(breeds)
    }

    return apiClient.get<Breed[]>(API_CONFIG.ENDPOINTS.BREEDS.LIST)
  }

  static async getServiceTypes(): Promise<ApiResponse<ServiceType[]>> {
    if (USE_MOCK_DATA) {
      const serviceTypes: ServiceType[] = [
        { id: '1', name: '体験', description: '初回体験コース', price: 2000 },
        { id: '2', name: '保育園', description: '一日保育', price: 5000 },
        { id: '3', name: 'イベント', description: '特別イベント', price: 3000 },
        { id: '4', name: 'その他', description: 'その他サービス' },
      ]
      return createMockResponse(serviceTypes)
    }

    return apiClient.get<ServiceType[]>(API_CONFIG.ENDPOINTS.SETTINGS.SERVICE_TYPES)
  }

  static async getBehaviorOptions(): Promise<ApiResponse<BehaviorOption[]>> {
    if (USE_MOCK_DATA) {
      const behaviorOptions: BehaviorOption[] = [
        { value: 'barking', label: '要求吠え', category: 'excited' },
        { value: 'jumping', label: '飛びつき', category: 'excited' },
        { value: 'biting', label: '甘噛み', category: 'excited' },
        { value: 'mounting', label: 'マウンティング', category: 'excited' },
        { value: 'running', label: '走り回る', category: 'excited' },
        { value: 'chasing', label: '他の犬を執拗に追いかける', category: 'excited' },
        { value: 'crate', label: 'ハウス/クレートでの休息', category: 'cooldown' },
        { value: 'toys', label: '知育トイ/ノーズワーク', category: 'cooldown' },
        { value: 'massage', label: 'マッサージ/撫でる', category: 'cooldown' },
        { value: 'isolation', label: '他の犬から隔離し、静かな場所で休ませる', category: 'cooldown' },
        { value: 'commands', label: 'コマンドでの指示（ふせ、まて）', category: 'cooldown' },
      ]
      return createMockResponse(behaviorOptions)
    }

    return apiClient.get<BehaviorOption[]>(API_CONFIG.ENDPOINTS.SETTINGS.BEHAVIOR_OPTIONS)
  }

  static async getEvaluationOptions(): Promise<ApiResponse<EvaluationOption[]>> {
    if (USE_MOCK_DATA) {
      const evaluationOptions: EvaluationOption[] = [
        { value: 'high', label: '高い', type: 'energy_level' },
        { value: 'medium', label: '普通', type: 'energy_level' },
        { value: 'low', label: '低い', type: 'energy_level' },
        { value: 'friendly', label: 'フレンドリー', type: 'personality' },
        { value: 'playful', label: '遊び好き', type: 'personality' },
        { value: 'calm', label: '穏やか', type: 'personality' },
        { value: 'cautious', label: '慎重派', type: 'personality' },
        { value: 'independent', label: 'マイペース', type: 'personality' },
        { value: 'passive', label: '受け身', type: 'personality' },
        { value: 'avoidant', label: 'やや苦手', type: 'personality' },
      ]
      return createMockResponse(evaluationOptions)
    }

    return apiClient.get<EvaluationOption[]>(API_CONFIG.ENDPOINTS.SETTINGS.EVALUATION_OPTIONS)
  }
}

// イベント関連の型定義
export interface Event {
  id: string
  title: string
  category: string
  description: string
  date: string
  startTime: string
  endTime: string
  location: string
  organizer: string
  price: string
  customPrice?: string
  image?: string
  details: string
  benefits: string[]
  target: string[]
  status: 'draft' | 'published' | 'archived'
  createdAt: string
  updatedAt: string
}

export interface CreateEventRequest {
  title: string
  category: string
  description: string
  date: string
  startTime: string
  endTime: string
  location: string
  organizer: string
  price: string
  customPrice?: string
  image?: string
  details: string
  benefits: string[]
  target: string[]
  status: 'draft' | 'published' | 'archived'
}

export interface UpdateEventRequest extends Partial<CreateEventRequest> {}

export interface EventSearchParams {
  category?: string
  status?: 'draft' | 'published' | 'archived'
  startDate?: string
  endDate?: string
  search?: string
  page?: number
  limit?: number
}

// イベントサービス
export class EventService {
  static async getEvents(params?: EventSearchParams): Promise<PaginatedResponse<Event>> {
    if (USE_MOCK_DATA) {
      // モックイベントデータ
      const mockEvents: Event[] = [
        {
          id: '1',
          title: 'ユニ・チャーム協業イベント',
          category: 'health',
          description: '愛犬の健康ケア体験会',
          date: '2024-08-20',
          startTime: '14:00',
          endTime: '16:00',
          location: 'FC今治 里山ドッグラン',
          organizer: 'ユニ・チャーム × FC今治',
          price: 'free',
          image: '/images/fcimabari_20240621104218_7.jpg',
          details: 'ペットの健康管理について学ぶ体験会です。',
          benefits: ['trial-pack'],
          target: ['all-dogs', 'beginners'],
          status: 'published',
          createdAt: '2024-08-15T10:00:00Z',
          updatedAt: '2024-08-15T10:00:00Z'
        },
        {
          id: '2',
          title: 'アジリティ体験会',
          category: 'sports',
          description: '初心者向けドッグスポーツ',
          date: '2024-08-25',
          startTime: '10:00',
          endTime: '12:00',
          location: 'FC今治 里山ドッグラン',
          organizer: 'FC今治',
          price: '2000',
          details: 'アジリティの基本を学ぶ初心者向けの体験会です。',
          benefits: ['photo-service'],
          target: ['all-dogs', 'beginners'],
          status: 'published',
          createdAt: '2024-08-15T11:00:00Z',
          updatedAt: '2024-08-15T11:00:00Z'
        },
        {
          id: '3',
          title: 'しまなみ散歩会',
          category: 'outdoor',
          description: '愛犬と楽しむ自然散策',
          date: '2024-08-28',
          startTime: '09:00',
          endTime: '11:00',
          location: 'しまなみ海道周辺',
          organizer: '今治市観光協会',
          price: '1500',
          details: 'しまなみの自然を愛犬と一緒に楽しみましょう。',
          benefits: ['gift'],
          target: ['all-dogs'],
          status: 'published',
          createdAt: '2024-08-15T12:00:00Z',
          updatedAt: '2024-08-15T12:00:00Z'
        },
        {
          id: '4',
          title: 'ペット防災セミナー',
          category: 'education',
          description: 'もしもの時に備えて',
          date: '2024-09-03',
          startTime: '19:00',
          endTime: '20:30',
          location: '今治市民館',
          organizer: '今治市役所',
          price: 'free',
          details: 'ペットと一緒の防災について学びます。',
          benefits: [],
          target: ['all-dogs'],
          status: 'published',
          createdAt: '2024-08-15T13:00:00Z',
          updatedAt: '2024-08-15T13:00:00Z'
        }
      ]

      // フィルタリング
      let filteredEvents = mockEvents
      if (params?.category) {
        filteredEvents = filteredEvents.filter(event => event.category === params.category)
      }
      if (params?.status) {
        filteredEvents = filteredEvents.filter(event => event.status === params.status)
      }
      if (params?.search) {
        const searchLower = params.search.toLowerCase()
        filteredEvents = filteredEvents.filter(event => 
          event.title.toLowerCase().includes(searchLower) ||
          event.description.toLowerCase().includes(searchLower) ||
          event.organizer.toLowerCase().includes(searchLower)
        )
      }

      return createMockPaginatedResponse(filteredEvents, params?.page, params?.limit)
    }

    const queryParams = new URLSearchParams()
    if (params?.category) queryParams.append('category', params.category)
    if (params?.status) queryParams.append('status', params.status)
    if (params?.startDate) queryParams.append('startDate', params.startDate)
    if (params?.endDate) queryParams.append('endDate', params.endDate)
    if (params?.search) queryParams.append('search', params.search)
    if (params?.page) queryParams.append('page', params.page.toString())
    if (params?.limit) queryParams.append('limit', params.limit.toString())

    const response = await apiClient.get<Event[]>(
      `${API_CONFIG.ENDPOINTS.EVENTS.BASE}?${queryParams.toString()}`
    )
    // ApiResponseをPaginatedResponseに変換
    return {
      success: true,
      data: response.data || [],
      pagination: {
        page: params?.page || 1,
        limit: params?.limit || 10,
        total: response.data?.length || 0,
        totalPages: Math.ceil((response.data?.length || 0) / (params?.limit || 10))
      }
    }
  }

  static async getEvent(id: string): Promise<ApiResponse<Event>> {
    if (USE_MOCK_DATA) {
      const event = (await this.getEvents()).data?.find(e => e.id === id)
      if (!event) {
        throw new Error(`Event with id ${id} not found`)
      }
      return createMockResponse(event)
    }

    return apiClient.get<Event>(`${API_CONFIG.ENDPOINTS.EVENTS.BASE}/${id}`)
  }

  static async createEvent(data: CreateEventRequest): Promise<ApiResponse<Event>> {
    if (USE_MOCK_DATA) {
      const newEvent: Event = {
        id: Math.random().toString(36).substring(7),
        ...data,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      return createMockResponse(newEvent)
    }

    return apiClient.post<Event>(API_CONFIG.ENDPOINTS.EVENTS.BASE, data)
  }

  static async updateEvent(id: string, data: UpdateEventRequest): Promise<ApiResponse<Event>> {
    if (USE_MOCK_DATA) {
      const existingEvent = (await this.getEvent(id)).data
      if (!existingEvent) {
        throw new Error(`Event with id ${id} not found`)
      }
      
      const updatedEvent: Event = {
        ...existingEvent,
        ...data,
        updatedAt: new Date().toISOString()
      }
      return createMockResponse(updatedEvent)
    }

    return apiClient.put<Event>(`${API_CONFIG.ENDPOINTS.EVENTS.BASE}/${id}`, data)
  }

  static async deleteEvent(id: string): Promise<ApiResponse<void>> {
    if (USE_MOCK_DATA) {
      return createMockResponse(undefined)
    }

    return apiClient.delete<void>(`${API_CONFIG.ENDPOINTS.EVENTS.BASE}/${id}`)
  }
}
