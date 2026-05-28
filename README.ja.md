<div align="center">
  <a href="https://notion-as-blog.vercel.app">
    <img src="docs/screenshots/readme-hero.svg" alt="Notion-As-Blog — Notion で書いて Next.js で公開" width="100%" />
  </a>

  <h1>Notion-As-Blog</h1>

  <p>
    <strong>Write in Notion. Publish with Next.js.</strong><br />
    <strong>Notion</strong>、<strong>Next.js 16</strong>、<strong>Tailwind CSS 4</strong> で構築された、洗練されたセルフホスト対応ブログテンプレートです。
  </p>

  <p>
    <a href="https://notion-as-blog.vercel.app"><strong>公式ドキュメント</strong></a>
    ·
    <a href="https://welcometogyuminworld.notion.site/Notion-As-Blog-30ab152141a480309a9ede1f8cac4cc7?source=copy_link"><strong>テンプレートを複製</strong></a>
    ·
    <a href="#クイックスタート"><strong>クイックスタート</strong></a>
    ·
    <a href="README.md"><strong>English</strong></a>
    ·
    <a href="README.ko.md"><strong>한국어</strong></a>
    ·
    <a href="README.zh-CN.md"><strong>简体中文</strong></a>
    ·
    <strong>日本語</strong>
  </p>

  <p>
    <img alt="Next.js" src="https://img.shields.io/badge/Next.js-16-000000?style=for-the-badge&logo=next.js&logoColor=white" />
    <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white" />
    <img alt="Tailwind CSS" src="https://img.shields.io/badge/Tailwind_CSS-4-38BDF8?style=for-the-badge&logo=tailwindcss&logoColor=white" />
    <img alt="Notion" src="https://img.shields.io/badge/Notion-CMS-000000?style=for-the-badge&logo=notion&logoColor=white" />
    <img alt="License" src="https://img.shields.io/badge/License-MIT-22C55E?style=for-the-badge" />
  </p>
</div>

---

## なぜ Notion-As-Blog？

Notion-As-Blog は、複製した Notion テンプレートを本番運用できるブログに変換します。高速なページ、安定した Notion 画像配信、SEO、ダークモード、検索、RSS、サイトマップ、著者プロフィール、そして Notion 内で完結する公開ワークフローを備えています。

<table>
  <tr>
    <td><strong>Notion ネイティブな執筆体験</strong><br />記事、ページ、タグ、カテゴリ、シリーズ、著者、サムネイル、概要を Notion で直接作成できます。</td>
    <td><strong>本番向けの標準機能</strong><br />Next.js App Router、静的生成、画像プロキシ、RSS、sitemap、robots.txt、動的 OG 画像、Organization JSON-LD を内蔵しています。</td>
  </tr>
  <tr>
    <td><strong>美しい初期デザイン</strong><br />レスポンシブレイアウト、ダークモード、記事アニメーション、固定記事スライドショー、Giscus コメント、ブランド設定のカスタマイズに対応します。</td>
    <td><strong>セルフホストしやすい</strong><br />Vercel、Docker、または自前の Node.js ホストへデプロイでき、環境変数とキャッシュ挙動を明示的に設定できます。</td>
  </tr>
</table>

---

## プレビュー

以下のスクリーンショットは、デプロイ済みの公式ドキュメントサイトから取得したものです。

| ライト | ダーク |
|:---:|:---:|
| ![ドキュメントホーム ライト](docs/screenshots/home-desktop.png) | ![ドキュメントホーム ダーク](docs/screenshots/home-dark.png) |

<p align="center">
  <img src="docs/screenshots/post-desktop.png" alt="ドキュメント記事" width="70%" />
  <br />
  <img src="docs/screenshots/home-mobile.png" alt="モバイル版ドキュメントホーム" width="260" />
</p>

---

## 主な機能

