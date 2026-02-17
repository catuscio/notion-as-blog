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

  // --- Colors (HSL for CSS variables) — Custom theme ---
  colors: {
    light: {
      primary: "354 87% 49%",
      "primary-foreground": "0 0% 100%",
      background: "30 30% 98%",
      foreground: "20 15% 15%",
      muted: "25 15% 94%",
      "muted-foreground": "20 8% 45%",
      card: "30 25% 99%",
      "card-foreground": "20 15% 15%",
      border: "25 12% 90%",
      input: "25 12% 90%",
      ring: "354 87% 49%",
      secondary: "25 15% 94%",
      "secondary-foreground": "20 15% 15%",
      accent: "22 60% 94%",
      "accent-foreground": "22 60% 35%",
      destructive: "0 84% 60%",
      popover: "30 25% 99%",
      "popover-foreground": "20 15% 15%",
    },
    dark: {
      primary: "354 85% 55%",
      "primary-foreground": "0 0% 100%",
      background: "20 15% 10%",
      foreground: "30 15% 92%",
      muted: "20 12% 16%",
      "muted-foreground": "25 8% 60%",
      card: "20 12% 15%",
      "card-foreground": "30 15% 92%",
      border: "20 10% 22%",
      input: "20 10% 22%",
      ring: "354 85% 55%",
      secondary: "20 12% 16%",
      "secondary-foreground": "30 15% 92%",
      accent: "22 50% 18%",
      "accent-foreground": "25 30% 90%",
      destructive: "0 62% 50%",
      popover: "20 12% 15%",
      "popover-foreground": "30 15% 92%",
    },
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
