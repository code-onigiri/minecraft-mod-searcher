# Project Structure

## Organization Philosophy

**Feature-First + Layer Separation**
- 機能単位でディレクトリを分割
- 各機能内でコンポーネント/フック/サービスを分離
- 共通UIコンポーネントは`components/ui/`に集約

## Directory Patterns

### App Router Pages
**Location**: `/app/`  
**Purpose**: Next.js App Routerのページ・レイアウト  
**Example**: `app/search/page.tsx`, `app/library/page.tsx`

### Feature Modules
**Location**: `/features/{feature-name}/`  
**Purpose**: 機能単位のコンポーネント・フック・サービス  
**Example**: 
```
features/search/
  ├── components/   # 機能固有UIコンポーネント
  ├── hooks/        # 機能固有カスタムフック
  └── services/     # API呼び出し・ビジネスロジック
```

### Shared UI Components
**Location**: `/components/ui/`  
**Purpose**: 再利用可能なUIプリミティブ  
**Example**: `Button.tsx`, `Modal.tsx`, `Card.tsx`

### Type Definitions
**Location**: `/types/`  
**Purpose**: 共有型定義、APIレスポンス型  
**Example**: `mod.ts`, `api.ts`, `user.ts`

### Utilities
**Location**: `/lib/`  
**Purpose**: 汎用ユーティリティ、クライアント初期化  
**Example**: `supabase.ts`, `crypto.ts`, `cache.ts`

## Naming Conventions

- **Files (Components)**: PascalCase (`ModCard.tsx`)
- **Files (Hooks)**: camelCase with `use` prefix (`useSearch.ts`)
- **Files (Services)**: camelCase (`searchService.ts`)
- **Files (Types)**: camelCase (`mod.ts`)
- **Directories**: kebab-case (`search-results/`)
- **Functions**: camelCase (`fetchMods`)
- **Interfaces/Types**: PascalCase (`ModSearchResult`)

## Import Organization

```typescript
// 1. External libraries
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'

// 2. Internal absolute imports
import { ModCard } from '@/components/ui/ModCard'
import { useSearch } from '@/features/search/hooks/useSearch'

// 3. Relative imports (same feature)
import { SearchInput } from './SearchInput'
```

**Path Aliases**:
- `@/`: プロジェクトルート (`./`)

## Code Organization Principles

- **サービス層**: API呼び出し・データ変換のみ、UIロジック禁止
- **フック層**: 状態管理・副作用、サービス呼び出しの橋渡し
- **コンポーネント層**: UIレンダリング、フックからデータ受け取り
- **依存方向**: Components → Hooks → Services → Types

---
_created_at: 2026-01-20_