- **Notion as CMS** — Notion 上で記事を直接執筆・管理できます。
- **複数著者対応** — 任意の Authors data source で、アバター、プロフィール、役割、ソーシャルリンクを管理できます。
- **カテゴリ、タグ、シリーズ** — カテゴリページ、タグフィルタ、シリーズの前後ナビゲーションに対応します。
- **全文検索** — 内蔵検索 API、即時ドロップダウン結果、専用検索ページを提供します。
- **ダークモード** — 小さな組み込み preference hook により、システム設定に追従します。
- **SEO 最適化** — Open Graph、動的 OG 画像、sitemap、robots.txt、RSS、canonical URL、Organization JSON-LD に対応します。
- **安定した Notion 画像** — 有効期限のある Notion アップロードファイル URL を、署名付き画像プロキシで安定して配信します。
- **Giscus コメント** — 記事詳細ページに GitHub Discussions ベースのコメントを追加できます。
- **レスポンシブ UI** — Tailwind CSS 4 によるモバイルファーストなレイアウトです。
- **ブランドカスタマイズ** — 名前、logo、favicon、色、フォント、フッターリンク、ソーシャルリンク、カテゴリ、文言を設定できます。
- **Docker 対応** — マルチステージの本番用 Dockerfile と compose 例を含みます。
- **オンデマンド revalidation** — 保護された revalidation endpoint から即時にコンテンツを更新できます。

---

## クイックスタート

### 1. Notion テンプレートを複製する

下記の公開 Notion ページを開き、**Duplicate** をクリックしてテンプレート全体を自分の Notion ワークスペースにコピーします。

