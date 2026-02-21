import { getPublishedPosts, getPublishedPages } from "./getPosts";
import { getPageBlocks } from "./getBlocks";
import { cacheBlockImagesInPlace } from "./imageCache";
import { getRelatedPosts, getSeriesPosts } from "./filterPosts";
import { brand } from "@/config/brand";
import type { Post } from "@/types";
import type { NotionBlockWithChildren } from "./types";

function extractTextFromBlocks(blocks: NotionBlockWithChildren[]): string {
  const parts: string[] = [];
  for (const block of blocks) {
    const blockData = block as Record<string, unknown>;
    const typeContent = blockData[block.type] as { rich_text?: { plain_text: string }[] } | undefined;
    if (typeContent?.rich_text) {
      parts.push(typeContent.rich_text.map((t) => t.plain_text).join(""));
    }
    if (block.children) {
      parts.push(extractTextFromBlocks(block.children));
    }
  }
  return parts.join(" ");
}

export function estimateReadingTime(text: string): number {
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / brand.reading.wordsPerMinute));
}

export interface PostDetailData {
  post: Post;
  blocks: NotionBlockWithChildren[];
  relatedPosts: Post[];
  seriesPosts: Post[];
  readingTime: number;
  wordCount: number;
}

export async function getPostDetailData(
  slug: string
): Promise<PostDetailData | null> {
  const allPosts = await getPublishedPosts();
  const post = allPosts.find((p) => p.slug === slug);

  if (!post) return null;

  const blocks = await getPageBlocks(post.id);
  await cacheBlockImagesInPlace(blocks);
  const text = extractTextFromBlocks(blocks);
  const wordCount = text.split(/\s+/).filter(Boolean).length;
  const readingTime = estimateReadingTime(text);

  const relatedPosts = getRelatedPosts(post, allPosts);
  const seriesPosts = getSeriesPosts(post, allPosts);

  return { post, blocks, relatedPosts, seriesPosts, readingTime, wordCount };
}

export async function getPageBySlug(
  slug: string
): Promise<{ page: Post; blocks: NotionBlockWithChildren[] } | null> {
  const pages = await getPublishedPages();
  const page = pages.find((p) => p.slug === slug);

  if (!page) return null;

  const blocks = await getPageBlocks(page.id);
  await cacheBlockImagesInPlace(blocks);
  return { page, blocks };
}
