# DogMATEs - Azure App Service デプロイガイド

## 🚀 Azure App Service へのデプロイ手順

### 前提条件
- Azure アカウント
- Azure App Service: `app-002-gen10-step3-2-node-oshima13`
- Node.js 18以上

### 自動デプロイ設定

#### 1. GitHub Actions での自動デプロイ
1. Azure Portal で App Service の「Deployment Center」にアクセス
2. GitHub を選択し、リポジトリを接続
3. 「Publish Profile」をダウンロード
4. GitHub リポジトリの Settings > Secrets and variables > Actions で以下を設定：
   - `AZUREAPPSERVICE_PUBLISHPROFILE`: ダウンロードしたプロファイルの内容

#### 2. Azure Portal での環境変数設定
Azure Portal > App Service > Configuration > Application settings で以下を設定：

```
NODE_ENV=production
WEBSITE_NODE_DEFAULT_VERSION=~18
NEXT_TELEMETRY_DISABLED=1
NEXTAUTH_URL=https://app-002-gen10-step3-2-node-oshima13.azurewebsites.net
NEXTAUTH_SECRET=your-secret-key-here
APP_NAME=DogMATEs
APP_VERSION=1.0.0
DEBUG=false
```

### 手動デプロイ

#### VS Code での Azure Extensions 使用
1. VS Code に Azure App Service 拡張機能をインストール
2. Azure アカウントにサインイン
3. プロジェクトを右クリック > "Deploy to Web App"

#### Azure CLI での直接デプロイ
```bash
# Azure CLI にログイン
az login

# ビルド実行
npm run build

# デプロイ
az webapp deploy --resource-group your-resource-group --name app-002-gen10-step3-2-node-oshima13 --src-path .
```

### デプロイ後の確認

1. **URL**: https://app-002-gen10-step3-2-node-oshima13.azurewebsites.net
2. **ログ確認**: Azure Portal > App Service > Log stream
3. **メトリクス**: Azure Portal > App Service > Metrics

### トラブルシューティング

#### よくある問題
1. **ビルドエラー**: 
   - `npm ci` が失敗する場合は dependencies を確認
   - Node.js バージョンが 18以上か確認

2. **起動エラー**:
   - PORT 環境変数が正しく設定されているか確認
   - Azure Portal のログを確認

3. **静的ファイルが表示されない**:
   - `web.config` が正しく配置されているか確認
   - `next.config.mjs` の設定を確認

#### デバッグコマンド
```bash
# ローカルでの本番ビルドテスト
npm run build
npm start

# Azure CLI でのログ確認
az webapp log tail --name app-002-gen10-step3-2-node-oshima13 --resource-group your-resource-group
```

### ファイル構成
```
├── .github/
│   └── workflows/
│       └── azure-deploy.yml    # GitHub Actions ワークフロー
├── .env.production             # 本番環境用環境変数
├── web.config                  # Azure App Service 用設定
├── startup.sh                  # Azure 起動スクリプト
├── next.config.mjs            # Next.js 設定（Azure最適化）
└── package.json               # Azure用スクリプト追加
```

### セキュリティ設定
- HTTPS 強制リダイレクト有効
- セキュリティヘッダー設定済み
- 環境変数での機密情報管理

### パフォーマンス最適化
- 圧縮有効
- 静的ファイル最適化
- CDN 対応（必要に応じて Azure CDN 設定）