> **[Notion-As-Blog テンプレートを複製](https://welcometogyuminworld.notion.site/Notion-As-Blog-30ab152141a480309a9ede1f8cac4cc7?source=copy_link)**

テンプレートには **Posts** data source、任意の **Authors** data source、ドキュメント形式のサンプルコンテンツが含まれています。複製後、すべてのデータベース行はあなたのワークスペースに属するため、安全に編集・削除できます。

### 2. Notion integration を作成する

1. [My Integrations](https://www.notion.so/profile/integrations) を開き、**New integration** をクリックします。
2. `notion-as-blog` などの名前を付けます。
3. テンプレートを複製したワークスペースを選択します。
4. **Internal Integration Secret** をコピーします — これが `NOTION_API_KEY` です。

### 3. integration をデータベースに接続する

1. Notion で **Posts** データベースページを開きます。
2. 右上の **···** → **Connections** → 作成した integration を探して **Connect** をクリックします。
3. 詳細な著者プロフィールを使う場合は、**Authors** データベースでも同じ操作を行います。

### 4. data source ID を取得する

`NOTION_DATA_SOURCE_ID` には **Notion data source ID** が必要です。最近の Notion API では、URL に表示される database ID と異なる場合があります。

複製した Posts データベースを開き、integration を接続したうえで、Posts data source ID を `NOTION_DATA_SOURCE_ID` に設定します。著者プロフィールを使う場合は Authors data source でも同様に設定します。誤って database ID を使うと、ビルドが `object_not_found` で失敗することがあります。

### 5. クローンして設定する

```bash
git clone https://github.com/catuscio/notion-as-blog.git
cd notion-as-blog
npm install
cp .env.example .env.local
```

`.env.local` を編集します：

```env
NOTION_API_KEY=secret_xxxxxxxxxxxxxxxxxxxxx
NOTION_DATA_SOURCE_ID=your_posts_data_source_id
NOTION_AUTHORS_DATA_SOURCE_ID=your_authors_data_source_id
TOKEN_FOR_REVALIDATE=any_random_secret_string
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

### 6. ローカルで実行する

```bash
npm run dev
```

[http://localhost:3000](http://localhost:3000) を開くとブログを確認できます。

---

## Notion で記事を書く

### 新しい記事を作成する

1. Notion で **Posts** データベースを開きます
2. 新しい行を追加し、各プロパティを入力します
3. ページ本文に記事を書きます — 見出し、リスト、コードブロック、画像などに対応しています
4. 公開準備ができたら `status` を **Public** に設定します

### Posts データベースの列

| 列 | 型 | 必須 | 説明 |
|---|---|---|---|
| **title** | Title | はい | 記事タイトル |
| **slug** | Rich text | いいえ | URL slug（例：`my-first-post`）。空の場合はページ ID から自動生成されます |
| **status** | Select | はい | 公開状態（下記参照） |
| **type** | Select | いいえ | `Post`（デフォルト）または `Page` |
| **date** | Date | はい | 公開日。このフィールドで記事が並び替えられます |
| **category** | Select | はい | `brand.ts` で定義したカテゴリ名と一致している必要があります |
| **tags** | Multi-select | いいえ | フィルタ用の自由なタグ（例：`Next.js`、`React`） |
| **series** | Select | いいえ | シリーズ名。同じ series を選んだ記事はグループ化され、前後ナビゲーションが表示されます |
| **author** | People | いいえ | Notion ワークスペースメンバー。詳細な著者プロフィールは Authors data source の `people` プロパティで一致させます |
| **summary** | Rich text | いいえ | 記事カードと SEO meta に表示される短い説明 |
| **thumbnail** | Files & media | いいえ | カバー画像（アップロードまたは外部 URL の貼り付け） |

### Status の値

| 値 | 一覧に表示 | 直接 URL でアクセス可能 |
|---|---|---|
| `Public` | はい | はい |
| `PublicOnDetail` | いいえ | はい — リンク共有用の非掲載記事に便利です |
| `Draft` | いいえ | いいえ |
| `Private` | いいえ | いいえ |

### Type の値

| 値 | 説明 |
|---|---|
| `Post` | 標準のブログ記事。ホームフィード、カテゴリページ、検索に表示されます |
| `Page` | 独立ページ（例：ランディングページ）。記事一覧には表示されません |

### シリーズを使う

複数の記事をシリーズ化するには、それらの記事で同じ `series` 値（例：`Next.js Blog Tutorial`）を選択します。ブログは各記事詳細ページにシリーズの前後リンクを表示し、`/series/[name]` ページも提供します。

### Authors データベース（任意）

Notion People の名前だけでなく、より詳しい著者プロフィールを表示したい場合は、Authors data source を作成するか、テンプレートのものを使用します。記事は Notion ユーザー ID によって著者プロフィール行にリンクされます。著者行の `people` プロパティを、記事の `author` プロパティで選択した同じ Notion ユーザーに設定してください。

| 列 | 型 | 説明 |
|---|---|---|
| **name** | Title | 著者カードと著者ページに表示される名前 |
| **people** | People | このプロフィールが表す Notion ワークスペースユーザー。記事と著者プロフィールのマッチングに使われます |
| **role** | Rich text | 役職やロール（例：`Frontend Engineer`） |
| **bio** | Rich text | 短い自己紹介 |
| **avatar** | Files & media | プロフィール画像 |
| **email** | Rich text | メールアドレス |
| **github** | URL | GitHub プロフィール URL |
| **x** | URL | X（Twitter）プロフィール URL |
| **linkedin** | URL | LinkedIn プロフィール URL |
| **website** | URL | 個人サイト URL |

---

## カスタマイズ

サイト全体の設定は `src/config/brand.ts` にあります：

### サイト情報

```ts
name: "My Blog",
title: "A Developer Blog",
highlight: "Developer",    // タイトルで強調する単語
description: "Your blog description.",
url: "https://your-domain.com",
since: 2025,               // フッターのコピーライト開始年
lang: "en",
```

### Logo と Favicon

```ts
logo: {
  image: "",               // Logo 画像パス（/public からの相対パス）。"" = テキストのみ
  showNameWithLogo: true,  // logo 画像の横にブログ名を表示
  png: "/logo.png",        // JSON-LD と RSS feed で使用
  ogWhite: "/logo-white.png", // OG 画像で重ねる白い logo
  favicon: "",             // カスタム favicon パス。"" = 自動生成される文字アイコン
},
```

### 色

`colors` オブジェクト内の HSL 値でカラーテーマをカスタマイズできます。ライトモードとダークモードの両方を設定できます。各テーマは 5 つの基本値で構成されます：

- **brand** — アクセントカラー（ボタン、リンク、フォーカスリング）
- **bg** — ページ背景
- **text** — 本文テキスト
- **surface** — カードや muted 領域の背景
- **edge** — 境界線と入力欄のアウトライン

### フォント

```ts
fonts: {
  sans: {
    stack: 'Inter, -apple-system, BlinkMacSystemFont, system-ui, sans-serif',
  },
  mono: {
    family: "JetBrains Mono",
    cdn: "https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&display=swap",
    preconnect: ["https://fonts.googleapis.com", "https://fonts.gstatic.com"],
  },
  og: {
    family: "Pretendard",
    url: "https://cdn.jsdelivr.net/.../Pretendard-Bold.otf",
  },
},
```

- **sans** — 本文用フォントスタック。非ラテン言語では先頭に Web フォントを追加できます（例：`'Pretendard, -apple-system, ...'`）
- **mono** — コードブロック用の等幅フォント。Google Fonts CDN から読み込まれます
- **og** — 動的 OG 画像生成に使うフォント（`.otf` または `.ttf` URL）

### カテゴリ

カテゴリ名は Notion Posts データベースの Select 値と **一致している必要があります**：

```ts
categories: [
  { name: "Development", slug: "development", color: "orange", icon: "dns", description: "..." },
  { name: "Design", slug: "design", color: "teal", icon: "palette", description: "..." },
  { name: "Product", slug: "product", color: "green", icon: "work", description: "..." },
],
```

### ソーシャルリンク

フッターに表示されるソーシャルメディアアイコンのリンクです。値を `""` にすると、そのアイコンは非表示になります。

```ts
social: {
  github: "https://github.com/your-username",
  twitter: "",
  instagram: "",
  facebook: "",
  youtube: "",
  linkedin: "",
  threads: "",
  tiktok: "",
  naverBlog: "",
},
```

### フッターリンク

現在のフッターは意図的にシンプルで、`src/components/layout/Footer.tsx` によってレンダリングされます。表示されるものは次のとおりです：

- Home
- About
- Template（`brand.templateUrl` からリンク）
- `brand.social` の URL が空でないソーシャルアイコン

より大きなフッターナビゲーションが必要な場合は `Footer.tsx` を編集し、ラベルは `src/config/copy.ts` に保持してください。

### SEO

```ts
keywords: ["Next.js", "blog", "frontend"],  // <meta name="keywords"> — [] にすると省略

organization: {   // Google Knowledge Panel 向けの Organization JSON-LD（任意）
  name: "Your Company",
  url: "https://your-domain.com",
  logo: "/logo.png",
  // ... address, contactPoint, sameAs, etc.
},
```

### Giscus コメント

[Giscus](https://giscus.app/) を設定し、以下を入力します：

```ts
giscus: {
  repo: "your-username/your-repo",
  repoId: "R_...",
  category: "Announcements",
  categoryId: "DIC_...",
  mapping: "pathname",         // 記事を discussions にマッピングする方法
  strict: "0",                 // タイトルの厳密一致
  reactionsEnabled: "1",       // reaction ボタンを表示
  emitMetadata: "0",           // discussion metadata を出力
  inputPosition: "bottom",     // コメント入力欄の位置
},
```

### Newsletter CTA

`enabled` を `true` にすると、ホームフィード下部に購読セクションを表示できます。実際の購読ロジックは別途実装する必要があります。

```ts
newsletter: {
  enabled: false,
  headline: "Stay ahead of the curve",
  description: "Join developers receiving the best content...",
  placeholder: "Enter your email address",
  cta: "Subscribe",
  disclaimer: "No spam, unsubscribe anytime.",
},
```

### 記事アニメーション

```ts
postAnimation: {
  enabled: true,  // 記事詳細ページのタイプライタータイトル + slide-up reveal
},
```

### 挙動設定

```ts
postsPerPage: 10,                   // フィード 1 ページあたりの記事数
slideshow: { intervalMs: 5000 },    // 固定記事スライドショーの自動切り替え間隔（ms）
reading: { wordsPerMinute: 200 },   // 読了時間計算（英語 200–250、CJK 500–600）
search: {
  dropdownLimit: 10,                // 検索ドロップダウンの最大結果数
  pageLimit: 30,                    // /search ページの最大結果数
},
```

### キャッシュ

```ts
cache: {
  revalidate: 1800,       // ISR 間隔（秒）。デフォルト 30 分
  feedTtl: 3600,          // RSS Cache-Control max-age。デフォルト 1 時間
  authorsTtlMs: 300000,   // メモリ上の著者キャッシュ。デフォルト 5 分
},
```

### Notion 画像プロキシ

Notion がホストするファイル URL は期限切れになるため、Notion にアップロードされたファイルは次の安定した署名付き URL 経由でレンダリングされます：

```txt
/api/notion-image?...
```

この API route はリクエスト時に現在の Notion ファイル URL を解決し、CDN キャッシュ header 付きでバイト列をプロキシします。デフォルトのプロキシキャッシュ TTL は 3300 秒で、Notion の 1 時間署名 URL 期限より安全に短くなっています：

```env
NOTION_IMAGE_CACHE_SECONDS=3300
NOTION_IMAGE_SIGNING_SECRET=optional-separate-secret
```

外部画像 URL は直接レンダリングされます。`NOTION_IMAGE_SIGNING_SECRET` を設定する場合は、プリレンダリングされたページと `/api/notion-image` が実行されるすべての場所で同じ値を利用できるようにしてください。そうしないと、ビルド時に生成された署名付き画像 URL が実行時に検証できない場合があります。

---

## オンデマンド revalidation

ブログはパフォーマンスのために Notion データをキャッシュします。Notion で記事を更新したら、即時更新をトリガーできます：

```bash
curl -X POST https://your-domain.com/api/revalidate \
  -H "Authorization: Bearer YOUR_TOKEN_FOR_REVALIDATE"
```

Notion automation や外部サービスの webhook として設定することもできます。revalidation を実行しない場合、コンテンツは 30 分ごとに自動更新されます。

---

## デプロイ

### Vercel（推奨）

1. リポジトリを GitHub に push します
2. [Vercel](https://vercel.com/new) でプロジェクトをインポートします
3. Project Settings → Environment Variables に環境変数を追加します
4. デプロイします

### Docker

```bash
# docker compose でビルドして実行
docker compose up -d

# または手動でビルド（静的生成にはビルド時に NOTION_API_KEY が必要です）
docker build -t notion-as-blog \
  --build-arg NOTION_API_KEY=your_key \
  --build-arg NOTION_DATA_SOURCE_ID=your_data_source_id \
  .
docker run -p 3000:3000 \
  -e NOTION_API_KEY=your_key \
  -e NOTION_DATA_SOURCE_ID=your_data_source_id \
  -e NOTION_AUTHORS_DATA_SOURCE_ID=your_authors_data_source_id \
  -e TOKEN_FOR_REVALIDATE=your_revalidate_token \
  -e NOTION_IMAGE_SIGNING_SECRET=your_image_signing_secret \
  -e NOTION_IMAGE_CACHE_SECONDS=3300 \
  notion-as-blog
```

---

## 環境変数

| 変数 | 必須 | 説明 |
|---|---|---|
| `NOTION_API_KEY` | はい | Notion integration API key |
| `NOTION_DATA_SOURCE_ID` | はい | Notion Posts data source ID |
| `NOTION_AUTHORS_DATA_SOURCE_ID` | いいえ | Notion Authors data source ID |
| `TOKEN_FOR_REVALIDATE` | いいえ | オンデマンド revalidation 用の secret token（`/api/revalidate`） |
| `NOTION_IMAGE_SIGNING_SECRET` | いいえ | 安定した Notion 画像プロキシ URL のための HMAC secret。未設定時は `NOTION_API_KEY` を使用します |
| `NOTION_IMAGE_CACHE_SECONDS` | いいえ | プロキシされた Notion ファイルの CDN cache TTL。上限は 3300 秒 |
| `NEXT_PUBLIC_GA_ID` | いいえ | Google Analytics measurement ID |

---

## License

[MIT](LICENSE)
