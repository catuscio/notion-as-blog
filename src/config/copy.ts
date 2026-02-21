/**
 * All user-facing text in the UI.
 * To localize your blog, translate the strings in this section.
 */
export const copy = {
  copyright: "All rights reserved.",
  /** Default name shown for posts without author info */
  authorFallback: "Author",
  notFound: {
    title: "Page not found",
    description: "The page you are looking for does not exist.",
    heading: "Page not found.",
    cta: "Back to home",
  },
  search: {
    title: "Search",
    titleWithQuery: (q: string) => `"${q}" search results`,
    description: (name: string) => `Search ${name} blog`,
    placeholder: "Search articles...",
    searching: "Searching...",
    noResultsShort: "No results found",
    minLength: "Please enter at least 2 characters.",
    noResults: (q: string) => `No results found for "${q}".`,
    heading: "Search",
    headingWithQuery: (q: string) => `"${q}" search results`,
  },
  tag: {
    badge: "Tag",
    all: "All",
    allPosts: "All Posts",
    tagsHeading: "Tags",
    description: (name: string, tag: string, count: number) =>
      count > 0
        ? `${count} posts tagged #${tag} on ${name}`
        : `Posts tagged #${tag} on ${name}`,
    subtitle: (tag: string) => `Posts tagged with #${tag}.`,
  },
  author: {
    badge: "Author",
    viewAllPosts: "View all posts",
    descriptionFallback: (name: string, author: string) =>
      `Posts by ${author} on ${name}`,
  },
  category: {
    badge: "Category",
  },
  readingTime: "min read",
  readNext: "Read Next",
  readArticle: "Read article",
  readingNow: "Reading now",
  recentPosts: "Recent Posts",
  noPostsFilter: "No posts match this filter.",
  noPosts: "No posts yet. Check back soon!",
  series: {
    label: "Series",
    badge: "Series",
    subtitle: (name: string) => `Articles in the "${name}" series.`,
    description: (name: string, blogName: string, count: number) =>
      `${count} articles in the "${name}" series on ${blogName}`,
  },
  toc: {
    heading: "On this page",
  },
  /** Screen-reader-only text (accessibility) */
  aria: {
    featuredPosts: "Featured posts",
    previousSlide: "Previous slide",
    nextSlide: "Next slide",
    goToSlide: (n: number) => `Go to slide ${n}`,
    youtubeVideo: "YouTube video",
    embeddedContent: "Embedded content",
  },
  footer: {
    home: "Home",
    about: "About",
  },
} as const;
