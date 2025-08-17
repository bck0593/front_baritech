import { useState, useEffect } from 'react'
import { 
  OwnerService,
  DogService,
  BookingService,
  UserService,
  MasterDataService,
} from '../lib/api-services'
import { 
  Owner,
  Dog,
  Booking,
  User,
  Breed,
  ServiceType,
  BehaviorOption,
  EvaluationOption,
  OwnerSearchParams,
  DogSearchParams,
  BookingSearchParams,
  CreateOwnerRequest,
  UpdateOwnerRequest,
  CreateDogRequest,
  UpdateDogRequest,
  CreateBookingRequest,
  UpdateBookingRequest,
} from '../lib/types'

// 汎用的なAPI呼び出しフック
export function useApiCall<T>(
  apiCall: () => Promise<{ success: boolean; data?: T; error?: string }>,
  dependencies: any[] = []
) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await apiCall()
      if (response.success && response.data) {
        setData(response.data)
      } else {
        setError(response.error || 'データの取得に失敗しました')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '予期しないエラーが発生しました')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, dependencies)

  return { data, loading, error, refetch: fetchData }
}

// 飼い主関連フック
export function useOwners(params?: OwnerSearchParams) {
  return useApiCall(
    () => OwnerService.getOwners(params),
    [JSON.stringify(params)]
  )
}

export function useOwner(id: string) {
  return useApiCall(
    () => OwnerService.getOwner(id),
    [id]
  )
}

export function useCreateOwner() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const createOwner = async (ownerData: CreateOwnerRequest) => {
    setLoading(true)
    setError(null)

    try {
      const response = await OwnerService.createOwner(ownerData)
      if (response.success) {
        return response.data
      } else {
        setError(response.error || '飼い主の作成に失敗しました')
        return null
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '予期しないエラーが発生しました'
      setError(errorMessage)
      return null
    } finally {
      setLoading(false)
    }
  }

  return { createOwner, loading, error }
}

export function useUpdateOwner() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const updateOwner = async (id: string, ownerData: UpdateOwnerRequest) => {
    setLoading(true)
    setError(null)

    try {
      const response = await OwnerService.updateOwner(id, ownerData)
      if (response.success) {
        return response.data
      } else {
        setError(response.error || '飼い主の更新に失敗しました')
        return null
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '予期しないエラーが発生しました'
      setError(errorMessage)
      return null
    } finally {
      setLoading(false)
    }
  }

  return { updateOwner, loading, error }
}

// 犬関連フック
export function useDogs(params?: DogSearchParams) {
  return useApiCall(
    () => DogService.getDogs(params),
    [JSON.stringify(params)]
  )
}

export function useDog(id: string) {
  return useApiCall(
    () => DogService.getDog(id),
    [id]
  )
}

export function useDogsByOwner(ownerId: string) {
  return useApiCall(
    () => DogService.getDogsByOwner(ownerId),
    [ownerId]
  )
}

export function useCreateDog() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const createDog = async (dogData: CreateDogRequest) => {
    setLoading(true)
    setError(null)

    try {
      const response = await DogService.createDog(dogData)
      if (response.success) {
        return response.data
      } else {
        setError(response.error || '犬の登録に失敗しました')
        return null
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '予期しないエラーが発生しました'
      setError(errorMessage)
      return null
    } finally {
      setLoading(false)
    }
  }

  return { createDog, loading, error }
}

export function useUpdateDog() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const updateDog = async (id: string, dogData: UpdateDogRequest) => {
    setLoading(true)
    setError(null)

    try {
      const response = await DogService.updateDog(id, dogData)
      if (response.success) {
        return response.data
      } else {
        setError(response.error || '犬の情報更新に失敗しました')
        return null
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '予期しないエラーが発生しました'
      setError(errorMessage)
      return null
    } finally {
      setLoading(false)
    }
  }

  return { updateDog, loading, error }
}

// 予約関連フック
export function useBookings(params?: BookingSearchParams) {
  return useApiCall(
    () => BookingService.getBookings(params),
    [JSON.stringify(params)]
  )
}

export function useBooking(id: string) {
  return useApiCall(
    () => BookingService.getBooking(id),
    [id]
  )
}

export function useCreateBooking() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const createBooking = async (bookingData: CreateBookingRequest) => {
    setLoading(true)
    setError(null)

    try {
      const response = await BookingService.createBooking(bookingData)
      if (response.success) {
        return response.data
      } else {
        setError(response.error || '予約の作成に失敗しました')
        return null
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '予期しないエラーが発生しました'
      setError(errorMessage)
      return null
    } finally {
      setLoading(false)
    }
  }

  return { createBooking, loading, error }
}

export function useUpdateBooking() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const updateBooking = async (id: string, bookingData: UpdateBookingRequest) => {
    setLoading(true)
    setError(null)

    try {
      const response = await BookingService.updateBooking(id, bookingData)
      if (response.success) {
        return response.data
      } else {
        setError(response.error || '予約の更新に失敗しました')
        return null
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '予期しないエラーが発生しました'
      setError(errorMessage)
      return null
    } finally {
      setLoading(false)
    }
  }

  return { updateBooking, loading, error }
}

// ユーザー関連フック
export function useUsers() {
  return useApiCall(() => UserService.getUsers())
}

export function useUser(id: string) {
  return useApiCall(
    () => UserService.getUser(id),
    [id]
  )
}

// マスターデータ関連フック
export function useBreeds() {
  return useApiCall(() => MasterDataService.getBreeds())
}

export function useServiceTypes() {
  return useApiCall(() => MasterDataService.getServiceTypes())
}

export function useBehaviorOptions() {
  return useApiCall(() => MasterDataService.getBehaviorOptions())
}

export function useEvaluationOptions() {
  return useApiCall(() => MasterDataService.getEvaluationOptions())
}

// 検索用フック
export function useOwnerSearch() {
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<Owner[]>([])
  const [error, setError] = useState<string | null>(null)

  const searchOwners = async (query: string) => {
    if (!query.trim()) {
      setResults([])
      return
    }

    setLoading(true)
    setError(null)

    try {
      const response = await OwnerService.searchOwners(query)
      if (response.success && response.data) {
        setResults(response.data)
      } else {
        setError(response.error || '検索に失敗しました')
        setResults([])
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '予期しないエラーが発生しました'
      setError(errorMessage)
      setResults([])
    } finally {
      setLoading(false)
    }
  }

  return { searchOwners, results, loading, error, clearResults: () => setResults([]) }
}
