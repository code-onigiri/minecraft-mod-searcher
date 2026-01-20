# Product Overview

Minecraft Mod横断検索プラットフォーム - 複数のModプラットフォーム（Modrinth, CurseForge, GitHub）を一つのインターフェースから同時に検索・管理できるWebアプリケーション。

## Core Capabilities

- **マルチソース同時検索**: Modrinth, CurseForge, GitHub Releasesを並列検索し、先着結果から順次表示
- **名寄せ（Identity Resolution）**: 同一Modを複数ソースにまたがって検出・統合表示
- **ユーザーデータ管理**: ブックマーク、Modリスト作成、バージョンピン留め、エクスポート
- **BYOK（Bring Your Own Key）**: ユーザー自身のAPIキーでサービス連携（サーバー非送信）

## Target Use Cases

- Mod構成を頻繁に変更する中〜上級者
- Minecraftサーバー管理者
- Modパック作成者
- コミュニティ内での情報共有（Modリストエクスポート）

## Value Proposition

- **分散解消**: 「分散したMod探しの旅を、終わらせる」
- **完全無料**: Free Tier範囲内での運用（アクティブユーザー10〜20名規模）
- **プライバシー重視**: APIキーはブラウザ内暗号化保存、サーバーに送信しない
- **シンプルUX**: 検索 → フィルタ → ブックマーク/リスト化の直感的フロー

## Business Constraints

- 運用コスト: 完全無料（Vercel Free Tier + Supabase Free Tier）
- 初期リリースは日本語のみ
- .mrpack形式エクスポートは将来拡張として検討

---
_created_at: 2026-01-20_
