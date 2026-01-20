# Implementation Plan

## Task Overview
- **Feature**: minecraft-mod-searcher
- **Total Requirements**: 16
- **Architecture**: Client-Heavy SPA (プロキシ不要)

---

## Tasks

- [ ] 1. プロジェクト基盤セットアップ
- [ ] 1.1 Next.js + Bun プロジェクト初期化
  - Next.js 14+ App Routerプロジェクトを作成
  - Bunをパッケージマネージャーとして設定
  - TypeScript strict modeを有効化
  - ESLint/Prettierの設定
  - _Requirements: 16.1, 16.2_

- [ ] 1.2 (P) UI基盤（Tailwind CSS + DaisyUI）設定
  - Tailwind CSS 3.4+をインストール・設定
  - DaisyUI 4+をインストール・設定
  - ダークモード対応のテーマ設定
  - 基本的なレイアウトコンポーネント作成
  - _Requirements: 13.2_

- [ ] 1.3 (P) Supabaseプロジェクト接続設定
  - Supabaseクライアントライブラリ設定
  - 環境変数の設定（SUPABASE_URL, SUPABASE_ANON_KEY）
  - 型定義の自動生成設定
  - _Requirements: 16.1_

- [ ] 1.4 データベーススキーマ作成
  - bookmarksテーブル作成（RLS設定含む）
  - mod_listsテーブル作成（RLS設定含む）
  - mod_list_itemsテーブル作成（RLS設定含む）
  - インデックス設定
  - _Requirements: 5.1, 5.2, 6.1, 6.2, 16.1_

---

- [ ] 2. 認証システム実装
- [ ] 2.1 認証サービス実装
  - GitHub OAuth認証フローの実装
  - Email/Password認証の実装
  - セッション管理（長期保持）の実装
  - ログアウト機能の実装
  - 認証状態変更の監視機能
  - _Requirements: 4.1, 4.2, 4.3, 4.4_

- [ ] 2.2 認証UIコンポーネント作成
  - ログインボタン（GitHub OAuth）
  - Email/Passwordフォーム
  - ログイン促進モーダル
  - ユーザーアバター・ドロップダウンメニュー
  - _Requirements: 4.1, 4.2_

---

- [ ] 3. API Adapter実装
- [ ] 3.1 (P) Modrinth Adapter実装
  - Modrinth Search API呼び出し機能
  - facetsによるバージョン・ローダーフィルタリング
  - レスポンス型定義と変換
  - エラーハンドリング
  - _Requirements: 1.1, 3.1, 3.2, 3.3_

- [ ] 3.2 (P) CurseForge Adapter実装
  - CurseForge Search API呼び出し機能（BYOK APIキー使用）
  - gameVersion/modLoaderTypeパラメータ対応
  - APIキー未設定時のスキップ処理
  - レスポンス型定義と変換
  - _Requirements: 1.3, 1.4, 3.1, 3.2, 3.3_

- [ ] 3.3 (P) GitHub Adapter実装
  - GitHub Search Repositories API呼び出し機能
  - OAuth Token使用時の認証ヘッダー付与
  - 未認証時のスキップ処理
  - レスポンス型定義と変換
  - _Requirements: 1.5, 9.4_

---

- [ ] 4. 検索コア機能実装
- [ ] 4.1 検索サービス統合実装
  - 複数Adapterへの並列リクエスト発行（Promise.allSettled）
  - Debounce処理（300ms）の実装
  - 各ソースの有効/無効状態管理
  - Progressive Loading（先着結果から順次返却）
  - _Requirements: 1.1, 1.2, 1.6, 15.1, 15.2_

- [ ] 4.2 名寄せ（Identity Resolution）実装
  - Slug完全一致による統合ロジック
  - GitHubリンク照合による統合ロジック
  - 統合されたModの統一データ構造生成
  - ソースインジケーター情報の保持
  - _Requirements: 2.1, 2.2, 2.3_

- [ ] 4.3 フィルタリングサービス実装
  - Minecraftバージョンフィルター
  - ローダー（Fabric/Forge/NeoForge/Quilt）フィルター
  - API側フィルタリングとクライアント側フィルタリングの使い分け
  - フィルター状態管理
  - _Requirements: 3.1, 3.2, 3.3, 3.4_

- [ ] 4.4 キャッシュサービス実装
  - TanStack Query設定（staleTime/gcTime）
  - IndexedDB永続化プラグイン設定
  - キャッシュキー生成ロジック（クエリ+フィルター）
  - TTL管理（5〜10分）
  - _Requirements: 9.1, 9.2, 9.3_

---

- [ ] 5. API設定管理（Vault）実装
- [ ] 5.1 暗号化サービス実装
  - Web Crypto APIによるAES-GCM暗号化
  - デバイス固有salt生成
  - LocalStorageへの暗号化保存
  - 復号化機能
  - _Requirements: 7.1, 14.1, 14.2_

- [ ] 5.2 Vault UIコンポーネント作成
  - CurseForge API Key入力フォーム
  - API Key削除機能
  - GitHub連携状態表示
  - GitHub再認証ボタン
  - セキュリティに関する説明表示
  - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_

