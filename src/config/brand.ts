// ─── Theme builder ──────────────────────────────────────────────
// Generates 15 shadcn tokens from 5 base values.
// Use overrides to fine-tune individual tokens.
type ThemeBase = {
  brand: string;    // accent color → primary, ring
  bg: string;       // page background → background
  text: string;     // body text → foreground, card-fg, secondary-fg
  surface: string;  // card/muted fill → muted, secondary
  edge: string;     // border/input → border, input
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
  // --- Site Info ---
  name: "Notion-As-Blog",
  title: "A Developer Blog Template",
  highlight: "Blog",
  description:
    "A modern blog template powered by Notion CMS and Next.js.",
  url: "https://your-domain.com",
  since: 2025,
  lang: "en",

  // --- Logo ---
  logo: {
    icon: "code_blocks",
  },

  // --- Colors (HSL) ─────────────────────────────────────────────
  // Customize: change the 5 base values below to update the entire theme.
  colors: {
    light: buildTheme(
      {
        brand:   "354 87% 49%",   // crimson red
        bg:      "30 30% 98%",
        text:    "20 15% 15%",
        surface: "25 15% 94%",
        edge:    "25 12% 90%",
      },
      // fine-tuning (optional)
      {
        card:                "30 25% 99%",
        "muted-foreground":  "20 8% 45%",
        accent:              "22 60% 94%",
        "accent-foreground": "22 60% 35%",
      },
    ),
    dark: buildTheme(
      {
        brand:   "354 85% 55%",
        bg:      "20 15% 10%",
        text:    "30 15% 92%",
        surface: "20 12% 16%",
        edge:    "20 10% 22%",
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

  // --- Fonts ---
  fonts: {
    display: { family: "Inter", weights: [400, 500, 600, 700] },
    mono: { family: "JetBrains Mono", weights: [400, 500] },
  },

  // --- Categories (matches Notion DB category select values) ---
  categories: [
    {
      name: "Development",
      color: "orange",
      icon: "dns",
      description:
        "Server-side architecture, APIs, databases, and scalable system design patterns.",
    },
    {
      name: "Design",
      color: "teal",
      icon: "palette",
      description:
        "UI/UX design principles, design systems, and the art of building beautiful interfaces.",
    },
    {
      name: "Product",
      color: "green",
      icon: "work",
      description:
        "Career growth, team culture, and life as a software engineer.",
    },
  ],

  // --- Social Links ---
  social: {
    // twitter: "https://x.com/your-handle",
    github: "https://github.com/your-username",
    linkedin: "https://linkedin.com/in/your-profile",
  },

  // --- Plugins ---
  notion: {
    dataSourceId: process.env.NOTION_DATA_SOURCE_ID ?? "",
    authorsDataSourceId: process.env.NOTION_AUTHORS_DATA_SOURCE_ID ?? "",
  },
  giscus: {
    repo: "",
    repoId: "",
    category: "",
    categoryId: "",
  },
  newsletter: { enabled: false },
  analytics: { gaId: process.env.NEXT_PUBLIC_GA_ID },
  postsPerPage: 10,
} as const;

export type Category = (typeof brand.categories)[number];
