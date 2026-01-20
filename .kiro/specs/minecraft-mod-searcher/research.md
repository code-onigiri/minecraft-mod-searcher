# External API & Technology Research

本ドキュメントは minecraft-mod-searcher の技術設計に必要な外部API・サービスの調査結果をまとめたものです。

**調査日**: 2026-01-20

---

## 1. Modrinth API

### 基本情報
| 項目 | 詳細 |
|------|------|
| Base URL | `https://api.modrinth.com/v2` |
| API Version | v2 (現行安定版) |
| Documentation | https://docs.modrinth.com/api |

### 認証
- **認証不要**: 公開データの読み取りは認証なしでアクセス可能
- **オプション認証**: より高いレート制限を得るためにPAT (Personal Access Token) を使用可能
- **Header**: `Authorization: <PAT>` (オプション)

### 検索エンドポイント

```
GET /search
```

| パラメータ | 型 | 説明 |
|-----------|-----|------|
| `query` | string | 検索クエリ文字列 |
| `facets` | string (JSON array) | ファセット検索フィルタ |
| `index` | string | ソート順 (`relevance`, `downloads`, `follows`, `newest`, `updated`) |
| `offset` | integer | ページネーション開始位置 |
| `limit` | integer | 1ページあたりの結果数 (max: 100) |

#### ファセットフィルタ例
```json
[
  ["categories:fabric"],
  ["versions:1.20.1"],
  ["project_type:mod"]
]
```

- **Minecraft Version Filter**: `["versions:1.20.1"]`
- **Mod Loader Filter**: `["categories:fabric"]`, `["categories:forge"]`, `["categories:neoforge"]`, `["categories:quilt"]`
- **Project Type**: `["project_type:mod"]` (MOD限定)

### レート制限
| 条件 | 制限 |
|------|------|
| 未認証 | 300 requests/min |
| 認証済み (PAT) | 更に高い制限 (具体値は非公開) |

### CORS Policy
- ✅ **ブラウザから直接呼び出し可能**
- Modrinth APIはCORS対応済みで、フロントエンドから直接アクセス可能

### レスポンス例
```json
{
  "hits": [
    {
      "slug": "sodium",
      "title": "Sodium",
      "description": "A modern rendering engine...",
      "project_type": "mod",
      "downloads": 50000000,
      "icon_url": "https://...",
      "versions": ["1.20.1", "1.20.2"],
      "categories": ["fabric", "optimization"],
      "source_url": "https://github.com/CaffeineMC/sodium-fabric"
    }
  ],
  "offset": 0,
  "limit": 10,
  "total_hits": 150
}
```

---

## 2. CurseForge API (Eternal API)

### 基本情報
| 項目 | 詳細 |
|------|------|
| Base URL | `https://api.curseforge.com/v1` |
| API Version | v1 |
| Documentation | https://docs.curseforge.com |

### 認証
- **必須**: API Keyが必要
- **Header名**: `x-api-key`
- **取得方法**: https://console.curseforge.com で無料で取得可能

```
x-api-key: $2a$10$...your_api_key...
```

### 検索エンドポイント

```
GET /mods/search
```

| パラメータ | 型 | 説明 |
|-----------|-----|------|
| `gameId` | integer | **必須**: Minecraft = `432` |
| `searchFilter` | string | 検索クエリ文字列 |
| `gameVersion` | string | Minecraftバージョン (例: `1.20.1`) |
| `modLoaderType` | integer | ローダー種別 (後述) |
| `sortField` | integer | ソートフィールド |
| `sortOrder` | string | `asc` or `desc` |
| `index` | integer | ページネーション開始位置 |
| `pageSize` | integer | 1ページあたりの結果数 (max: 50) |
| `classId` | integer | カテゴリ (Mods = `6`) |

#### modLoaderType 値
| 値 | ローダー |
|-----|---------|
| 1 | Forge |
| 4 | Fabric |
| 5 | Quilt |
| 6 | NeoForge |

