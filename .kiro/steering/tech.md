# Technology Stack

## Architecture

**Client-Heavy SPA Architecture**
- 検索・名寄せロジックはクライアントサイドで実行
- 全外部API（Modrinth, CurseForge, GitHub）がCORS対応のためプロキシ不要
- データ永続化はBaaS（Supabase）に委譲

## Core Technologies

- **Language**: TypeScript 5+ (strict mode)
- **Framework**: Next.js 14+ (App Router)
- **Runtime**: Bun 1.x
- **Hosting**: Vercel (Free Tier)

## Key Libraries

- **UI**: Tailwind CSS 3.4+ / DaisyUI 4+
- **Data Fetching**: TanStack Query 5+ (IndexedDB永続化)
- **Backend/BaaS**: Supabase (Auth + PostgreSQL)
- **Encryption**: Web Crypto API (AES-GCM)

## Development Standards

### Type Safety
- TypeScript strict mode 必須
- `any` 型の使用禁止
- 外部APIレスポンスは型定義必須

### Code Quality
- ESLint + Prettier
- コンポーネントは関数コンポーネント + Hooks
- カスタムフックでロジック分離

### Testing
- Vitest: ユニットテスト（サービス層）
- React Testing Library: コンポーネントテスト
- カバレッジ目標: 80%以上（サービス層）

## Development Environment

### Required Tools
- Bun 1.x
- Node.js 20+ (Vercel互換性のため)
- Git

### Common Commands
```bash
# Dev: bun dev
# Build: bun run build
# Test: bun test
# Lint: bun lint
```

## Key Technical Decisions

| Decision | Rationale |
|----------|-----------|
| プロキシ不要 | 全API（Modrinth, CurseForge, GitHub）がCORS対応 |
| BYOK方式 | APIキーをサーバーに送信せずプライバシー保護 |
| IndexedDB永続化 | オフライン対応とキャッシュ性能向上 |
| Supabase選択 | Free Tier 500MB、RLSによるセキュリティ |
| DaisyUI採用 | Tailwind CSS上の高品質コンポーネント |

## External APIs

| API | Auth | CORS | Notes |
|-----|------|------|-------|
| Modrinth | 不要 | ✅ | 直接呼び出し |
| CurseForge | BYOK API Key | ✅ | ヘッダーにx-api-key |
| GitHub | OAuth Token | ✅ | 未認証時60req/h、認証時5000req/h |

---
_created_at: 2026-01-20_
