# Notion-As-Blog

A modern, open-source blog template powered by **Notion** as a CMS and **Next.js 16**.
Write posts in Notion, and they appear on your blog automatically.

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38bdf8?logo=tailwindcss)
![License](https://img.shields.io/badge/License-MIT-green)

**English** | **[한국어](README.ko.md)**

---

## Screenshots

### Home (Light / Dark)

| Light | Dark |
|:---:|:---:|
| ![Home Light](docs/screenshots/home-desktop.png) | ![Home Dark](docs/screenshots/home-dark.png) |

### Post Detail

![Post Detail](docs/screenshots/post-desktop.png)

### Mobile

<p align="center">
  <img src="docs/screenshots/home-mobile.png" alt="Mobile" width="300" />
</p>

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

### 1. Copy the Notion template

Open the link below and duplicate the template to your Notion workspace.

> **[Notion-As-Blog Template](https://www.notion.so/welcometogyuminworld/Notion-As-Blog-30ab152141a480309a9ede1f8cac4cc7?source=copy_link)**

The template includes a **Posts** database and an **Authors** database with sample data, so you can start writing immediately.

### 2. Create a Notion integration

1. Go to [My Integrations](https://www.notion.so/profile/integrations) and click **New integration**
2. Give it a name (e.g. `notion-as-blog`) and select the workspace where you duplicated the template
3. Copy the **Internal Integration Secret** — this is your `NOTION_API_KEY`

### 3. Connect the integration to your databases

1. Open the **Posts** database page in Notion
2. Click **···** (top-right) → **Connections** → find your integration and **Connect**
3. Repeat for the **Authors** database

### 4. Get your database IDs

Each Notion database has a unique ID in its URL:

```
https://www.notion.so/{workspace}/{database_id}?v=...
                                   ^^^^^^^^^^^
```

Copy the ID for both the Posts database (`NOTION_DATA_SOURCE_ID`) and the Authors database (`NOTION_AUTHORS_DATA_SOURCE_ID`).

### 5. Clone and configure

```bash
git clone https://github.com/your-username/notion-as-blog.git
cd notion-as-blog
npm install
cp .env.example .env.local
```

Edit `.env.local`:

```env
NOTION_API_KEY=secret_xxxxxxxxxxxxxxxxxxxxx
NOTION_DATA_SOURCE_ID=your_posts_database_id
NOTION_AUTHORS_DATA_SOURCE_ID=your_authors_database_id
TOKEN_FOR_REVALIDATE=any_random_secret_string
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

### 6. Run the development server

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
| **series** | Rich text | No | Series name. Posts sharing the same series name are grouped with navigation |
| **author** | People | No | Notion workspace member. Matched against the Authors database by name |
| **summary** | Rich text | No | Short description shown in post cards and SEO meta |
| **thumbnail** | Files & media | No | Cover image (upload or paste an external URL) |

### Status values

| Value | Shown in listings | Accessible via direct URL |
|---|---|---|
| `Public` | Yes | Yes |
| `PublicOnDetail` | No | Yes — useful for unlisted posts shared via link |
| `Draft` | No | No |
| `Private` | No | No |

### Type values

| Value | Description |
|---|---|
| `Post` | Standard blog post. Shown in home feed, category pages, and search |
| `Page` | Standalone page (e.g. a landing page). Not shown in post listings |

### Using series

To group posts into a series, set the same `series` value (e.g. `Next.js Blog Tutorial`) on multiple posts. The blog will automatically render series navigation with previous/next links on each post detail page.

### Authors database (optional)

If you want richer author profiles beyond the Notion workspace member name, create (or use the template's) Authors database:

| Column | Type | Description |
|---|---|---|
| **name** | Title | Must match the Notion People name exactly |
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

Any [Google Fonts](https://fonts.google.com/) family is supported.

### Categories

Category names **must match** the Select values in your Notion Posts database:

```ts
categories: [
  { name: "Development", color: "orange", icon: "dns", description: "..." },
  { name: "Design", color: "teal", icon: "palette", description: "..." },
  { name: "Product", color: "green", icon: "work", description: "..." },
],
```

Icons use [Material Symbols](https://fonts.google.com/icons) names.

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

## On-Demand Revalidation

The blog caches Notion data for performance. When you update a post in Notion, you can trigger an instant refresh:

```bash
curl -X POST https://your-domain.com/api/revalidate \
  -H "Authorization: Bearer YOUR_TOKEN_FOR_REVALIDATE"
```

You can also set this up as a Notion automation or a webhook from an external service. Without triggering revalidation, content refreshes automatically every hour.

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