### レート制限
| 条件 | 制限 |
|------|------|
| 標準 | 具体的な数値は非公開だが、一般的な利用には十分 |
| ベストプラクティス | キャッシュ活用、不要なリクエスト削減を推奨 |

### CORS Policy
- ✅ **ブラウザから直接呼び出し可能**
- CurseForge APIはCORS対応済み
- プロキシ不要でクライアントから直接アクセス可能

### レスポンス例
```json
{
  "data": [
    {
      "id": 238222,
      "slug": "jei",
      "name": "Just Enough Items (JEI)",
      "summary": "View Items and Recipes",
      "downloadCount": 200000000,
      "logo": {
        "url": "https://..."
      },
      "links": {
        "websiteUrl": "https://www.curseforge.com/minecraft/mc-mods/jei",
        "sourceUrl": "https://github.com/mezz/JustEnoughItems"
      },
      "latestFiles": [...]
    }
  ],
  "pagination": {
    "index": 0,
    "pageSize": 50,
    "resultCount": 50,
    "totalCount": 500
  }
}
```

---

## 3. GitHub API

### 基本情報
| 項目 | 詳細 |
|------|------|
| Base URL | `https://api.github.com` |
| API Version | REST API v3 / GraphQL v4 |
| Documentation | https://docs.github.com/en/rest |

### 認証
- **オプション**: 認証なしでも利用可能だが、レート制限が厳しい
- **推奨**: OAuth Token または Personal Access Token
- **Header**: `Authorization: Bearer <token>`

### 検索エンドポイント

#### リポジトリ検索
```
GET /search/repositories
```

| パラメータ | 型 | 説明 |
|-----------|-----|------|
| `q` | string | 検索クエリ (例: `minecraft mod fabric`) |
| `sort` | string | `stars`, `forks`, `help-wanted-issues`, `updated` |
| `order` | string | `asc` or `desc` |
| `per_page` | integer | 1ページあたりの結果数 (max: 100) |
| `page` | integer | ページ番号 |

#### Minecraft Mod検索クエリ例
```
q=minecraft+mod+fabric+topic:minecraft-mod&sort=updated
```

#### Releases取得
```
GET /repos/{owner}/{repo}/releases
```

### レート制限
| 条件 | 制限 |
|------|------|
| 未認証 | 60 requests/hour |
| OAuth認証済み | 5,000 requests/hour |
| 検索API (認証済み) | 30 requests/min |

⚠️ **重要**: 未認証での検索APIは非常に制限が厳しいため、GitHub OAuthログインを強く推奨

### CORS Policy
- ✅ **ブラウザから直接呼び出し可能**
- GitHub APIはCORS対応済み

### レスポンス例 (Repository Search)
```json
{
  "total_count": 1000,
  "incomplete_results": false,
  "items": [
    {
      "id": 12345,
      "name": "sodium-fabric",
      "full_name": "CaffeineMC/sodium-fabric",
      "html_url": "https://github.com/CaffeineMC/sodium-fabric",
      "description": "A Minecraft mod designed to improve frame rates",
      "stargazers_count": 5000,
      "topics": ["minecraft", "minecraft-mod", "fabric"],
      "updated_at": "2026-01-15T10:00:00Z"
    }
  ]
}
```

---

## 4. Supabase

### 基本情報
| 項目 | 詳細 |
|------|------|
| Documentation | https://supabase.com/docs |
| Dashboard | https://supabase.com/dashboard |

### Free Tier 制限

| リソース | 制限 |
|----------|------|
| データベースサイズ | 500 MB |
| ストレージ | 1 GB |
| 帯域幅 | 5 GB/月 |
| API リクエスト | 無制限 (ただし同時接続数制限あり) |
| 認証ユーザー (MAU) | 50,000 |
| Edge Functions | 500,000 呼び出し/月 |
| Realtime | 200 同時接続 |
| プロジェクト数 | 2つまで |
| 自動一時停止 | 7日間非アクティブで一時停止 |

