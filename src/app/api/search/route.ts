import { NextRequest, NextResponse } from "next/server";
import { getListedPosts } from "@/lib/notion/contentCatalog";
import { searchPosts } from "@/lib/searchPosts";
import { brand } from "@/config/brand";
import {
  MAX_SEARCH_QUERY_LENGTH,
  MIN_SEARCH_QUERY_LENGTH,
  toSearchResult,
} from "@/lib/searchContract";

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q")?.trim();

  if (!q || q.length < MIN_SEARCH_QUERY_LENGTH) {
    return NextResponse.json([]);
  }

  if (q.length > MAX_SEARCH_QUERY_LENGTH) {
    return NextResponse.json(
      { error: { code: "QUERY_TOO_LONG", message: "Query is too long" } },
      { status: 400 },
    );
  }

  try {
    const posts = await getListedPosts();
    const results = searchPosts(posts, q);
    return NextResponse.json(
      results.slice(0, brand.search.dropdownLimit).map(toSearchResult),
    );
  } catch (error) {
    console.error("[api/search] Error:", error);
    return NextResponse.json(
      { error: { code: "SEARCH_UNAVAILABLE", message: "Search is temporarily unavailable" } },
      { status: 503 },
    );
  }
}
