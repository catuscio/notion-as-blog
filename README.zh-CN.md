<div align="center">
  <a href="https://notion-as-blog.vercel.app">
    <img src="docs/screenshots/readme-hero.svg" alt="Notion-As-Blog — 在 Notion 写作，用 Next.js 发布" width="100%" />
  </a>

  <h1>Notion-As-Blog</h1>

  <p>
    <strong>Write in Notion. Publish with Next.js.</strong><br />
    一个精致、可自托管的博客模板，基于 <strong>Notion</strong>、<strong>Next.js 16</strong> 和 <strong>Tailwind CSS 4</strong> 构建。
  </p>

  <p>
    <a href="https://notion-as-blog.vercel.app"><strong>在线文档</strong></a>
    ·
    <a href="https://welcometogyuminworld.notion.site/Notion-As-Blog-30ab152141a480309a9ede1f8cac4cc7?source=copy_link"><strong>复制模板</strong></a>
    ·
    <a href="#快速开始"><strong>快速开始</strong></a>
    ·
    <a href="README.md"><strong>English</strong></a>
    ·
    <a href="README.ko.md"><strong>한국어</strong></a>
    ·
    <strong>简体中文</strong>
    ·
    <a href="README.ja.md"><strong>日本語</strong></a>
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

## 为什么选择 Notion-As-Blog？

Notion-As-Blog 可以把复制后的 Notion 模板变成一个面向生产环境的博客：页面速度快、Notion 图片稳定可用、SEO 友好、支持深色模式、搜索、RSS、站点地图、作者资料，并且整个发布流程都保留在 Notion 中。

<table>
  <tr>
    <td><strong>以 Notion 为中心的写作体验</strong><br />直接在 Notion 中创建文章、页面、标签、分类、系列、作者、缩略图和摘要。</td>
    <td><strong>生产环境默认配置</strong><br />内置 Next.js App Router、静态生成、图片代理、RSS、sitemap、robots.txt、动态 OG 图片和 Organization JSON-LD。</td>
  </tr>
  <tr>
    <td><strong>开箱即用的漂亮界面</strong><br />响应式布局、深色模式、文章动画、置顶文章轮播、Giscus 评论和可定制品牌设置。</td>
    <td><strong>适合自托管</strong><br />可部署到 Vercel、Docker 或你自己的 Node.js 主机，并明确配置环境变量和缓存行为。</td>
  </tr>
</table>

---

## 预览

以下截图来自已部署的官方文档站点。

| 浅色 | 深色 |
|:---:|:---:|
| ![文档首页浅色模式](docs/screenshots/home-desktop.png) | ![文档首页深色模式](docs/screenshots/home-dark.png) |

<p align="center">
  <img src="docs/screenshots/post-desktop.png" alt="文档文章页" width="70%" />
  <br />
  <img src="docs/screenshots/home-mobile.png" alt="移动端文档首页" width="260" />
</p>

---

## 功能特性

- **Notion 作为 CMS** — 直接在 Notion 中撰写和管理文章。
- **多作者支持** — 可选的 Authors data source，支持头像、简介、角色和社交链接。
- **分类、标签和系列** — 支持分类页、标签筛选和系列文章上一篇/下一篇导航。
- **全文搜索** — 内置搜索 API，支持即时下拉结果和独立搜索页。
- **深色模式** — 使用轻量内置偏好设置 hook，支持跟随系统主题。
- **SEO 优化** — Open Graph、动态 OG 图片、sitemap、robots.txt、RSS、canonical URL 和 Organization JSON-LD。
- **稳定的 Notion 图片** — 使用签名图片代理处理会过期的 Notion 上传文件 URL。
- **Giscus 评论** — 在文章详情页使用 GitHub Discussions 评论。
- **响应式 UI** — 使用 Tailwind CSS 4 构建的移动优先布局。
- **自定义品牌** — 可配置站点名称、logo、favicon、颜色、字体、页脚链接、社交链接、分类和文案。
- **Docker 就绪** — 包含多阶段生产 Dockerfile 和 compose 示例。
- **按需重新验证** — 通过受保护的 revalidation endpoint 立即刷新内容。

---

## 快速开始

### 1. 复制 Notion 模板

打开下面的公开 Notion 页面，点击 **Duplicate**，将完整模板复制到你自己的 Notion 工作区。

