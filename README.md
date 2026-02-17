# Notion-As-Blog

A modern, open-source blog template powered by **Notion** as a CMS and **Next.js 16**.
Write posts in Notion, and they appear on your blog automatically.

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38bdf8?logo=tailwindcss)
![License](https://img.shields.io/badge/License-MIT-green)

---

## Features

- **Notion as CMS** — Write and manage posts directly in Notion
- **Multi-author support** — Separate authors database with avatars, bios, and social links
- **Categories & tags** — Organize posts with customizable categories and freeform tags
- **Series** — Group related posts into a series with navigation
- **Full-text search** — Built-in search API with instant results
- **Dark mode** — System-aware theme switching via `next-themes`
- **SEO optimized** — Open Graph, sitemap, robots.txt, and RSS feed
- **Giscus comments** — GitHub Discussions-based commenting system
- **Responsive design** — Mobile-first layout with Tailwind CSS
- **Docker ready** — Production Dockerfile with multi-stage build
- **On-demand revalidation** — Webhook endpoint to refresh content instantly

---

## Quick Start

### 1. Clone the repository

```bash
git clone https://github.com/your-username/notion-as-blog.git
cd notion-as-blog
npm install
```

### 2. Set up environment variables

```bash
cp .env.example .env.local
```

Edit `.env.local` with your values:

```env
NOTION_API_KEY=your_notion_api_key
NOTION_DATA_SOURCE_ID=your_database_id
NOTION_AUTHORS_DATA_SOURCE_ID=your_authors_database_id
TOKEN_FOR_REVALIDATE=your_secret_token
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

### 3. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see your blog.

---

## Notion Database Setup

### Posts Database

Create a Notion database with the following columns:

| Column | Type | Required | Description |
|---|---|---|---|
| **title** | Title | Yes | Post title |
| **slug** | Rich text | Yes | URL slug (lowercase, hyphens). Example: `my-first-post` |
| **status** | Select | Yes | Publishing status (see below) |
| **type** | Select | No | Content type (see below). Defaults to `Post` |
| **date** | Date | Yes | Publish date. Posts are sorted by this field |
| **category** | Select | Yes | Post category. Must match values in `brand.ts` |
| **tags** | Multi-select | No | Freeform tags. Example: `Next.js`, `React` |
| **series** | Rich text | No | Series name. Posts with the same series name are grouped together |
| **author** | People | No | Author (Notion workspace member) |
| **summary** | Rich text | No | Short description shown in post listings |
| **thumbnail** | Files & media | No | Cover image (upload or external URL) |

### Status Values

| Value | Listed | Accessible via URL |
|---|---|---|
| `Public` | Yes | Yes |
| `PublicOnDetail` | No | Yes |
| `Draft` | No | No |
| `Private` | No | No |

### Type Values

| Value | Description |
|---|---|
| `Post` | Standard blog post (default) |
| `Paper` | Long-form document or whitepaper |
| `Page` | Standalone page (not shown in listings) |

### Authors Database (Optional)

Create a separate Notion database to enrich author profiles:

| Column | Type | Description |
|---|---|---|
| **name** | Title | Display name |
| **role** | Rich text | Job title or role |
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
lang: "en",
```

### Colors

Customize the color theme using HSL values in the `colors` object. Both light and dark mode colors are configurable.

### Fonts

```ts
fonts: {
  display: { family: "Inter", weights: [400, 500, 600, 700] },
  mono: { family: "JetBrains Mono", weights: [400, 500] },
},
```

### Categories

Update category names to match your Notion database select values:

```ts
categories: [
  { name: "Development", color: "orange", icon: "dns", description: "..." },
  { name: "Design", color: "teal", icon: "palette", description: "..." },
  { name: "Product", color: "green", icon: "work", description: "..." },
],
```

### Social Links

```ts
social: {
  github: "https://github.com/your-username",
  linkedin: "https://linkedin.com/in/your-profile",
  // twitter: "https://x.com/your-handle",
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
},
```

---

## Deployment

### Vercel (Recommended)

1. Push your repository to GitHub
2. Import the project on [Vercel](https://vercel.com/new)
3. Add environment variables in Project Settings → Environment Variables
4. Deploy

### Docker

```bash
# Build and run
docker compose up -d

# Or build manually
docker build -t notion-as-blog .
docker run -p 3000:3000 \
  -e NOTION_API_KEY=your_key \
  -e NOTION_DATA_SOURCE_ID=your_db_id \
  notion-as-blog
```

---

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `NOTION_API_KEY` | Yes | Notion integration API key |
| `NOTION_DATA_SOURCE_ID` | Yes | Notion posts database ID |
| `NOTION_AUTHORS_DATA_SOURCE_ID` | No | Notion authors database ID |
| `TOKEN_FOR_REVALIDATE` | No | Secret token for on-demand revalidation (`/api/revalidate`) |
| `NEXT_PUBLIC_GA_ID` | No | Google Analytics measurement ID |

---

## License

[MIT](LICENSE)