### 認証プロバイダー
✅ サポート済み:
- **GitHub OAuth** - 推奨
- **Email/Password** - サポート済み
- Google, Discord, Twitter, etc.
- Magic Link (パスワードレス)
- Phone (SMS)

### Supabase JS Client
```typescript
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://xxx.supabase.co',
  'public-anon-key'
)

// GitHub OAuth
await supabase.auth.signInWithOAuth({
  provider: 'github',
  options: {
    scopes: 'read:user'
  }
})

// Email/Password
await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'password'
})
```

### 本プロジェクトへの適合性
- ✅ ユーザー認証 (GitHub OAuth, Email/Password)
- ✅ ブックマーク・Modリストの永続化
- ✅ 10〜20名程度の小規模利用には十分
- ⚠️ 7日間非アクティブで一時停止 → 初回アクセス時に起動待ちが発生する可能性

---

## 5. Cloudflare Workers

### 基本情報
| 項目 | 詳細 |
|------|------|
| Documentation | https://developers.cloudflare.com/workers |
| Dashboard | https://dash.cloudflare.com |

### Free Tier 制限

| リソース | 制限 |
|----------|------|
| リクエスト数 | **100,000 requests/day** |
| CPU時間 | 10ms/リクエスト |
| スクリプトサイズ | 1 MB |
| Workers数 | 100 |
| KV Storage | 1 GB (読み取り: 100,000/day, 書き込み: 1,000/day) |

### CORSプロキシとしての使用

CurseForge APIはCORS非対応のため、Cloudflare Workersでプロキシを構築:

```typescript
// worker.ts
export default {
  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url)
    const targetUrl = url.searchParams.get('url')
    
    if (!targetUrl) {
      return new Response('Missing url parameter', { status: 400 })
    }
    
    const apiKey = request.headers.get('x-cf-api-key')
    
    const response = await fetch(targetUrl, {
      headers: {
        'x-api-key': apiKey || '',
        'Accept': 'application/json'
      }
    })
    
    const data = await response.text()
    
    return new Response(data, {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'x-cf-api-key'
      }
    })
  }
}
```

### 本プロジェクトへの適合性
- ✅ 10万リクエスト/日は10〜20名の小規模利用には十分
- ✅ CurseForge APIのCORSプロキシに最適
- ✅ Edge Locationでの低レイテンシ
- ⚠️ API Keyをクライアントから受け取る設計が必要（サーバーには保存しない）

---

## 6. Technology Stack Recommendations

### フレームワーク比較

| フレームワーク | Bun対応 | Vercel対応 | 特徴 |
|--------------|---------|-----------|------|
| **Next.js** | ✅ | ✅ (最適化) | フルスタック、SSR/SSG、APIルート |
| **Remix** | ✅ | ✅ | ネステッドルーティング、プログレッシブ強化 |
| **Astro** | ✅ | ✅ | 静的サイト特化、Islands Architecture |
| **Vite + React** | ✅ | ✅ | 軽量SPA、高速HMR |

### 推奨: Next.js (App Router)

**選定理由**:
1. **Vercel との親和性**: Vercel社が開発しており、Free Tierでの最適化が最も進んでいる
2. **Bun サポート**: Bun runtime で動作可能
3. **API Routes**: CurseForge プロキシをNext.js API Routesで実装可能（Cloudflare Workers不要の選択肢）
4. **クライアントサイドレンダリング対応**: `"use client"` ディレクティブでSPA的な動作も可能
5. **Tailwind CSS + DaisyUI**: 公式サポート

### 代替案: Vite + React + React Router

**メリット**:
- よりシンプルで軽量
- 学習コストが低い
- 純粋なSPAとして動作

