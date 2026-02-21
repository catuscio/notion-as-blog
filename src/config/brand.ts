/**
 * ╔══════════════════════════════════════════════════════════════════╗
 * ║                    Brand Configuration                           ║
 * ║                                                                  ║
 * ║  This is the single configuration file for your entire blog.     ║
 * ║  Modify only the values you need — helpful comments are          ║
 * ║  provided for each section.                                      ║
 * ╚══════════════════════════════════════════════════════════════════╝
 */

import { copy } from "./copy";
import { env } from "./env";

// ─── Theme Builder (internal utility) ───────────────────────────
// Generates 15 shadcn UI tokens from 5 base colors automatically.
// You don't need to modify this function — just edit the colors section below.
type ThemeBase = {
  brand: string;    // Accent color (primary buttons, links, focus rings)
  bg: string;       // Page background
  text: string;     // Body text color
  surface: string;  // Card and muted area backgrounds
  edge: string;     // Borders and input outlines
};

function buildTheme(base: ThemeBase, overrides: Record<string, string> = {}) {
  return {
    primary:                base.brand,
    "primary-foreground":   "0 0% 100%",
    background:             base.bg,
    foreground:             base.text,
    card:                   base.bg,
    "card-foreground":      base.text,
    muted:                  base.surface,
    "muted-foreground":     base.text,
    secondary:              base.surface,
    "secondary-foreground": base.text,
    accent:                 base.surface,
    "accent-foreground":    base.text,
    destructive:            "0 84% 60%",
    border:                 base.edge,
    input:                  base.edge,
    ring:                   base.brand,
    ...overrides,
  };
}

