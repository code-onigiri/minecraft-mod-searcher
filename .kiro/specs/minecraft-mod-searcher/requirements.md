# Requirements Document

## Introduction

本ドキュメントは「Minecraft Mod 横断検索プラットフォーム (minecraft-mod-searcher)」の機能要件を定義します。

**製品コンセプト**: 「分散したMod探しの旅を、終わらせる」

Modrinth, CurseForge, GitHub Releasesなど、複数のプラットフォームに散らばるMinecraft Modを一つのインターフェースから同時に検索・管理できるWebアプリケーションです。

**ターゲットユーザー**: Mod構成を頻繁にいじる中〜上級者、サーバー管理者、Modパック作成者  
**想定規模**: アクティブユーザー10〜20名程度（身内・コミュニティ利用）  
**運用コスト**: 完全無料（Free Tier範囲内での運用を絶対条件とする）

---

## Requirements

### Requirement 1: マルチソース検索
**Objective:** As a Modユーザー, I want 複数のModプラットフォーム（Modrinth, CurseForge, GitHub）を一度に検索したい, so that 各サイトを個別に開く手間を省ける

#### Acceptance Criteria
1. When ユーザーが検索バーにキーワードを入力してEnterキーを押す, the Mod Searcher shall Modrinth APIに検索リクエストを送信し、結果を表示する
2. When ユーザーが検索バーにキーワードを入力する, the Mod Searcher shall 300ms以上のDebounce処理後に検索を実行する
3. While CurseForge API Keyが設定されている, when ユーザーが検索を実行する, the Mod Searcher shall CurseForge APIに直接リクエストを送信する
4. While CurseForge API Keyが未設定, the Mod Searcher shall CurseForge検索をスキップし、ソースインジケーターをグレーアウト表示する
5. While ユーザーがGitHub OAuthでログイン済み, when ユーザーが検索を実行する, the Mod Searcher shall GitHub APIに直接リクエストを送信し、Releases情報を取得する
6. When 複数のAPIからレスポンスが返る, the Mod Searcher shall 先に返ってきた結果から順次表示し、遅延レスポンスを待たない

### Requirement 2: 検索結果の名寄せ（Identity Resolution）
**Objective:** As a Modユーザー, I want 同一Modが複数ソースに存在する場合、1つのカードに統合表示してほしい, so that 重複なく検索結果を確認できる

#### Acceptance Criteria
1. When 異なるソースの検索結果でModスラッグが完全一致する, the Mod Searcher shall それらを同一Modとして統合し、1つのカードで表示する
2. When Modrinthのメタデータ内のGitHubリンクがGitHub検索結果と一致する, the Mod Searcher shall それらを同一Modとして統合する
3. When 統合されたModカードを表示する, the Mod Searcher shall 利用可能なソースのアイコン（Modrinth/CurseForge/GitHub）を全て点灯させる

### Requirement 3: 検索フィルタリング
**Objective:** As a Modユーザー, I want Minecraftバージョンやローダー種別でフィルタリングしたい, so that 自分の環境に対応するModだけを見つけられる

#### Acceptance Criteria
1. When ユーザーがMinecraftバージョンフィルターを選択する, the Mod Searcher shall 選択されたバージョンに対応するModのみを表示する
2. When ユーザーがローダー（Fabric/Forge/NeoForge/Quilt）フィルターを選択する, the Mod Searcher shall 選択されたローダーに対応するModのみを表示する
3. Where API側でフィルタリング可能な場合, the Mod Searcher shall APIパラメータでフィルタリングを実行する
4. Where API側でフィルタリング不可能な場合, the Mod Searcher shall 取得後にクライアント側でフィルタリングを実行する

### Requirement 4: ユーザー認証
**Objective:** As a ユーザー, I want アカウントを作成してログインしたい, so that 複数デバイス間でデータを同期できる

