import type { ContentItem } from "@/types";
import type { ContentCatalog } from "./contentCatalog";
import type { NotionBlockWithChildren } from "./types";

// Local visual QA data. Enable only with BLOG_UI_PREVIEW=1 and NOTION_API_KEY=preview.
const base: ContentItem = {
  id: "preview-1",
  title: "Build a Notion-powered blog with a clear publishing workflow",
  slug: "preview-workflow",
  status: "Public",
  type: "Post",
  date: "2026-09-26",
  lastEditedTime: "2026-09-26",
  tags: ["Getting Started", "Guides", "Design"],
  category: "Product",
  series: "Start Here",
  author: "Notion-As-Blog",
  authorIds: [],
  summary: "Explore the content model, publishing states, and responsive reading layout in one practical walkthrough.",
  thumbnail: "",
  fullWidth: false,
  pinned: true,
};

const posts: ContentItem[] = [
  base,
  { ...base, id: "preview-2", slug: "preview-design", title: "A flexible design system for long-form writing", summary: "From navigation to article typography, keep each component readable at every viewport.", tags: ["Design", "Components"], thumbnail: "", pinned: true, date: "2026-09-25" },
  { ...base, id: "preview-3", slug: "preview-korean", title: "한국어 제목과 긴 본문을 위한 반응형 레이아웃", category: "Development", series: null, summary: "좁은 화면에서도 제목과 본문이 자연스럽게 줄바꿈되는지 확인합니다.", tags: ["Guides", "한국어"], thumbnail: "", pinned: false, date: "2026-09-24" },
];

const aboutPage: ContentItem = {
  ...base,
  id: "preview-about",
  title: "About",
  slug: "about",
  type: "Page",
  category: null,
  series: null,
  tags: [],
  pinned: false,
};

export const uiPreviewCatalog: ContentCatalog = {
  listedPosts: posts,
  detailAccessiblePosts: posts,
  listedPages: [aboutPage],
  detailAccessiblePages: [aboutPage],
};

const previewText = (plain_text: string) => ({ type: "text", plain_text, href: null, annotations: {} });

export const uiPreviewBlocks = [
  { id: "preview-heading", type: "heading_1", heading_1: { rich_text: [previewText("A practical content structure")], is_toggleable: false } },
  { id: "preview-paragraph", type: "paragraph", paragraph: { rich_text: [previewText("The article shell keeps the reading column comfortable while supporting navigation stays close by. The same structure should work on mobile, tablet, and desktop screens.")] } },
  { id: "preview-heading-two", type: "heading_2", heading_2: { rich_text: [previewText("한국어 본문과 자연스러운 줄바꿈")], is_toggleable: false } },
  { id: "preview-paragraph-two", type: "paragraph", paragraph: { rich_text: [previewText("한국어 문장과 English technical terms가 섞여 있어도 화면 밖으로 넘치거나 한 글자만 다음 줄로 떨어지지 않아야 합니다.")] } },
] as unknown as NotionBlockWithChildren[];
