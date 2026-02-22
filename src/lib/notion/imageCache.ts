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

const ALL_EXTS = Object.keys(EXT_TO_MIME);
const VALID_EXTS = new Set(ALL_EXTS);

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

    // Cache hit guard: skip download if file already exists
    for (const ext of ALL_EXTS) {
      try {
        await fs.access(path.join(CACHE_DIR, `${blockId}${ext}`));
        return `${NOTION_IMAGE_API_PREFIX}/${blockId}`;
      } catch { /* not found */ }
    }

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
  for (const ext of ALL_EXTS) {
    const filepath = path.join(CACHE_DIR, `${blockId}${ext}`);
    try {
      await fs.access(filepath);
      return { filepath, contentType: EXT_TO_MIME[ext] ?? "image/png" };
    } catch { /* next */ }
  }
  return null;
}

/** Cache an image and generate a blur placeholder. Falls back to original URL on failure. */
export async function cacheCoverImage(
  id: string,
  url: string
): Promise<{ url: string; blurDataURL: string }> {
  if (!url) return { url, blurDataURL: "" };
  const cachedUrl = await downloadImage(id, url);
  if (!cachedUrl) return { url, blurDataURL: "" };
  const blurDataURL = await generateBlurDataURL(id);
  return { url: cachedUrl, blurDataURL };
}

/** Generate a 20x20 blur thumbnail from cached image. Cached as sidecar file ({id}.blur). */
async function generateBlurDataURL(id: string): Promise<string> {
  const blurPath = path.join(CACHE_DIR, `${id}.blur`);
  try {
    return await fs.readFile(blurPath, "utf-8");
  } catch { /* needs generation */ }

  const cached = await getCachedImage(id);
  if (!cached) return "";
  try {
    const sharp = (await import("sharp")).default;
    const buffer = await sharp(cached.filepath)
      .resize(20, 20, { fit: "cover" })
      .blur(3)
      .toFormat("png")
      .toBuffer();
    const dataURL = `data:image/png;base64,${buffer.toString("base64")}`;
    await fs.writeFile(blurPath, dataURL);
    return dataURL;
  } catch {
    return "";
  }
}

/** Read a cached image as base64 data URL (for OG image generation). */
export async function readCachedImageAsBase64(url: string): Promise<string | null> {
  if (!url.startsWith(NOTION_IMAGE_API_PREFIX)) return null;
  const id = url.slice(NOTION_IMAGE_API_PREFIX.length + 1);
  const cached = await getCachedImage(id);
  if (!cached) return null;
  const buffer = await fs.readFile(cached.filepath);
  return `data:${cached.contentType};base64,${buffer.toString("base64")}`;
}
