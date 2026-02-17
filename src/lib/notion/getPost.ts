import { getAllPosts, getAllPages } from "./getPosts";
import { getPageBlocks } from "./getBlocks";
import type { TPost } from "@/types";
import type { NotionBlockWithChildren } from "./types";

function extractTextFromBlocks(blocks: NotionBlockWithChildren[]): string {
  const parts: string[] = [];
  for (const block of blocks) {
    const b = block as Record<string, unknown>;
    const typed = b[block.type] as Record<string, unknown> | undefined;
    if (typed && Array.isArray(typed.rich_text)) {
      parts.push(
        (typed.rich_text as { plain_text: string }[])
          .map((t) => t.plain_text)
          .join("")
      );
    }
    if (block.children) {
      parts.push(extractTextFromBlocks(block.children));
    }
  }
  return parts.join(" ");
}

export function estimateReadingTime(text: string): number {
  const wordsPerMinute = 200;
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / wordsPerMinute));
}

export interface PostDetailData {
  post: TPost;
  blocks: NotionBlockWithChildren[];
  allPosts: TPost[];
  readingTime: number;
}

export async function getPostDetailData(
  slug: string
): Promise<PostDetailData | null> {
  const allPosts = await getAllPosts();
  const post = allPosts.find((p) => p.slug === slug);

  if (!post) return null;

  const blocks = await getPageBlocks(post.id);
  const text = extractTextFromBlocks(blocks);
  const readingTime = estimateReadingTime(text);

  return { post, blocks, allPosts, readingTime };
}

export async function getPostsByCategory(category: string): Promise<TPost[]> {
  const posts = await getAllPosts();
  return posts.filter(
    (p) => p.category.toLowerCase() === category.toLowerCase()
  );
}

export async function getPageBySlug(
  slug: string
): Promise<{ page: TPost; blocks: NotionBlockWithChildren[] } | null> {
  const pages = await getAllPages();
  const page = pages.find((p) => p.slug === slug);

  if (!page) return null;

  const blocks = await getPageBlocks(page.id);
  return { page, blocks };
}
