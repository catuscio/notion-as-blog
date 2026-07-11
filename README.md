<div align="center">
  <a href="https://notion-as-blog.vercel.app">
    <img src="docs/screenshots/readme-hero.svg" alt="Notion-As-Blog — write in Notion, publish with Next.js" width="100%" />
  </a>

  <h1>Notion-As-Blog</h1>

  <p>
    <strong>Write in Notion. Publish with Next.js.</strong><br />
    A polished, self-hostable blog template powered by <strong>Notion</strong>, <strong>Next.js 16</strong>, and <strong>Tailwind CSS 4</strong>.
  </p>

  <p>
    <a href="https://notion-as-blog.vercel.app"><strong>Live Docs</strong></a>
    ·
    <a href="https://welcometogyuminworld.notion.site/Notion-As-Blog-30ab152141a480309a9ede1f8cac4cc7?source=copy_link"><strong>Duplicate Template</strong></a>
    ·
    <a href="#quick-start"><strong>Quick Start</strong></a>
    ·
    <strong>English</strong>
    ·
    <a href="README.ko.md"><strong>한국어</strong></a>
    ·
    <a href="README.zh-CN.md"><strong>简体中文</strong></a>
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

## Why Notion-As-Blog?

Notion-As-Blog turns a duplicated Notion template into a production-grade blog: fast pages, stable Notion image delivery, first-class SEO, dark mode, search, RSS, sitemap, author profiles, and a clean publishing workflow that stays inside Notion.

<table>
  <tr>
    <td><strong>Notion-native writing</strong><br />Create posts, pages, tags, categories, series, authors, thumbnails, and summaries directly in Notion.</td>
    <td><strong>Production web defaults</strong><br />Next.js App Router, static generation, image proxying, RSS, sitemap, robots.txt, dynamic OG images, and Organization JSON-LD.</td>
  </tr>
  <tr>
    <td><strong>Beautiful out of the box</strong><br />Responsive layout, dark mode, post animations, pinned-post slideshow, Giscus comments, and customizable branding.</td>
    <td><strong>Self-host friendly</strong><br />Deploy to Vercel, Docker, or your own Node.js host with explicit environment variables and cache behavior.</td>
  </tr>
</table>

---

## Preview

Fresh screenshots are captured from the deployed documentation site.

| Light | Dark |
|:---:|:---:|
| ![Documentation home light](docs/screenshots/home-desktop.png) | ![Documentation home dark](docs/screenshots/home-dark.png) |

<p align="center">
  <img src="docs/screenshots/post-desktop.png" alt="Documentation article" width="70%" />
  <br />
  <img src="docs/screenshots/home-mobile.png" alt="Mobile documentation home" width="260" />
</p>

---

## Features

- **Notion as CMS** — Write and manage posts directly in Notion.
- **Multi-author support** — Optional Authors data source with avatars, bios, roles, and social links.
- **Categories, tags, and series** — Organize posts with category pages, tag filtering, and previous/next series navigation.
- **Full-text search** — Built-in search API with instant dropdown results and a dedicated search page.
- **Dark mode** — System-aware theme switching with a small built-in preference hook.
- **SEO optimized** — Open Graph, dynamic OG image generation, sitemap, robots.txt, RSS feed, canonical URLs, and Organization JSON-LD.
- **Stable Notion images** — Signed image proxy for uploaded Notion files whose source URLs expire.
- **Giscus comments** — GitHub Discussions-based comments for post detail pages.
- **Responsive UI** — Mobile-first layout styled with Tailwind CSS 4.
- **Custom branding** — Configure name, logo, favicon, colors, fonts, footer links, social links, categories, and copy.
- **Docker ready** — Multi-stage production Dockerfile and compose example.
- **On-demand revalidation** — Refresh content immediately through a protected revalidation endpoint.

---

## Quick Start

### 1. Duplicate the Notion template

Open the public Notion page below and click **Duplicate** to copy the full template into your own Notion workspace.

