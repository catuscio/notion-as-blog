import fs from "fs/promises";
import path from "path";
import type { NotionBlockWithChildren } from "./types";

const CACHE_DIR = path.join(process.cwd(), ".next/cache/notion-images");
export const NOTION_IMAGE_API_PREFIX = "/api/notion-image";

const IMAGE_FORMATS = [
  ["image/png", ".png"],
  ["image/jpeg", ".jpg"],
  ["image/gif", ".gif"],
  ["image/webp", ".webp"],
  ["image/svg+xml", ".svg"],
  ["image/avif", ".avif"],
] as const;

const MIME_TO_EXT: Record<string, string> = Object.fromEntries(IMAGE_FORMATS);
const EXT_TO_MIME: Record<string, string> = Object.fromEntries(
  IMAGE_FORMATS.map(([mime, ext]) => [ext, mime])
);
// .jpeg is an alternate extension for image/jpeg
EXT_TO_MIME[".jpeg"] = "image/jpeg";

const VALID_EXTS = new Set(Object.keys(EXT_TO_MIME));

function extractExtFromUrl(url: string): string {
  try {
    const pathname = new URL(url).pathname;
    const ext = path.extname(pathname).toLowerCase();
    if (VALID_EXTS.has(ext)) return ext;
  } catch {
    // invalid URL
  }
  return ".png";
}

async function downloadImage(
  blockId: string,
  url: string
): Promise<string | null> {
  try {
    await fs.mkdir(CACHE_DIR, { recursive: true });

    const response = await fetch(url);
    if (!response.ok) return null;

    const contentType = response.headers.get("content-type") ?? "";
    const ext = MIME_TO_EXT[contentType] ?? extractExtFromUrl(url);
    const filename = `${blockId}${ext}`;
    const filepath = path.join(CACHE_DIR, filename);

    const buffer = Buffer.from(await response.arrayBuffer());
    await fs.writeFile(filepath, buffer);

    return `${NOTION_IMAGE_API_PREFIX}/${blockId}`;
  } catch {
    return null;
  }
}

function getImageUrl(block: NotionBlockWithChildren): string | null {
  if (block.type !== "image") return null;
  return block.image.type === "file"
    ? block.image.file.url
    : block.image.external.url;
}

function setImageUrl(block: NotionBlockWithChildren, url: string): void {
  if (block.type !== "image") return;
  if (block.image.type === "file") {
    block.image.file.url = url;
  } else {
    block.image.external.url = url;
  }
}

/**
 * Walk blocks recursively, download Notion images to local cache,
 * and replace URLs with stable local paths.
 * Falls back to original URL if download fails.
 */
export async function cacheBlockImagesInPlace(
  blocks: NotionBlockWithChildren[]
): Promise<void> {
  const tasks: Promise<void>[] = [];

  for (const block of blocks) {
    const originalUrl = getImageUrl(block);
    if (originalUrl) {
      tasks.push(
        downloadImage(block.id, originalUrl).then((cachedUrl) => {
          if (cachedUrl) setImageUrl(block, cachedUrl);
        })
      );
    }

    if (block.children) {
      tasks.push(cacheBlockImagesInPlace(block.children));
    }
  }

  await Promise.all(tasks);
}

/**
 * Find a cached image file by block ID.
 * Returns { filepath, contentType } or null if not found.
 */
export async function getCachedImage(
  blockId: string
): Promise<{ filepath: string; contentType: string } | null> {
  try {
    const files = await fs.readdir(CACHE_DIR);
    const match = files.find((f) => f.startsWith(blockId));
    if (!match) return null;

    const filepath = path.join(CACHE_DIR, match);
    const ext = path.extname(match).toLowerCase();

    return {
      filepath,
      contentType: EXT_TO_MIME[ext] ?? "image/png",
    };
  } catch {
    return null;
  }
}