> **[复制 Notion-As-Blog 模板](https://welcometogyuminworld.notion.site/Notion-As-Blog-30ab152141a480309a9ede1f8cac4cc7?source=copy_link)**

模板包含一个 **Posts** data source、一个可选的 **Authors** data source，以及文档式示例内容。复制后，所有数据库行都属于你的工作区，因此可以安全地编辑或删除。

### 2. 创建 Notion integration

1. 打开 [My Integrations](https://www.notion.so/profile/integrations)，点击 **New integration**。
2. 填写名称，例如 `notion-as-blog`。
3. 选择你复制模板所在的工作区。
4. 复制 **Internal Integration Secret** — 这就是你的 `NOTION_API_KEY`。

### 3. 将 integration 连接到数据库

1. 在 Notion 中打开 **Posts** 数据库页面。
2. 点击右上角 **···** → **Connections** → 找到你的 integration 并点击 **Connect**。
3. 如果你想使用完整作者资料，也对 **Authors** 数据库重复同样操作。

### 4. 获取 data source ID

`NOTION_DATA_SOURCE_ID` 需要的是 **Notion data source ID**。在较新的 Notion API 中，它可能不同于 URL 中显示的 database ID。

打开复制后的 Posts 数据库，连接 integration 后，复制 Posts data source ID 并填入 `NOTION_DATA_SOURCE_ID`。如果需要作者资料，也为 Authors data source 重复此操作。如果误用了 database ID，构建可能会因 `object_not_found` 失败。

### 5. 克隆并配置

```bash
git clone https://github.com/catuscio/notion-as-blog.git
cd notion-as-blog
npm install
cp .env.example .env.local
```

编辑 `.env.local`：

```env
NOTION_API_KEY=secret_xxxxxxxxxxxxxxxxxxxxx
NOTION_DATA_SOURCE_ID=your_posts_data_source_id
NOTION_AUTHORS_DATA_SOURCE_ID=your_authors_data_source_id
TOKEN_FOR_REVALIDATE=any_random_secret_string
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

### 6. 本地运行

```bash
npm run dev
```

打开 [http://localhost:3000](http://localhost:3000) 查看你的博客。

---

## 在 Notion 中写文章

### 创建新文章

1. 在 Notion 中打开 **Posts** 数据库
2. 新增一行并填写属性
3. 在页面正文中撰写内容 — 支持标题、列表、代码块、图片等
4. 准备发布时，将 `status` 设为 **Public**

### Posts 数据库字段

| 字段 | 类型 | 必填 | 描述 |
|---|---|---|---|
| **title** | Title | 是 | 文章标题 |
| **slug** | Rich text | 否 | URL slug（例如 `my-first-post`）。为空时会根据页面 ID 自动生成 |
| **status** | Select | 是 | 发布状态（见下文） |
| **type** | Select | 否 | `Post`（默认）或 `Page` |
| **date** | Date | 是 | 发布日期。文章按此字段排序 |
| **category** | Select | 是 | 必须与 `brand.ts` 中定义的分类名称一致 |
| **tags** | Multi-select | 否 | 用于筛选的自由标签（例如 `Next.js`、`React`） |
| **series** | Select | 否 | 系列名称。选择相同系列的文章会被分组，并显示上一篇/下一篇导航 |
| **author** | People | 否 | Notion 工作区成员。完整作者资料会通过 Authors data source 的 `people` 属性匹配 |
| **summary** | Rich text | 否 | 显示在文章卡片和 SEO meta 中的简短描述 |
| **thumbnail** | Files & media | 否 | 封面图片（上传文件或粘贴外部 URL） |

### Status 值

| 值 | 显示在列表中 | 可通过直接 URL 访问 |
|---|---|---|
| `Public` | 是 | 是 |
| `PublicOnDetail` | 否 | 是 — 同时排除搜索索引的 unlisted 内容，并不提供访问控制 |
| `Draft` | 否 | 否 |
| `Private` | 否 | 否 |

`PublicOnDetail` 对 `Post` 和 `Page` 使用相同规则。它不会出现在信息流、搜索、分类、标签、系列、作者页面、RSS、站点地图、结构化数据、评论或构建时路由生成中。任何知道 URL 的人仍可访问和分享；敏感内容请使用身份验证。

### Type 值

| 值 | 描述 |
|---|---|
| `Post` | 标准博客文章。显示在首页列表、分类页和搜索中 |
| `Page` | 独立页面（例如落地页）。不显示在文章列表中 |

### 使用系列

要将多篇文章归为一个系列，请在这些文章中选择相同的 `series` 值（例如 `Next.js Blog Tutorial`）。博客会在每篇文章详情页渲染系列上一篇/下一篇导航，并提供 `/series/[name]` 页面。

### Authors 数据库（可选）

如果你希望在 Notion People 名称之外提供更丰富的作者资料，请创建（或使用模板中的）Authors data source。文章会通过 Notion 用户 ID 链接到作者资料行：将作者行的 `people` 属性设置为与文章 `author` 属性中选择的同一个 Notion 用户。

| 字段 | 类型 | 描述 |
|---|---|---|
| **name** | Title | 显示在作者卡片和作者页上的名称 |
| **people** | People | 此资料代表的 Notion 工作区用户。用于将文章匹配到作者资料 |
| **role** | Rich text | 职位或角色（例如 `Frontend Engineer`） |
| **bio** | Rich text | 简短个人简介 |
| **avatar** | Files & media | 头像 |
| **email** | Rich text | 邮箱地址 |
| **github** | URL | GitHub 主页 URL |
| **x** | URL | X（Twitter）主页 URL |
| **linkedin** | URL | LinkedIn 主页 URL |
| **website** | URL | 个人网站 URL |

---

## 自定义

所有全站设置都在 `src/config/brand.ts` 中：

### 站点信息

```ts
name: "My Blog",
title: "A Developer Blog",
highlight: "Developer",    // 标题中高亮的词
description: "Your blog description.",
url: "https://your-domain.com",
since: 2025,               // 页脚版权起始年份
lang: "en",
```

### Logo 与 Favicon

```ts
logo: {
  image: "",               // Logo 图片路径（相对于 /public）。"" = 仅显示文字
  showNameWithLogo: true,  // 在 logo 图片旁显示博客名称
  png: "/logo.png",        // 用于 JSON-LD 和 RSS feed
  ogWhite: "/logo-white.png", // 用于 OG 图片的白色 logo 叠加层
  favicon: "",             // 自定义 favicon 路径。"" = 自动生成字母图标
},
```

### 颜色

通过 `colors` 对象中的 HSL 值自定义颜色主题。浅色和深色模式都可以配置。每个主题由 5 个基础值构成：

- **brand** — 强调色（按钮、链接、焦点环）
- **bg** — 页面背景
- **text** — 正文文本
- **surface** — 卡片和弱化区域背景
- **edge** — 边框和输入框描边

### 字体

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

- **sans** — 正文字体栈。非拉丁语言可在前面添加 Web 字体（例如 `'Pretendard, -apple-system, ...'`）
- **mono** — 代码块等宽字体，通过 Google Fonts CDN 加载
- **og** — 动态 OG 图片生成使用的字体（`.otf` 或 `.ttf` URL）

### 分类

分类名称 **必须与** Notion Posts 数据库中的 Select 值一致：

```ts
categories: [
  { name: "Development", slug: "development", color: "orange", icon: "dns", description: "..." },
  { name: "Design", slug: "design", color: "teal", icon: "palette", description: "..." },
  { name: "Product", slug: "product", color: "green", icon: "work", description: "..." },
],
```

### 社交链接

显示在页脚的社交媒体图标链接。将某个值留为 `""` 即可隐藏该图标。

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

### 页脚链接

当前页脚刻意保持简洁，由 `src/components/layout/Footer.tsx` 渲染。它会显示：

- Home
- About
- Template，链接来自 `brand.templateUrl`
- 任何 `brand.social` URL 不为空的社交图标

如果需要更大的页脚导航，请编辑 `Footer.tsx`，并保持标签文案位于 `src/config/copy.ts`。

### SEO

```ts
keywords: ["Next.js", "blog", "frontend"],  // <meta name="keywords"> — 留空 [] 则不输出

organization: {   // Google Knowledge Panel 使用的 Organization JSON-LD（可选）
  name: "Your Company",
  url: "https://your-domain.com",
  logo: "/logo.png",
  // ... address, contactPoint, sameAs, etc.
},
```

### Giscus 评论

设置 [Giscus](https://giscus.app/) 并填写配置：

```ts
giscus: {
  repo: "your-username/your-repo",
  repoId: "R_...",
  category: "Announcements",
  categoryId: "DIC_...",
  mapping: "pathname",         // 文章如何映射到 discussions
  strict: "0",                 // 严格标题匹配
  reactionsEnabled: "1",       // 显示 reaction 按钮
  emitMetadata: "0",           // 输出 discussion metadata
  inputPosition: "bottom",     // 评论输入框位置
},
```

### Newsletter CTA

将 `enabled` 设为 `true`，即可在首页列表底部显示订阅区。实际订阅逻辑需要你自行实现。

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

### 文章动画

```ts
postAnimation: {
  enabled: true,  // 文章详情页标题打字机效果 + slide-up reveal
},
```

### 行为设置

```ts
postsPerPage: 10,                   // 每页文章数量
slideshow: { intervalMs: 5000 },    // 置顶文章轮播自动切换间隔（毫秒）
reading: { wordsPerMinute: 200 },   // 阅读时间计算（英文 200–250，CJK 500–600）
search: {
  dropdownLimit: 10,                // 搜索下拉结果最大数量
  pageLimit: 30,                    // /search 页面最大结果数量
},
```

### 缓存

```ts
cache: {
  revalidate: 1800,       // ISR 间隔秒数（默认 30 分钟）
  feedTtl: 3600,          // RSS Cache-Control max-age（默认 1 小时）
  authorsRevalidate: 300, // 作者缓存重新验证（秒，默认 5 分钟）
},
```

### Notion 图片代理

Notion 托管文件 URL 会过期，因此上传到 Notion 的文件会通过以下稳定签名 URL 渲染：

```txt
/api/notion-image?...
```

该 API route 会在请求时解析当前 Notion 文件 URL，并使用 CDN 缓存 header 代理文件内容。默认代理缓存 TTL 为 3300 秒，安全低于 Notion 1 小时签名 URL 的过期时间：

```env
NOTION_IMAGE_CACHE_SECONDS=3300
NOTION_IMAGE_SIGNING_SECRET=optional-separate-secret
```

外部图片 URL 会直接渲染。如果设置了 `NOTION_IMAGE_SIGNING_SECRET`，请确保预渲染页面和 `/api/notion-image` 运行的任何位置都使用同一个值；否则构建时生成的签名图片 URL 可能在运行时无法验证。

---

## 按需重新验证

博客会缓存 Notion 数据以提升性能。当你在 Notion 中更新文章后，可以触发即时刷新：

```bash
curl -X POST https://your-domain.com/api/revalidate \
  -H "Authorization: Bearer YOUR_TOKEN_FOR_REVALIDATE"
```

你也可以把它配置为 Notion automation，或来自外部服务的 webhook。如果不触发 revalidation，内容会每 30 分钟自动刷新。

---

## 部署

### Vercel（推荐）

1. 将仓库推送到 GitHub
2. 在 [Vercel](https://vercel.com/new) 导入项目
3. 在 Project Settings → Environment Variables 添加环境变量
4. 部署

### Docker

```bash
# 使用 docker compose 构建并运行
docker compose up -d

# 或手动构建（静态生成阶段需要 NOTION_API_KEY）
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

## 环境变量

| 变量 | 必需 | 描述 |
|---|---|---|
| `NOTION_API_KEY` | 是 | Notion integration API key |
| `NOTION_DATA_SOURCE_ID` | 是 | Notion Posts data source ID |
| `NOTION_AUTHORS_DATA_SOURCE_ID` | 否 | Notion Authors data source ID |
| `TOKEN_FOR_REVALIDATE` | 否 | 按需 revalidation 的 secret token（`/api/revalidate`） |
| `NOTION_IMAGE_SIGNING_SECRET` | 否 | 稳定 Notion 图片代理 URL 的 HMAC secret。未设置时默认使用 `NOTION_API_KEY` |
| `NOTION_IMAGE_CACHE_SECONDS` | 否 | 代理 Notion 文件的 CDN cache TTL。上限为 3300 秒 |
| `NEXT_PUBLIC_GA_ID` | 否 | Google Analytics measurement ID |

---

## License

[MIT](LICENSE)
