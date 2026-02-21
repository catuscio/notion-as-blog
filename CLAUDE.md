# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Notion-As-Blog: a Next.js 16 (App Router) blog that uses Notion as a CMS. Posts are written in Notion and rendered as a full-featured blog with categories, tags, series, multi-author support, and search.

## Commands

```bash
npm run dev          # Start dev server
npm run build        # Production build
npm run start        # Start production server
npm run lint         # Run ESLint
npm run cleancache   # Delete .next/ cache
```

No test runner is configured. Playwright is installed as a devDependency but has no scripts.

## Architecture

**Stack:** Next.js 16, React 19, TypeScript 5 (strict), Tailwind CSS 4, shadcn/ui

**Rendering:** ISR with 30-minute revalidation. Pages use `generateStaticParams` for static pre-rendering. All page components are React Server Components; `"use client"` is only used for interactive leaf components (ThemeToggle, SearchInput, FeaturedSlideshow, etc.).

**Path alias:** `@/*` maps to `src/*`.

### Configuration: `src/config/`

- **`brand.ts`** — Single source of truth for site configuration: name, colors, categories, fonts, Notion settings, cache TTLs, plugin toggles (Giscus, newsletter, GA). Category names must exactly match the Notion DB `category` select field values.
- **`copy.ts`** — All user-facing UI text. Import `copy` directly (not via `brand.copy`). To localize, translate strings here.
- **`env.ts`** — Centralized `process.env` access. Never read `process.env` directly elsewhere; use `env.*` instead.

### Theme System

`buildTheme()` in `brand.ts` generates shadcn CSS tokens from 5 base HSL values. The CSS is injected as an inline `<style>` tag in `layout.tsx`, not via a static CSS file. Tailwind 4 uses CSS-first configuration in `globals.css` with `@custom-variant dark (.dark)` for next-themes class strategy.

### Data Layer: `src/lib/notion/`

- **Client:** `client.ts` — singleton using `@notionhq/client`. Uses `dataSources.query()` (not `databases.query()`).
- **Posts:** `getPosts.ts` — paginated fetch wrapped in `unstable_cache` (30min TTL, key `["all-posts"]`)
- **Authors:** `getAuthors.ts` — manual in-memory TTL cache (5min) to avoid serialization overhead
- **Blocks:** `getBlocks.ts` — recursive block fetching with semaphore (3 concurrent requests)
- **Image proxy:** `imageCache.ts` downloads Notion images to `.next/cache/notion-images/` and rewrites URLs to `/api/notion-image/[id]` (1-year cache header) since Notion S3 URLs expire
- **Error handling:** `safeQuery.ts` wraps all data fetches — returns fallback value on error instead of crashing

**Post status semantics:**
- `Public` — visible in feeds and by direct URL
- `PublicOnDetail` — hidden from feeds, accessible by direct URL (unlisted)
- `Draft`/`Private` — not accessible

**`type: Post` vs `type: Page`:** Pages (about, landing) share the `[slug]` route but are excluded from feeds and search. Resolved as fallback after posts.

### Routing (`src/app/`)

| Route | Purpose |
|---|---|
| `/` | Home feed with pinned posts slideshow, recent posts, tag filter |
| `/[slug]` | Post or Page detail with sidebar (TOC, series nav, read next) |
| `/category/[category]` | Posts filtered by category |
| `/tag/[tag]` | Posts filtered by tag |
| `/author/[name]` | Posts by author |
| `/series/[name]` | Series collection (only for series with 2+ posts) |
| `/search` | Search results |
| `/api/search` | GET search endpoint — in-memory string matching on all posts |
| `/api/notion-image/[id]` | Cached Notion image proxy |
| `/api/revalidate` | POST with Bearer token for on-demand ISR |
| `/feed.xml`, `/sitemap.xml`, `/robots.txt` | SEO routes |

### Component Organization

- `components/layout/` — Header, Footer, CategoryNav, SocialIcons (app shell)
- `components/feed/` — PostCard, PostList, FeaturedSlideshow, TagFilter, TagSidebar, FeedPageHeader, EmptyState, section headers
- `components/detail/` — NotionRenderer, NotionBlockRenderer, RichText, PostHeader, AuthorCard, TableOfContents, SeriesNav, ReadNext, CommentBox
- `components/common/` — Pagination, PostThumbnail, SearchInput, ThemeToggle, EmptyState
- `components/seo/` — JsonLd schema components

## Environment Variables

```bash
NOTION_API_KEY=                    # Required — Notion integration secret
NOTION_DATA_SOURCE_ID=             # Required — Posts database ID
NOTION_AUTHORS_DATA_SOURCE_ID=     # Optional — Authors database ID
TOKEN_FOR_REVALIDATE=              # Optional — Secret for /api/revalidate
NEXT_PUBLIC_GA_ID=                 # Optional — Google Analytics ID
```

Copy `.env.example` to `.env.local` for local development.

## Conventions

### Error Handling

All data fetches use `safeQuery(fn, fallback)` from `src/lib/notion/safeQuery.ts`. It wraps async calls and returns the fallback value on error instead of crashing. Use this consistently — avoid raw `try/catch` or `.catch()` for Notion data fetching.

### Shared Utilities (`src/lib/`)

- **`format.ts`** — `formatDate(dateString, variant, locale)`, `slugify(text)`, `slugifyHeading(text, fallbackId)`
- **`safeDecode.ts`** — Safe `decodeURIComponent` wrapper (returns original on error)
- **`postDate.ts`** — `getPostDate(post)` returns the display date (published or created)
- **`getCategoryFromPath.ts`** — Extracts category from URL pathname
- **`brandIcon.tsx`** — Shared branded icon element for `icon.tsx` and `apple-icon.tsx`
- **`resolveAuthor.ts`** — Resolves author info from Notion authors DB with fallback

### Hooks (`src/hooks/`)

- **`useMounted.ts`** — Hydration-safe mounted state check (replaces manual `useSyncExternalStore` patterns)
- **`useFeedPagination.ts`** — Pagination logic using `usePathname()` (not `window.location`)

### Type Naming

Types use plain PascalCase without prefix — `Post`, `Author`, `FeedPageData` (not `TPost`, `IAuthor`). Enum-like unions use descriptive names: `PostStatus`, `ContentType`.

### Imports

- Import `copy` from `@/config/copy` for UI text (not `brand.copy`)
- Import `env` from `@/config/env` for environment variables (not `process.env`)
- Import `brand` from `@/config/brand` for site configuration only