export const brand = {
  // ═══════════════════════════════════════════════════════════════
  // Site Info
  // ───────────────────────────────────────────────────────────────
  // Core identity of your blog.
  // name, title, and description are used across meta tags, RSS,
  // JSON-LD, and other SEO-related outputs.
  // ═══════════════════════════════════════════════════════════════

  /** Blog name — used in the header logo text and as the <title> suffix */
  name: "Notion-As-Blog",

  /** Hero section heading on the home page */
  title: "A Developer Blog Template",

  /** The word in the hero title to visually highlight */
  highlight: "Blog",

  /** One-line intro used in <meta name="description"> and JSON-LD */
  description:
    "A modern blog template powered by Notion CMS and Next.js.",

  /** Full URL of the deployed site (no trailing slash) — used in sitemap, OG tags, etc. */
  url: "https://your-domain.com",

  /** Year shown in the footer copyright. e.g. "© 2025 – 2026" */
  since: 2025,

  /**
   * HTML lang attribute — tells search engines and screen readers the site language.
   * Examples: "en" (English), "ko" (Korean), "ja" (Japanese)
   */
  lang: "en",

  // ═══════════════════════════════════════════════════════════════
  // SEO Keywords
  // ───────────────────────────────────────────────────────────────
  // Populates <meta name="keywords">.
  // Leave empty to omit the tag entirely.
  // Example: ["Next.js", "blog", "frontend", "development"]
  // ═══════════════════════════════════════════════════════════════
  keywords: [] satisfies string[],

  // ═══════════════════════════════════════════════════════════════
  // Organization (JSON-LD)
  // ───────────────────────────────────────────────────────────────
  // Organization info that may appear in Google's Knowledge Panel.
  // Safe to leave empty for personal blogs.
  // Fill in for company/team blogs to improve SEO.
  // ═══════════════════════════════════════════════════════════════
  organization: {
    name: "",
    alternateName: "",
    url: "",
    description: "",
    /** Organization logo URL (absolute path or full https:// URL) */
    logo: "",
    /** Founding date in ISO format. e.g. "2020-01-01" */
    foundingDate: "",
    address: {
      streetAddress: "",
      addressLocality: "",    // e.g. "San Francisco"
      addressRegion: "",      // e.g. "CA"
      addressCountry: "",     // e.g. "US", "KR"
    },
    contactPoint: {
      telephone: "",
      contactType: "",                    // e.g. "customer support"
      availableLanguage: [] satisfies string[],  // e.g. ["English", "Korean"]
    },
    /** List of official social media profile URLs for the organization */
    sameAs: [] satisfies string[],
  },

  // ═══════════════════════════════════════════════════════════════
  // Logo & Assets
  // ───────────────────────────────────────────────────────────────
  // Place all image files in the /public folder.
  // Use paths relative to /public.
  //   e.g. /public/logo.svg → "/logo.svg"
  // ═══════════════════════════════════════════════════════════════
  logo: {
    /** Logo displayed in the header and footer. Set to "" to hide. */
    image: "",
    /** When true, only the logo is shown (blog name is hidden). Ignored if image is empty. */
    showNameWithLogo: true,
    /** PNG logo used in JSON-LD, RSS feed, etc. */
    png: "/logo.png",
    /** White/inverted logo used as an overlay in OG image generation */
    ogWhite: "/logo-white.png",
  },

  assets: {
    /** Default OG image used when a post has no thumbnail */
    ogImage: "/opengraph_main.png",
    /** OG image dimensions (px) — 1200x630 is recommended in most cases */
    ogWidth: 1200,
    ogHeight: 630,
    /** Timeout (ms) for fetching post thumbnails during OG image generation */
    ogFetchTimeoutMs: 3000,
  },

  // ═══════════════════════════════════════════════════════════════
  // Colors
  // ───────────────────────────────────────────────────────────────
  // Values use HSL format: "Hue Saturation% Lightness%"
  //
  //   H (Hue):        0–360  (0=red, 120=green, 240=blue)
  //   S (Saturation):  0–100% (0%=gray, 100%=vivid)
  //   L (Lightness):   0–100% (0%=black, 50%=pure color, 100%=white)
  //
  // Quick customization:
  //   1. Change only "brand" to update all accent colors (buttons, links) at once.
  //   2. Adjust bg / text / surface / edge to change the overall tone.
  //   3. Use the second argument (overrides) for fine-grained control.
  //
  // HSL color picker: https://hslpicker.com
  // ═══════════════════════════════════════════════════════════════
  colors: {
    light: buildTheme(
      {
        brand:   "354 87% 49%",   // Accent color (crimson red)
        bg:      "30 30% 98%",    // Page background (warm white)
        text:    "20 15% 15%",    // Body text (dark brown)
        surface: "25 15% 94%",    // Card/muted background (light beige)
        edge:    "25 12% 90%",    // Borders (soft beige)
      },
      // Fine-tuning (optional) — set to {} if not needed
      {
        card:                "30 25% 99%",
        "muted-foreground":  "20 8% 45%",
        accent:              "22 60% 94%",
        "accent-foreground": "22 60% 35%",
      },
    ),
    dark: buildTheme(
      {
        brand:   "354 85% 55%",   // Slightly higher lightness for better visibility in dark mode
        bg:      "20 15% 10%",    // Dark background
        text:    "30 15% 92%",    // Light text
        surface: "20 12% 16%",    // Card/muted background
        edge:    "20 10% 22%",    // Borders
      },
      {
        card:                "20 12% 15%",
        "muted-foreground":  "25 8% 60%",
        accent:              "22 50% 18%",
        "accent-foreground": "25 30% 90%",
        destructive:         "0 62% 50%",
      },
    ),
  },

  // ═══════════════════════════════════════════════════════════════
  // Fonts
  // ───────────────────────────────────────────────────────────────
  // sans  : Sans-serif font stack for body text
  // mono  : Monospace font for code blocks (loaded via Google Fonts CDN)
  // og    : Font used for OG image generation (.otf or .ttf URL)
  //
  // For non-Latin blogs, prepend a web font to sans.stack:
  //   e.g. 'Pretendard, -apple-system, ..., sans-serif'
  // ═══════════════════════════════════════════════════════════════
  fonts: {
    sans: {
      stack: 'Inter, -apple-system, BlinkMacSystemFont, system-ui, Roboto, "Helvetica Neue", "Segoe UI", sans-serif',
    },
    mono: {
      family: "JetBrains Mono",
      cdn: "https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&display=swap",
      preconnect: ["https://fonts.googleapis.com", "https://fonts.gstatic.com"],
    },
    og: {
      family: "Pretendard",
      url: "https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/packages/pretendard/dist/public/static/Pretendard-Bold.otf",
    },
  },

  // ═══════════════════════════════════════════════════════════════
  // Categories
  // ───────────────────────────────────────────────────────────────
  // IMPORTANT: The "name" value must exactly match the "Category"
  //   select field in your Notion database (case-sensitive!).
  //
  // slug  : Used in the URL → /category/development
  // color : Tailwind color name (used for the header nav underline)
  // icon  : Material Symbols icon name
  //         Browse icons: https://fonts.google.com/icons
  //
  // When adding or removing categories, update the Notion DB
  // select field as well.
  // ═══════════════════════════════════════════════════════════════
  categories: [
    {
      name: "Development",
      slug: "development",
      color: "orange",
      icon: "dns",
      description:
        "Server-side architecture, APIs, databases, and scalable system design patterns.",
    },
    {
      name: "Design",
      slug: "design",
      color: "teal",
      icon: "palette",
      description:
        "UI/UX design principles, design systems, and the art of building beautiful interfaces.",
    },
    {
      name: "Product",
      slug: "product",
      color: "green",
      icon: "work",
      description:
        "Career growth, team culture, and life as a software engineer.",
    },
  ],

  // ═══════════════════════════════════════════════════════════════
  // Social Links
  // ───────────────────────────────────────────────────────────────
  // Social media icon links displayed in the footer.
  // Leave a value as an empty string ("") to hide that icon.
  // ═══════════════════════════════════════════════════════════════
  social: {
    github: "https://github.com/your-username",
    twitter: "",
    instagram: "",
    facebook: "",
    youtube: "",
    linkedin: "https://linkedin.com/in/your-profile",
    threads: "",
    tiktok: "",
    naverBlog: "",
  },

  // ═══════════════════════════════════════════════════════════════
  // Search
  // ───────────────────────────────────────────────────────────────
  // Settings for the built-in blog search feature.
  // ═══════════════════════════════════════════════════════════════
  search: {
    /** Max results shown in the search dropdown (autocomplete) */
    dropdownLimit: 10,
    /** Max results shown on the /search page */
    pageLimit: 30,
  },

  // ═══════════════════════════════════════════════════════════════
  // Footer Links
  // ───────────────────────────────────────────────────────────────
  // Grouped links displayed in the footer.
  //
  // Example:
  //   footerLinks: {
  //     "Resources": [
  //       { label: "Documentation", href: "/docs" },
  //       { label: "GitHub", href: "https://github.com/..." },
  //     ],
  //     "Legal": [
  //       { label: "Privacy", href: "/privacy" },
  //       { label: "Terms", href: "/terms" },
  //     ],
  //   },
  // ═══════════════════════════════════════════════════════════════
  footerLinks: {} satisfies Record<string, { label: string; href: string }[]>,

  // ═══════════════════════════════════════════════════════════════
  // Plugins & External Services
  // ═══════════════════════════════════════════════════════════════

  // --- Notion (reads from environment variables automatically) ---
  notion: {
    dataSourceId: env.notionDataSourceId,
    authorsDataSourceId: env.notionAuthorsDataSourceId,
    /** Max concurrent Notion API requests — setting this too high may cause 429 errors */
    apiConcurrency: 3,
    /** Number of pages fetched per request (max 100) */
    pageSize: 100,
  },

  /**
   * Giscus Comments
   *
   * A comment system powered by GitHub Discussions. Setup:
   *   1. Go to https://giscus.app and generate your config values
   *   2. Paste the generated values into the fields below
   *
   * Leave "repo" empty to disable comments entirely.
   */
  giscus: {
    repo: "",
    repoId: "",
    category: "",
    categoryId: "",
    mapping: "pathname",
    strict: "0",
    reactionsEnabled: "1",
    emitMetadata: "0",
    inputPosition: "bottom",
  },

  /**
   * Newsletter CTA
   *
   * Set "enabled" to true to show a subscription section at the bottom of the home feed.
   * You'll need to implement the actual subscription logic separately.
   */
  newsletter: {
    enabled: false,
    headline: "Stay ahead of the curve",
    description:
      "Join developers receiving the best content on tech, design, and AI directly in their inbox every week.",
    placeholder: "Enter your email address",
    cta: "Subscribe",
    disclaimer: "No spam, unsubscribe anytime.",
  },

  /**
   * Google Analytics
   * Reads from the NEXT_PUBLIC_GA_ID environment variable automatically.
   * e.g. G-XXXXXXXXXX
   */
  analytics: { gaId: env.gaId },

  // ═══════════════════════════════════════════════════════════════
  // Behavior
  // ═══════════════════════════════════════════════════════════════

  slideshow: {
    /** Auto-advance interval (ms) for the pinned posts slideshow */
    intervalMs: 5000,
  },

  reading: {
    /**
     * Words per minute used for reading time calculation.
     * Typical values: 200–250 for English, 500–600 for CJK languages.
     */
    wordsPerMinute: 200,
  },

  /**
   * Post Detail Animation
   *
   * When enabled, post pages play a two-phase entry animation:
   *   1. Title typewriter effect
   *   2. Body & sidebar slide-up reveal after typing completes
   *
   * SSR content is always fully rendered — animation is client-side only.
   */
  postAnimation: {
    enabled: true,
  },

  // ═══════════════════════════════════════════════════════════════
  // Cache / Performance
  // ───────────────────────────────────────────────────────────────
  // Lower values = Notion changes appear faster, but increases
  // API calls and may slow down builds/responses.
  // ═══════════════════════════════════════════════════════════════
  cache: {
    /** ISR revalidation interval (seconds). Default: 1800s = 30 min */
    revalidate: 1800,
    /** RSS feed Cache-Control max-age (seconds). Default: 3600s = 1 hour */
    feedTtl: 3600,
    /** Proxied Notion image Cache-Control max-age (seconds). Default: 1 year */
    imageTtl: 31536000,
    /** In-memory authors cache TTL (milliseconds). Default: 5 min */
    authorsTtlMs: 5 * 60 * 1000,
  },

  // ═══════════════════════════════════════════════════════════════
  // Copy / i18n — see src/config/copy.ts
  // ═══════════════════════════════════════════════════════════════
  copy,

  /** Number of posts per feed page */
  postsPerPage: 10,
} as const;

// ─── Utility functions (internal use) ─────────────────────────────

export type Category = (typeof brand.categories)[number];

export function getCategoryBySlug(slug: string): Category | undefined {
  return brand.categories.find((c) => c.slug === slug);
}

export function getCategorySlug(name: string): string | undefined {
  return brand.categories.find((c) => c.name === name)?.slug;
}