#### Acceptance Criteria
1. When ユーザーが「GitHubでログイン」ボタンをクリックする, the Mod Searcher shall GitHub OAuthフローを開始し、認証後にセッションを確立する
2. When ユーザーがメールアドレスとパスワードでサインアップする, the Mod Searcher shall Supabase Authでアカウントを作成する
3. When ユーザーがログインに成功する, the Mod Searcher shall セッションを長期間保持する
4. When ユーザーがログアウトする, the Mod Searcher shall セッションを破棄し、未認証状態に戻す

### Requirement 5: ブックマーク機能
**Objective:** As a ログインユーザー, I want 気に入ったModをブックマークしたい, so that 後から簡単にアクセスできる

#### Acceptance Criteria
1. When ログインユーザーがModカードのブックマークボタンをクリックする, the Mod Searcher shall 当該Modをブックマークリストに追加し、Supabaseに保存する
2. When ブックマークを保存する, the Mod Searcher shall Mod名、各ソースの参照元URL、アイコンURLを保存する
3. When ユーザーがブックマーク済みModにメモを追加する, the Mod Searcher shall メモをブックマークデータに紐づけて保存する
4. When ユーザーが別デバイスでログインする, the Mod Searcher shall 保存済みブックマークをSupabaseから同期して表示する
5. When ユーザーがブックマークを削除する, the Mod Searcher shall 当該ブックマークをSupabaseから削除する

### Requirement 6: Modリスト作成（Modpack Planning）
**Objective:** As a Modパック作成者, I want 複数のModをグルーピングしてリスト化したい, so that Modパック構成を管理・共有できる

#### Acceptance Criteria
1. When ユーザーが新しいModリストを作成する, the Mod Searcher shall リスト名を入力させ、空のリストをSupabaseに保存する
2. When ユーザーがModをリストに追加する, the Mod Searcher shall 当該Modをリストに紐づけて保存する
3. When ユーザーがリスト内のModに特定バージョン（ファイルID）をピン留めする, the Mod Searcher shall バージョン情報を保存する
4. When ユーザーがリストからModを削除する, the Mod Searcher shall 当該Modをリストから除去する
5. When ユーザーがリスト自体を削除する, the Mod Searcher shall リストと紐づくMod情報を全て削除する

### Requirement 7: API設定管理（The Vault）
**Objective:** As a ユーザー, I want CurseForge API KeyやGitHub連携を管理したい, so that 追加のModソースを有効化できる

#### Acceptance Criteria
1. When ユーザーがCurseForge API Keyを入力する, the Mod Searcher shall 入力されたキーをLocalStorageに暗号化して保存する
2. The Mod Searcher shall CurseForge API KeyをSupabase（永続DB）に保存しない
3. The Mod Searcher shall CurseForge検索時にAPIキーがプロキシを通過することを設定画面で明示する
4. When ユーザーがCurseForge API Keyを削除する, the Mod Searcher shall LocalStorageから当該キーを削除し、CurseForge検索を無効化する
4. When ユーザーがGitHub連携状態を確認する, the Mod Searcher shall 現在の連携状態（接続済み/未接続）を表示する
5. When ユーザーがGitHub再認証を要求する, the Mod Searcher shall 既存のトークンを破棄し、新たにOAuthフローを開始する

### Requirement 8: エクスポート機能
**Objective:** As a Modパック作成者, I want 作成したModリストをエクスポートしたい, so that 外部ツールや他ユーザーと共有できる

#### Acceptance Criteria
1. When ユーザーがテキスト形式でエクスポートを選択する, the Mod Searcher shall Modリストをマークダウンリンク一覧形式で出力する
2. When ユーザーがクリップボードコピーを選択する, the Mod Searcher shall エクスポート内容をクリップボードにコピーする
3. When ユーザーがファイルダウンロードを選択する, the Mod Searcher shall エクスポート内容をファイルとしてダウンロードさせる

### Requirement 9: キャッシュとレート制限対策
**Objective:** As a システム管理者, I want API呼び出しを最適化したい, so that 無料枠の制限内で運用できる