**デメリット**:
- APIプロキシに別途Cloudflare Workersが必要
- SEO対応には追加設定が必要

### Vercel Free Tier 制限

| リソース | 制限 |
|----------|------|
| 帯域幅 | 100 GB/月 |
| Serverless Function 実行時間 | 100 GB-hours/月 |
| ビルド時間 | 6,000 min/月 |
| デプロイ数 | 無制限 |
| 同時ビルド | 1 |
| チームメンバー | 1 (Hobby) |

### 推奨スタック構成

```
┌─────────────────────────────────────────────────────────────┐
│                      Frontend                                │
│  Next.js 14+ (App Router) + React 18 + TypeScript           │
│  Tailwind CSS + DaisyUI                                      │
│  Deployed on: Vercel (Free Tier)                            │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      APIs (全て直接呼び出し)                 │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │  Modrinth   │  │ CurseForge  │  │   GitHub    │         │
│  │  (Direct)   │  │  (Direct)   │  │  (Direct)   │         │
│  │   ✅ CORS   │  │   ✅ CORS   │  │   ✅ CORS   │         │
│  │   認証不要  │  │   BYOK      │  │   OAuth     │         │
│  └─────────────┘  └─────────────┘  └─────────────┘         │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      Backend                                 │
│  Supabase (Free Tier)                                       │
│  - Auth: GitHub OAuth, Email/Password                       │
│  - Database: PostgreSQL (500MB)                             │
│  - Tables: users, bookmarks, mod_lists, mod_list_items      │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                   Client-side Storage                        │
│  - LocalStorage: CurseForge API Key (暗号化)                │
│  - SessionStorage/IndexedDB: 検索キャッシュ                 │
└─────────────────────────────────────────────────────────────┘
```

---

## 7. 設計への示唆

### API呼び出し戦略

| API | 呼び出し方法 | 認証 | キャッシュ戦略 |
|-----|-------------|------|---------------|
| Modrinth | 直接 (ブラウザ) | 不要 | sessionStorage (5分) |
| CurseForge | 直接 (ブラウザ) | クライアント管理のAPI Key | sessionStorage (5分) |
| GitHub | 直接 (ブラウザ) | OAuth Token (Supabase経由) | sessionStorage (5分) |

### セキュリティ考慮事項

1. **CurseForge API Key**: 
   - ユーザーが自分のキーを入力（BYOK）
   - LocalStorageに暗号化して保存
   - **サーバーには一切送信しない**（CurseForge APIはCORS対応でクライアント直接呼び出し可能）
   - 真のBYOKモデルが実現

2. **GitHub OAuth Token**:
   - Supabase Authが管理
   - GitHub APIへの直接アクセスに使用

3. **Supabase**:
   - Row Level Security (RLS) でユーザーデータを保護
   - 各ユーザーは自分のブックマーク・リストのみアクセス可能

### 無料枠内運用のためのベストプラクティス

1. **Debounce**: 検索入力に300ms以上のデバウンス
2. **キャッシュ**: 検索結果を5〜10分キャッシュ
3. **Lazy Loading**: 必要な時のみAPIを呼び出し
4. **並列リクエスト制限**: 同時API呼び出し数を制限
5. **Supabaseの自動停止対策**: 定期的なヘルスチェック (Cron) の検討

---

## 8. まとめ

| 項目 | 推奨選択 | 理由 |
|------|---------|------|
| フロントエンド | Next.js 14+ (App Router) | Vercel最適化、SSR/SSG対応 |
| UIライブラリ | Tailwind CSS + DaisyUI | 要件通り |
| ランタイム | Bun | 要件通り |
| 認証・DB | Supabase | Free Tier十分、GitHub OAuth対応 |
| CORSプロキシ | **不要** | 全APIがCORS対応 |
| ホスティング | Vercel (Frontend) | Free Tierで十分 |

**Free Tier予算適合性**: ✅ 全てのサービスが無料枠内で運用可能
