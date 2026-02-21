import fs from "fs/promises";
import path from "path";
import type { NotionBlockWithChildren } from "./types";

const CACHE_DIR = path.join(process.cwd(), ".next/cache/og-metadata");
const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours
const FETCH_TIMEOUT_MS = 5000;

export interface OgMetadata {
  title: string;
  description: string;
  image: string;
  favicon: string;
  siteName: string;
}

const EMPTY: OgMetadata = { title: "", description: "", image: "", favicon: "", siteName: "" };

function cacheFilePath(url: string): string {
  const hash = Buffer.from(url).toString("base64url").slice(0, 64);
  return path.join(CACHE_DIR, `${hash}.json`);
}

function extractOgTags(html: string, url: string): OgMetadata {
  const get = (pattern: RegExp): string => {
    const match = html.match(pattern);
    return match?.[1]?.replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">").trim() ?? "";
  };

  const title =
    get(/<meta[^>]+property="og:title"[^>]+content="([^"]*)"/) ||
    get(/<meta[^>]+content="([^"]*)"[^>]+property="og:title"/) ||
    get(/<title[^>]*>([^<]*)<\/title>/);

  const description =
    get(/<meta[^>]+property="og:description"[^>]+content="([^"]*)"/) ||
    get(/<meta[^>]+content="([^"]*)"[^>]+property="og:description"/) ||
    get(/<meta[^>]+name="description"[^>]+content="([^"]*)"/) ||
    get(/<meta[^>]+content="([^"]*)"[^>]+name="description"/);

  const image =
    get(/<meta[^>]+property="og:image"[^>]+content="([^"]*)"/) ||
    get(/<meta[^>]+content="([^"]*)"[^>]+property="og:image"/);

  const siteName =
    get(/<meta[^>]+property="og:site_name"[^>]+content="([^"]*)"/) ||
    get(/<meta[^>]+content="([^"]*)"[^>]+property="og:site_name"/);

  let favicon =
    get(/<link[^>]+rel="icon"[^>]+href="([^"]*)"/) ||
    get(/<link[^>]+href="([^"]*)"[^>]+rel="icon"/) ||
    get(/<link[^>]+rel="shortcut icon"[^>]+href="([^"]*)"/) ||
    get(/<link[^>]+href="([^"]*)"[^>]+rel="shortcut icon"/);

  try {
    const base = new URL(url);
    if (favicon && !favicon.startsWith("http")) {
      favicon = new URL(favicon, base).href;
    }
  } catch {
    // keep as-is
  }

  if (!favicon) {
    try {
      favicon = `${new URL(url).origin}/favicon.ico`;
    } catch {
      // ignore
    }
  }

  return { title, description, image, favicon, siteName };
}

async function fetchOgFromUrl(url: string): Promise<OgMetadata> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; BlogBot/1.0)",
        Accept: "text/html",
      },
      redirect: "follow",
    });
    if (!res.ok) return EMPTY;

    const reader = res.body?.getReader();
    if (!reader) return EMPTY;

    let html = "";
    const decoder = new TextDecoder();
    while (html.length < 50_000) {
      const { done, value } = await reader.read();
      if (done) break;
      html += decoder.decode(value, { stream: true });
    }
    reader.cancel();

    return extractOgTags(html, url);
  } catch {
    return EMPTY;
  } finally {
    clearTimeout(timeout);
  }
}

async function readCache(filepath: string): Promise<{ data: OgMetadata; fresh: boolean } | null> {
  try {
    const stat = await fs.stat(filepath);
    const data = JSON.parse(await fs.readFile(filepath, "utf-8")) as OgMetadata;
    const fresh = Date.now() - stat.mtimeMs < CACHE_TTL_MS;
    return { data, fresh };
  } catch {
    return null;
  }
}

async function writeCache(filepath: string, data: OgMetadata): Promise<void> {
  try {
    await fs.mkdir(CACHE_DIR, { recursive: true });
    await fs.writeFile(filepath, JSON.stringify(data));
  } catch {
    // ignore write errors
  }
}

async function getOgMetadata(url: string): Promise<OgMetadata> {
  const filepath = cacheFilePath(url);
  const cached = await readCache(filepath);

  if (cached?.fresh) return cached.data;

  const fetched = await fetchOgFromUrl(url);

  if (!fetched.title && cached) return cached.data;

  if (fetched.title) {
    await writeCache(filepath, fetched);
    return fetched;
  }

  return EMPTY;
}

function getBookmarkUrl(block: NotionBlockWithChildren): string | null {
  if (block.type === "bookmark") return block.bookmark.url;
  if (block.type === "link_preview") return block.link_preview.url;
  return null;
}

/**
 * Walk blocks recursively, fetch OG metadata for bookmark/link_preview blocks,
 * and attach the result as `_ogMetadata` on the block object.
 */
export async function enrichBookmarkOgInPlace(
  blocks: NotionBlockWithChildren[]
): Promise<void> {
  const tasks: Promise<void>[] = [];

  for (const block of blocks) {
    const url = getBookmarkUrl(block);
    if (url) {
      tasks.push(
        getOgMetadata(url).then((og) => {
          (block as Record<string, unknown>)._ogMetadata = og;
        })
      );
    }

    if (block.children) {
      tasks.push(enrichBookmarkOgInPlace(block.children));
    }
  }

  await Promise.all(tasks);
}
