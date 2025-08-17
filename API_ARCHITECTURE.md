# DogMATEs - FastAPI連携アーキテクチャ

## 🔄 API連携アーキテクチャ

### 概要
このプロジェクトは FastAPI バックエンドとの連携を前提としたアーキテクチャで構築されています。
開発中はモックデータを使用し、本番環境では実際のAPIと連携します。

### 📁 プロジェクト構造

```
lib/
├── api-config.ts           # API設定とエンドポイント定義
├── api-client.ts           # HTTP通信クライアント
├── api-services.ts         # APIサービスクラス
├── types.ts               # TypeScript型定義
└── mock-data/             # モックデータ
    ├── owners.ts
    ├── dogs.ts
    ├── bookings.ts
    └── users.ts

hooks/
└── use-api.ts             # React API連携フック

contexts/
└── auth-context.tsx       # 認証コンテキスト（API対応）
```

### 🛠 技術スタック

- **Frontend**: Next.js 15 + TypeScript
- **Backend**: FastAPI (Python)
- **Database**: MySQL (Azure Database for MySQL)
- **Authentication**: JWT Token
- **Deployment**: Azure App Service

### 🔧 環境設定

#### 開発環境
```bash
# .env.local を作成
cp .env.local.example .env.local

# 環境変数を設定
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_USE_MOCK_DATA=true
```

#### 本番環境
Azure Portal > App Service > Configuration > Application settings で以下を設定：

```
NEXT_PUBLIC_API_URL=https://your-fastapi-backend.azurewebsites.net
NEXT_PUBLIC_USE_MOCK_DATA=false
NEXT_PUBLIC_AUTH_SECRET=your-production-secret
```

### 📊 データベース構造

以下のテーブルがFastAPIバックエンドで実装される予定：

- `ユーザー` (Users)
- `飼い主` (Owners)
- `犬` (Dogs)
- `予約` (Bookings)
- `日誌エントリ` (DiaryEntries)
- `健康記録` (HealthRecords)
- `食事` (Meals)

### 🔌 API使用例

#### 基本的な使用方法

```typescript
import { useOwners, useCreateOwner } from '@/hooks/use-api'

function OwnersList() {
  // データ取得
  const { data: owners, loading, error, refetch } = useOwners()
  
  // データ作成
  const { createOwner, loading: creating } = useCreateOwner()
  
  const handleCreate = async (ownerData) => {
    const newOwner = await createOwner(ownerData)
    if (newOwner) {
      refetch() // リストを再取得
    }
  }
  
  // ...render
}
```

#### サービスクラスの直接使用

```typescript
import { OwnerService } from '@/lib/api-services'

async function searchOwners(query: string) {
  const response = await OwnerService.searchOwners(query)
  if (response.success) {
    return response.data
  }
  console.error(response.error)
  return []
}
```

### 🔄 モック/本番切り替え

#### 自動切り替え
環境変数 `NEXT_PUBLIC_USE_MOCK_DATA` によって自動で切り替わります：

- `true`: モックデータを使用（開発時）
- `false`: 実際のAPIを使用（本番環境）

#### 手動切り替え
`lib/api-config.ts` の `USE_MOCK_DATA` 定数で制御できます。

### 🚀 デプロイフロー

1. **フロントエンド（Next.js）**: Azure App Service
2. **バックエンド（FastAPI）**: Azure App Service または Azure Container Apps
3. **データベース**: Azure Database for MySQL

### 📝 APIエンドポイント設計

FastAPIバックエンドで実装される予定のエンドポイント：

```
GET    /users                # ユーザー一覧
POST   /users                # ユーザー作成
GET    /users/{id}           # ユーザー詳細

GET    /owners               # 飼い主一覧
POST   /owners               # 飼い主作成
GET    /owners/{id}          # 飼い主詳細
GET    /owners/search        # 飼い主検索

GET    /dogs                 # 犬一覧
POST   /dogs                 # 犬登録
GET    /dogs/{id}            # 犬詳細
GET    /owners/{id}/dogs     # 飼い主の犬一覧

GET    /bookings             # 予約一覧
POST   /bookings             # 予約作成
PUT    /bookings/{id}        # 予約更新

GET    /diary-entries        # 日誌一覧
POST   /diary-entries        # 日誌作成
GET    /dogs/{id}/diary-entries  # 犬の日誌一覧

POST   /auth/login           # ログイン
POST   /auth/register        # ユーザー登録
POST   /auth/logout          # ログアウト
```

### 🛡 セキュリティ

- JWT トークンベースの認証
- HTTPS 通信の強制
- CORS 設定
- 入力値バリデーション
- SQL インジェクション対策

### 📋 今後の実装計画

1. **Phase 1**: FastAPI バックエンドの基本実装
2. **Phase 2**: データベーススキーマの確定とマイグレーション
3. **Phase 3**: 認証システムの実装
4. **Phase 4**: ファイルアップロード機能（画像等）
5. **Phase 5**: リアルタイム機能（WebSocket）
6. **Phase 6**: 外部サービス連携（決済、通知等）

### 🔧 開発時の注意点

- モックデータは `lib/mock-data/` 配下で管理
- 型定義は `lib/types.ts` で一元管理
- API サービスは `lib/api-services.ts` で実装
- React フックは `hooks/use-api.ts` で提供
- 環境変数は適切に設定すること
- エラーハンドリングを適切に行うこと