#### Acceptance Criteria
1. When 検索が実行される, the Mod Searcher shall 検索結果をブラウザのsessionStorageまたはIndexedDBにキャッシュする
2. When 同一キーワードで再検索が実行される, while キャッシュが有効期限内（5〜10分）, the Mod Searcher shall キャッシュから結果を返し、APIを呼び出さない
3. The Mod Searcher shall 各APIのレート制限を超えないようキャッシュ戦略を維持する
4. While GitHub OAuthでログイン済み, the Mod Searcher shall GitHub APIレートリミットを5,000リクエスト/時として利用する

### Requirement 10: UI/UX - ホーム画面
**Objective:** As a Modユーザー, I want 直感的なホーム画面から検索を開始したい, so that すぐにMod探しを始められる

#### Acceptance Criteria
1. When ユーザーがホーム画面にアクセスする, the Mod Searcher shall 中央に大きな検索バーを表示する
2. The Mod Searcher shall ホーム画面にトレンドModまたは人気Modを表示する

### Requirement 11: UI/UX - 検索結果画面
**Objective:** As a Modユーザー, I want 検索結果を見やすく確認したい, so that 目的のModを素早く見つけられる

#### Acceptance Criteria
1. When 検索結果を表示する, the Mod Searcher shall 左側にフィルターサイドバー、右側に検索結果一覧を表示する
2. When Modカードを表示する, the Mod Searcher shall Modタイトル、アイコン、説明文、対応バージョン、ローダーバッジ、ソースインジケーター、最終更新日を含める
3. When ソースインジケーターを表示する, the Mod Searcher shall Modrinthを緑、CurseForgeをオレンジ、GitHubを黒で色分けする
4. While APIレスポンスを待機中, the Mod Searcher shall Skeleton UIを表示する

### Requirement 12: UI/UX - マイライブラリ画面
**Objective:** As a ログインユーザー, I want ブックマークとModリストを管理したい, so that 保存したMod情報に簡単にアクセスできる

#### Acceptance Criteria
1. When ユーザーがマイライブラリ画面にアクセスする, the Mod Searcher shall ブックマーク一覧と作成済みModリスト一覧を表示する
2. When ユーザーがModリストを選択する, the Mod Searcher shall リスト内のMod一覧を表示する

### Requirement 13: UI/UX - 設定画面
**Objective:** As a ユーザー, I want アプリの設定を変更したい, so that 自分好みにカスタマイズできる

#### Acceptance Criteria
1. When ユーザーが設定画面にアクセスする, the Mod Searcher shall API設定セクションと外観設定セクションを表示する
2. When ユーザーがダークモードを切り替える, the Mod Searcher shall アプリ全体のテーマを即座に変更する

### Requirement 14: セキュリティ
**Objective:** As a セキュリティ意識の高いユーザー, I want 機密情報が安全に管理されてほしい, so that APIキーや個人情報が漏洩しない

#### Acceptance Criteria
1. The Mod Searcher shall CurseForge API Keyをサーバーに送信せず、LocalStorageのみに暗号化保存する
2. The Mod Searcher shall CurseForge APIに直接アクセスし、APIキーはブラウザ内で完結させる（真のBYOK）

### Requirement 15: パフォーマンス
**Objective:** As a ユーザー, I want 検索結果が素早く表示されてほしい, so that ストレスなくMod探しができる

#### Acceptance Criteria
1. When 検索が実行される, the Mod Searcher shall 各APIへのリクエストを並列（Promise.all相当）で実行する
2. The Mod Searcher shall 最も遅いレスポンスを待たずに、返ってきた結果から順次UIに反映する

### Requirement 16: コスト制約遵守
**Objective:** As a プロジェクトオーナー, I want 運用コストをゼロに保ちたい, so that 無料で継続運用できる

#### Acceptance Criteria
1. The Mod Searcher shall Supabaseの無料枠（500MB）を超えないよう、画像を外部URL参照とし、テキストメタデータのみを保存する
2. The Mod Searcher shall Vercelの無料枠内でフロントエンドをホスティングする
