import { getContentCatalog } from "./contentCatalog";
import { getPageBlocks } from "./getBlocks";
import { enrichBookmarkOgInPlace } from "./ogMetadata";
import { getRelatedPosts, getSeriesPosts } from "./contentQueries";
import { brand } from "@/config/brand";
import type { ContentItem } from "@/types";
import type { NotionBlockWithChildren } from "./types";

function extractTextFromBlocks(blocks: NotionBlockWithChildren[]): string {
  const parts: string[] = [];
  for (const block of blocks) {
    const blockData = block as Record<string, unknown>;
    const typeContent = blockData[block.type] as { rich_text?: { plain_text: string }[] } | undefined;
    if (typeContent?.rich_text) {
      parts.push(typeContent.rich_text.map((text) => text.plain_text).join(""));
    }
    if (block.children) parts.push(extractTextFromBlocks(block.children));
  }
  return parts.join(" ");
}

function estimateReadingTime(text: string): number {
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / brand.reading.wordsPerMinute));
}

export interface ContentDetailData {
  content: ContentItem;
  blocks: NotionBlockWithChildren[];
  relatedPosts: ContentItem[];
  seriesPosts: ContentItem[];
  readingTime: number;
  wordCount: number;
}

export async function getContentDetail(slug: string): Promise<ContentDetailData | null> {
  const catalog = await getContentCatalog();
  const content = catalog.detailAccessiblePosts.find((item) => item.slug === slug)
    ?? catalog.detailAccessiblePages.find((item) => item.slug === slug);

  if (!content) return null;

  if (process.env.BLOG_UI_PREVIEW === "1" && process.env.NOTION_API_KEY === "preview") {
    const { uiPreviewBlocks } = await import("./uiPreviewFixture");
    return {
      content,
      blocks: uiPreviewBlocks,
      relatedPosts: getRelatedPosts(content, catalog.listedPosts),
      seriesPosts: [],
      readingTime: 2,
      wordCount: 80,
    };
  }

  const blocks = await getPageBlocks(content.id);
  await enrichBookmarkOgInPlace(blocks);
  const text = extractTextFromBlocks(blocks);
  const wordCount = text.split(/\s+/).filter(Boolean).length;
  const isPost = content.type === "Post";

  return {
    content,
    blocks,
    relatedPosts: isPost ? getRelatedPosts(content, catalog.listedPosts) : [],
    seriesPosts: isPost && content.status === "Public"
      ? getSeriesPosts(content, catalog.listedPosts)
      : [],
    readingTime: estimateReadingTime(text),
    wordCount,
  };
}