> **[Duplicate the Notion-As-Blog Template](https://welcometogyuminworld.notion.site/Notion-As-Blog-30ab152141a480309a9ede1f8cac4cc7?source=copy_link)**

The template includes a **Posts** data source, an optional **Authors** data source, and documentation-style sample content. After duplicating, all database rows belong to your workspace, so you can safely edit or delete them.

### 2. Create a Notion integration

1. Go to [My Integrations](https://www.notion.so/profile/integrations) and click **New integration**.
2. Give it a name, for example `notion-as-blog`.
3. Select the workspace where you duplicated the template.
4. Copy the **Internal Integration Secret** — this is your `NOTION_API_KEY`.

### 3. Connect the integration to your databases

1. Open the **Posts** database page in Notion.
2. Click **···** (top-right) → **Connections** → find your integration and **Connect**.
3. Repeat for the **Authors** database if you want rich author profiles.

### 4. Get your data source IDs

`NOTION_DATA_SOURCE_ID` expects the **Notion data source ID**, which can be different from the database ID shown in the URL in recent Notion API versions.

Open the duplicated Posts database, connect your integration, then copy the Posts data source ID for `NOTION_DATA_SOURCE_ID`. Repeat for the Authors data source if you want author profiles. If you accidentally use the database ID, builds can fail with `object_not_found`.

### 5. Clone and configure

```bash
git clone https://github.com/catuscio/notion-as-blog.git
cd notion-as-blog
npm install
cp .env.example .env.local
```

Edit `.env.local`:

```env
NOTION_API_KEY=secret_xxxxxxxxxxxxxxxxxxxxx
NOTION_DATA_SOURCE_ID=your_posts_data_source_id
NOTION_AUTHORS_DATA_SOURCE_ID=your_authors_data_source_id
TOKEN_FOR_REVALIDATE=any_random_secret_string
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

### 6. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see your blog.

---

## Writing Posts in Notion

### Creating a new post

1. Open the **Posts** database in Notion
2. Add a new row and fill in the properties
3. Write your post content in the page body — headings, lists, code blocks, images, and more are all supported
4. Set `status` to **Public** when ready to publish

### Posts database columns

| Column | Type | Required | Description |
|---|---|---|---|
| **title** | Title | Yes | Post title |
| **slug** | Rich text | No | URL slug (e.g. `my-first-post`). Auto-generated from page ID if empty |
| **status** | Select | Yes | Publishing status (see below) |
| **type** | Select | No | `Post` (default) or `Page` |
| **date** | Date | Yes | Publish date. Posts are sorted by this field |
| **category** | Select | Yes | Must match a category name defined in `brand.ts` |
| **tags** | Multi-select | No | Freeform tags for filtering (e.g. `Next.js`, `React`) |
| **series** | Select | No | Series name. Posts with the same selected series are grouped with previous/next navigation |
| **author** | People | No | Notion workspace member(s). Rich author profiles are matched through the Authors data source `people` property |
| **summary** | Rich text | No | Short description shown in post cards and SEO meta |
| **thumbnail** | Files & media | No | Cover image (upload or paste an external URL) |

### Status values

| Value | Shown in listings | Accessible via direct URL |
|---|---|---|
| `Public` | Yes | Yes |
| `PublicOnDetail` | No | Yes — unlisted and excluded from search indexing, but not access-controlled |
| `Draft` | No | No |
| `Private` | No | No |

`PublicOnDetail` applies to both `Post` and `Page` content. It is excluded from feeds, search, category/tag/series/author pages, RSS, sitemap, structured data, comments, and build-time route generation. Anyone who knows the URL can still access and share it; use authentication for sensitive content.

### Type values

| Value | Description |
|---|---|
| `Post` | Standard blog post. Shown in home feed, category pages, and search |
| `Page` | Standalone page (e.g. a landing page). Not shown in post listings |

### Using series

To group posts into a series, select the same `series` value (e.g. `Next.js Blog Tutorial`) on multiple posts. The blog renders series navigation with previous/next links on each post detail page and exposes `/series/[name]` pages.

### Authors database (optional)

If you want richer author profiles beyond the plain Notion People name, create (or use the template's) Authors data source. Posts are linked to author profile rows by Notion user ID: set the author row's `people` property to the same Notion user selected in a post's `author` property.

| Column | Type | Description |
|---|---|---|
| **name** | Title | Display name shown on author cards and author pages |
| **people** | People | Notion workspace user(s) this profile represents. Used for matching posts to author profiles |
| **role** | Rich text | Job title or role (e.g. `Frontend Engineer`) |
| **bio** | Rich text | Short biography |
| **avatar** | Files & media | Profile picture |
| **email** | Rich text | Email address |
| **github** | URL | GitHub profile URL |
| **x** | URL | X (Twitter) profile URL |
| **linkedin** | URL | LinkedIn profile URL |
| **website** | URL | Personal website URL |

---

## Customization

All site-wide settings are in `src/config/brand.ts`:

### Site Info

```ts
name: "My Blog",
title: "A Developer Blog",
highlight: "Developer",    // Highlighted word in the title
description: "Your blog description.",
url: "https://your-domain.com",
since: 2025,               // Footer copyright start year
lang: "en",
```

### Logo & Favicon

```ts
logo: {
  image: "",               // Logo image path (relative to /public). "" = text-only
  showNameWithLogo: true,  // Show blog name next to logo image
  png: "/logo.png",        // Used in JSON-LD and RSS feed
  ogWhite: "/logo-white.png", // White logo overlay for OG images
  favicon: "",             // Custom favicon path. "" = auto-generated letter icon
},
```

### Colors

Customize the color theme using HSL values in the `colors` object. Both light and dark mode colors are configurable. Each theme is built from 5 base values:

- **brand** — Accent color (buttons, links, focus rings)
- **bg** — Page background
- **text** — Body text
- **surface** — Card and muted area backgrounds
- **edge** — Borders and input outlines

### Fonts

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

- **sans** — Font stack for body text. Prepend a web font for non-Latin languages (e.g. `'Pretendard, -apple-system, ...'`)
- **mono** — Monospace font for code blocks, loaded from Google Fonts CDN
- **og** — Font used for dynamic OG image generation (`.otf` or `.ttf` URL)

### Categories

Category names **must match** the Select values in your Notion Posts database:

```ts
categories: [
  { name: "Development", slug: "development", color: "orange", icon: "dns", description: "..." },
  { name: "Design", slug: "design", color: "teal", icon: "palette", description: "..." },
  { name: "Product", slug: "product", color: "green", icon: "work", description: "..." },
],
```

### Social Links

Social media icon links displayed in the footer. Leave a value as `""` to hide that icon.

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

### Footer links

The current footer is intentionally simple and is rendered by `src/components/layout/Footer.tsx`. It shows:

- Home
- About
- Template, linked from `brand.templateUrl`
- Any social icons whose `brand.social` URL is not empty

If you need a larger footer navigation, edit `Footer.tsx` and keep the labels in `src/config/copy.ts`.

### SEO

```ts
keywords: ["Next.js", "blog", "frontend"],  // <meta name="keywords"> — leave [] to omit

organization: {   // Organization JSON-LD for Google Knowledge Panel (optional)
  name: "Your Company",
  url: "https://your-domain.com",
  logo: "/logo.png",
  // ... address, contactPoint, sameAs, etc.
},
```

### Giscus Comments

Set up [Giscus](https://giscus.app/) and fill in the config:

```ts
giscus: {
  repo: "your-username/your-repo",
  repoId: "R_...",
  category: "Announcements",
  categoryId: "DIC_...",
  mapping: "pathname",         // How posts map to discussions
  strict: "0",                 // Strict title matching
  reactionsEnabled: "1",       // Show reaction buttons
  emitMetadata: "0",           // Emit discussion metadata
  inputPosition: "bottom",     // Comment input position
},
```

### Newsletter CTA

Set `enabled` to `true` to show a subscription section at the bottom of the home feed. You need to implement the actual subscription logic separately.

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

### Post Animation

```ts
postAnimation: {
  enabled: true,  // Typewriter title + slide-up reveal on post detail pages
},
```

### Behavior

```ts
postsPerPage: 10,                   // Posts per feed page
slideshow: { intervalMs: 5000 },    // Pinned posts slideshow auto-advance (ms)
reading: { wordsPerMinute: 200 },   // Reading time calculation (200–250 for English, 500–600 for CJK)
search: {
  dropdownLimit: 10,                // Max results in search dropdown
  pageLimit: 30,                    // Max results on /search page
},
```

### Cache

```ts
cache: {
  revalidate: 1800,       // ISR interval in seconds (default: 30 min)
  feedTtl: 3600,          // RSS Cache-Control max-age (default: 1 hour)
  authorsTtlMs: 300000,   // In-memory authors cache (default: 5 min)
},
```

### Notion image proxy

Notion-hosted file URLs expire, so uploaded Notion files are rendered through stable signed URLs under:

```txt
/api/notion-image?...
```

The API route resolves the current Notion file URL on request and proxies the bytes with CDN cache headers. The default proxy cache TTL is 3300 seconds, safely below Notion's 1-hour signed URL expiry:

```env
NOTION_IMAGE_CACHE_SECONDS=3300
NOTION_IMAGE_SIGNING_SECRET=optional-separate-secret
```

External image URLs are rendered directly. If you set `NOTION_IMAGE_SIGNING_SECRET`, keep the same value available anywhere pre-rendered pages and `/api/notion-image` run; otherwise signed image URLs generated at build time may not validate at runtime.

---

## On-Demand Revalidation

The blog caches Notion data for performance. When you update a post in Notion, you can trigger an instant refresh:

```bash
curl -X POST https://your-domain.com/api/revalidate \
  -H "Authorization: Bearer YOUR_TOKEN_FOR_REVALIDATE"
```

You can also set this up as a Notion automation or a webhook from an external service. Without triggering revalidation, content refreshes automatically every 30 minutes.

---

## Deployment

### Vercel (Recommended)

1. Push your repository to GitHub
2. Import the project on [Vercel](https://vercel.com/new)
3. Add environment variables in Project Settings → Environment Variables
4. Deploy

### Docker

```bash
# Build and run with docker compose
docker compose up -d

# Or build manually (NOTION_API_KEY is needed at build time for static generation)
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

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `NOTION_API_KEY` | Yes | Notion integration API key |
| `NOTION_DATA_SOURCE_ID` | Yes | Notion Posts data source ID |
| `NOTION_AUTHORS_DATA_SOURCE_ID` | No | Notion Authors data source ID |
| `TOKEN_FOR_REVALIDATE` | No | Secret token for on-demand revalidation (`/api/revalidate`) |
| `NOTION_IMAGE_SIGNING_SECRET` | No | HMAC secret for stable Notion image proxy URLs. Defaults to `NOTION_API_KEY` when omitted |
| `NOTION_IMAGE_CACHE_SECONDS` | No | CDN cache TTL for proxied Notion files. Capped at 3300 seconds |
| `NEXT_PUBLIC_GA_ID` | No | Google Analytics measurement ID |

---

## License

[MIT](LICENSE)