---

- [ ] 6. ブックマーク機能実装
- [ ] 6.1 ブックマークサービス実装
  - ブックマーク追加（Supabase INSERT）
  - ブックマーク削除（Supabase DELETE）
  - ブックマーク一覧取得
  - メモ追加・更新機能
  - 楽観的更新によるUX向上
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_

- [ ] 6.2 ブックマークUIコンポーネント作成
  - ModカードのブックマークボタンToggle
  - ブックマーク状態の視覚的表示
  - メモ入力モーダル
  - _Requirements: 5.1, 5.3_

---

- [ ] 7. Modリスト機能実装
- [ ] 7.1 Modリストサービス実装
  - リスト作成（名前入力、Supabase INSERT）
  - リスト削除（カスケード削除）
  - Modをリストに追加
  - リストからMod削除
  - バージョンピン留め機能
  - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_

- [ ] 7.2 ModリストUIコンポーネント作成
  - リスト作成モーダル
  - リスト一覧表示
  - リスト詳細（Mod一覧）表示
  - Modをリストに追加するUI
  - バージョン選択・ピン留めUI
  - _Requirements: 6.1, 6.2, 6.3, 12.2_

---

- [ ] 8. エクスポート機能実装
- [ ] 8.1 エクスポートサービス実装
  - Markdown形式生成（リンク一覧）
  - クリップボードコピー機能
  - ファイルダウンロード機能
  - _Requirements: 8.1, 8.2, 8.3_

---

- [ ] 9. 画面実装
- [ ] 9.1 ホーム画面実装
  - 中央配置の大きな検索バー
  - トレンド/人気Mod表示（Modrinth APIから取得）
  - ヘッダー・フッターレイアウト
  - _Requirements: 10.1, 10.2_

- [ ] 9.2 検索結果画面実装
  - フィルターサイドバー（左側）
  - 検索結果一覧（右側、グリッド表示）
  - Skeleton UI（ローディング中）
  - 検索バーの常時表示
  - _Requirements: 11.1, 11.4_

- [ ] 9.3 Modカードコンポーネント実装
  - Modタイトル・アイコン表示
  - 説明文（truncate）
  - 対応バージョン・ローダーバッジ
  - ソースインジケーター（Modrinth緑/CurseForgeオレンジ/GitHub黒）
  - 最終更新日表示
  - ブックマークボタン
  - _Requirements: 11.2, 11.3, 2.3_

- [ ] 9.4 マイライブラリ画面実装
  - ブックマーク一覧タブ
  - Modリスト一覧タブ
  - リスト詳細表示
  - エクスポートボタン
  - _Requirements: 12.1, 12.2_

- [ ] 9.5 設定画面実装
  - API設定セクション（Vault UI統合）
  - 外観設定セクション（ダークモード切替）
  - _Requirements: 13.1, 13.2_

---

- [ ] 10. エラーハンドリングと仕上げ
- [ ] 10.1 エラーハンドリング実装
  - API別エラー処理（部分的成功の許容）
  - エラーバウンダリ設定
  - トースト通知システム
  - リトライ機能
  - _Requirements: 1.4, 1.6_

- [ ] 10.2 レスポンシブ対応
  - モバイル表示最適化
  - タブレット表示最適化
  - フィルターサイドバーの折りたたみ
  - _Requirements: 10.1, 11.1_

---

- [ ] 11. 統合テスト
- [ ] 11.1 検索フロー統合テスト
  - 検索→フィルタ→名寄せの一連の動作確認
  - キャッシュ動作の確認
  - 各API Adapterの統合確認
  - _Requirements: 1.1, 1.2, 1.3, 1.5, 1.6, 2.1, 2.2, 2.3, 3.1, 3.2_

- [ ] 11.2 ユーザーデータフロー統合テスト
  - ログイン→ブックマーク保存→同期確認
  - Modリスト作成→エクスポート確認
  - 設定保存→検索有効化確認
  - _Requirements: 4.1, 5.1, 5.4, 6.1, 7.1, 8.1_

---

## Requirements Coverage Matrix

| Requirement | Tasks |
|-------------|-------|
| 1 (マルチソース検索) | 3.1, 3.2, 3.3, 4.1 |
| 2 (名寄せ) | 4.2, 9.3 |
| 3 (フィルタリング) | 3.1, 3.2, 4.3 |
| 4 (ユーザー認証) | 2.1, 2.2 |
| 5 (ブックマーク) | 1.4, 6.1, 6.2 |
| 6 (Modリスト) | 1.4, 7.1, 7.2 |
| 7 (API設定管理) | 5.1, 5.2 |
| 8 (エクスポート) | 8.1 |
| 9 (キャッシュ) | 3.3, 4.4 |
| 10 (ホーム画面) | 9.1 |
| 11 (検索結果画面) | 9.2, 9.3 |
| 12 (マイライブラリ) | 9.4 |
| 13 (設定画面) | 1.2, 9.5 |
| 14 (セキュリティ) | 5.1 |
| 15 (パフォーマンス) | 4.1 |
| 16 (コスト制約) | 1.1, 1.3 |
