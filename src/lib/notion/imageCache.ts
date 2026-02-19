import fs from "fs";
import path from "path";
import type { NotionBlockWithChildren } from "./types";

const CACHE_DIR = path.join(process.cwd(), ".cache", "notion-images");

function ensureCacheDir() {
  if (!fs.existsSync(CACHE_DIR)) {
    fs.mkdirSync(CACHE_DIR, { recursive: true });
  }
}

function getCachePath(blockId: string, ext: string): string {
  return path.join(CACHE_DIR, `${blockId}${ext}`);
}

function getExtension(url: string): string {
  try {
    const pathname = new URL(url).pathname;
    const ext = path.extname(pathname);
    return ext || ".png";
  } catch {
    return ".png";
  }
}

async function cacheImage(blockId: string, url: string): Promise<string> {
  const ext = getExtension(url);
  const cachePath = getCachePath(blockId, ext);

  if (fs.existsSync(cachePath)) {
    return `/api/notion-image/${blockId}`;
  }

  try {
    ensureCacheDir();
    const response = await fetch(url);
    if (!response.ok) return url;

    const buffer = Buffer.from(await response.arrayBuffer());
    fs.writeFileSync(cachePath, buffer);

    return `/api/notion-image/${blockId}`;
  } catch {
    return url;
  }
}

export async function cacheBlockImagesInPlace(
  blocks: NotionBlockWithChildren[]
): Promise<void> {
  for (const block of blocks) {
    if (block.type === "image") {
      const imageData = block.image;
      const url =
        imageData.type === "file"
          ? imageData.file.url
          : imageData.external.url;

      if (url.includes("secure.notion-static.com") || url.includes("prod-files-secure")) {
        const cachedUrl = await cacheImage(block.id, url);
        if (imageData.type === "file") {
          imageData.file.url = cachedUrl;
        } else {
          imageData.external.url = cachedUrl;
        }
      }
    }

    if (block.children) {
      await cacheBlockImagesInPlace(block.children);
    }
  }
}

export function getImageFromCache(
  id: string
): { buffer: Buffer; contentType: string } | null {
  ensureCacheDir();

  const exts = [".png", ".jpg", ".jpeg", ".gif", ".webp", ".svg"];
  for (const ext of exts) {
    const cachePath = getCachePath(id, ext);
    if (fs.existsSync(cachePath)) {
      const contentTypes: Record<string, string> = {
        ".png": "image/png",
        ".jpg": "image/jpeg",
        ".jpeg": "image/jpeg",
        ".gif": "image/gif",
        ".webp": "image/webp",
        ".svg": "image/svg+xml",
      };
      return {
        buffer: fs.readFileSync(cachePath),
        contentType: contentTypes[ext] || "application/octet-stream",
      };
    }
  }

  return null;
}
