import { revalidatePath, revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { env } from "@/config/env";
import { NOTION_CONTENT_CACHE_TAG } from "@/lib/notion/contentCatalog";
import { NOTION_AUTHORS_CACHE_TAG } from "@/lib/notion/getAuthors";

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get("authorization") ?? "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : authHeader;

  const expected = env.revalidateToken;
  if (!expected) {
    return NextResponse.json(
      { error: { code: "REVALIDATION_DISABLED", message: "Revalidation token is not configured" } },
      { status: 503 },
    );
  }
  if (token !== expected) {
    return NextResponse.json(
      { error: { code: "UNAUTHORIZED", message: "Invalid token" } },
      { status: 401 },
    );
  }

  try {
    revalidateTag(NOTION_CONTENT_CACHE_TAG, { expire: 0 });
    revalidateTag(NOTION_AUTHORS_CACHE_TAG, { expire: 0 });
    revalidatePath("/", "layout");
    return NextResponse.json({ revalidated: true, now: Date.now() });
  } catch (error) {
    console.error("[api/revalidate] Error:", error);
    return NextResponse.json(
      { error: { code: "REVALIDATION_FAILED", message: "Failed to revalidate content" } },
      { status: 500 }
    );
  }
}
