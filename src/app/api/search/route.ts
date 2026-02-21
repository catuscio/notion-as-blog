import { NextRequest, NextResponse } from "next/server";
import { getPublishedPosts } from "@/lib/notion/getPosts";
import { searchPosts } from "@/lib/searchPosts";
import { brand } from "@/config/brand";

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q")?.trim();

  if (!q || q.length < 2) {
    return NextResponse.json([]);
  }

  try {
    const posts = await getPublishedPosts();
    const results = searchPosts(posts, q);
    return NextResponse.json(results.slice(0, brand.search.dropdownLimit));
  } catch (error) {
    console.error("[api/search] Error:", error);
    return NextResponse.json({ error: "Search failed" }, { status: 500 });
  }
}
