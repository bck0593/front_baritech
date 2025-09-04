# DogMATEs API使用ガイド

## 🎯 環境変数の設定

### 開発環境 (.env.local)
```bash
# 開発時はモックデータを使用
NEXT_PUBLIC_API_URL=https://app-002-gen10-step3-2-py-oshima13.azurewebsites.net
NEXT_PUBLIC_USE_MOCK_DATA=true
```

### 本番環境 (.env.production)
```bash
# 本番時は実際のバックエンドAPIを使用
NEXT_PUBLIC_API_URL=https://app-002-gen10-step3-2-py-oshima13.azurewebsites.net
NEXT_PUBLIC_USE_MOCK_DATA=false
```

## 🚀 推奨APIアクセスパターン

### ❌ 非推奨: 直接fetchを使用
```javascript
// 使用しない
const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/items`);
```

### ✅ 推奨: プロジェクトのAPIクライアントを使用

#### 1. サービスクラス経由（最も推奨）
```typescript
import { BookingService } from '@/lib/api-services'

// 予約一覧取得
const bookings = await BookingService.getBookings({ page: 1, limit: 10 })

// 予約作成
const newBooking = await BookingService.createBooking({
  dog_id: '1',
  service_type: 'DAYCARE',
  date: '2025-08-26'
})
```

#### 2. APIクライアント直接使用
```typescript
import { apiClient } from '@/lib/api-client'

const response = await apiClient.get('/api/v1/bookings')
if (response.success) {
  console.log(response.data)
}
```

## 🔐 認証付きAPI使用

```typescript
import { AuthService } from '@/lib/api-services'

// ログイン
const loginResponse = await AuthService.login({
  email: 'tanaka@example.com',
  password: 'password123'
})

// ログイン後、他のAPIは自動的に認証される
const userProfile = await AuthService.getCurrentUser()
```

## 🎛️ 環境別動作

### モックモード (`NEXT_PUBLIC_USE_MOCK_DATA=true`)
- テストデータを使用
- ネットワーク不要
- 開発時に最適

### リアルAPIモード (`NEXT_PUBLIC_USE_MOCK_DATA=false`)
- バックエンドAPIと通信
- JWT認証を使用
- 本番環境で使用

## 📝 React コンポーネントでの使用例

```typescript
import { useState, useEffect } from 'react'
import { BookingService } from '@/lib/api-services'

function BookingList() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchBookings() {
      try {
        const response = await BookingService.getBookings()
        if (response.success) {
          setBookings(response.data.items)
        }
      } catch (error) {
        console.error('Error:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchBookings()
  }, [])

  return (
    <div>
      {loading ? '読み込み中...' : (
        bookings.map(booking => (
          <div key={booking.id}>{booking.service_type}</div>
        ))
      )}
    </div>
  )
}
```

## 🛠️ エラーハンドリング

```typescript
try {
  const response = await BookingService.createBooking(bookingData)
  
  if (response.success) {
    // 成功処理
    console.log('予約作成成功:', response.data)
  } else {
    // APIエラー
    console.error('API エラー:', response.error)
    alert(response.error)
  }
} catch (error) {
  // ネットワークエラー等
  console.error('システムエラー:', error)
  alert('システムエラーが発生しました')
}
```

## 📚 利用可能なサービス

- `AuthService`: 認証関連
- `BookingService`: 予約管理
- `UserService`: ユーザー管理
- `DogService`: 犬情報管理
- `DiaryService`: 日誌管理
- `HealthService`: 健康記録
- `EventService`: イベント管理

## 🔧 カスタマイズ

新しいAPIエンドポイントを追加する場合:

1. `lib/api-config.ts` にエンドポイント定義を追加
2. `lib/types.ts` に型定義を追加
3. `lib/api-services.ts` にサービスメソッドを追加
4. 必要に応じて `lib/mock-data/` にモックデータを追加
