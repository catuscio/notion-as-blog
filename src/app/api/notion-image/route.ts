import { NextRequest, NextResponse } from "next/server";
import {
  hasValidNotionImageSignature,
  resolveNotionImageUrl,
} from "@/lib/notion/imageProxy";

export const dynamic = "force-dynamic";

const MAX_SAFE_CACHE_SECONDS = 3300;
const DEFAULT_CACHE_SECONDS = MAX_SAFE_CACHE_SECONDS;
const DEFAULT_STALE_SECONDS = 60;

function notionImageCacheSeconds() {
  const value = Number(process.env.NOTION_IMAGE_CACHE_SECONDS);
  if (!Number.isFinite(value)) return DEFAULT_CACHE_SECONDS;
  return Math.max(0, Math.min(Math.floor(value), MAX_SAFE_CACHE_SECONDS));
}

function cacheHeaders() {
  const headers = new Headers();
  const maxAge = notionImageCacheSeconds();

  if (maxAge === 0) {
    headers.set("Cache-Control", "private, no-store");
    return headers;
  }

  const sharedCache = `public, s-maxage=${maxAge}, stale-while-revalidate=${DEFAULT_STALE_SECONDS}`;
  headers.set("Cache-Control", "public, max-age=0, must-revalidate");
  headers.set("CDN-Cache-Control", sharedCache);
  headers.set("Vercel-CDN-Cache-Control", sharedCache);
  return headers;
}

async function proxyFile(url: string) {
  const response = await fetch(url);
  if (!response.ok || !response.body) {
    return new NextResponse("Failed to fetch Notion file", { status: 502 });
  }

  const headers = cacheHeaders();
  const contentType = response.headers.get("Content-Type");
  if (contentType) headers.set("Content-Type", contentType);

  return new NextResponse(response.body, {
    status: 200,
    headers,
  });
}

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;

  if (!hasValidNotionImageSignature(searchParams)) {
    return new NextResponse("Invalid image signature", { status: 403 });
  }

  try {
    const url = await resolveNotionImageUrl(searchParams);
    return url ? proxyFile(url) : new NextResponse("Notion file not found", { status: 404 });
  } catch (error) {
    console.error("[api/notion-image] Error:", error);
    return new NextResponse("Failed to resolve Notion file", { status: 502 });
  }
}
