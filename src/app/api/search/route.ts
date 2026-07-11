import { NextRequest, NextResponse } from "next/server";
import { getListedPosts } from "@/lib/notion/getPosts";
import { searchPosts } from "@/lib/searchPosts";
import { brand } from "@/config/brand";

const MAX_QUERY_LENGTH = 100;

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q")?.trim();

  if (!q || q.length < 2) {
    return NextResponse.json([]);
  }

  if (q.length > MAX_QUERY_LENGTH) {
    return NextResponse.json({ error: "Query is too long" }, { status: 400 });
  }

  try {
    const posts = await getListedPosts();
    const results = searchPosts(posts, q);
    return NextResponse.json(results.slice(0, brand.search.dropdownLimit));
  } catch (error) {
    console.error("[api/search] Error:", error);
    return NextResponse.json({ error: "Search failed" }, { status: 500 });
  }
}
