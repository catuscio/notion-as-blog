import { NextRequest, NextResponse } from "next/server";
import { getPublishedPosts } from "@/lib/notion/getPosts";
import { searchPosts } from "@/lib/searchPosts";
import { brand } from "@/config/brand";

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q")?.trim().toLowerCase();

  if (!q || q.length < 2) {
    return NextResponse.json([]);
  }

  const posts = await getPublishedPosts();
  const results = searchPosts(posts, q);

  return NextResponse.json(results.slice(0, brand.search.dropdownLimit));
}
