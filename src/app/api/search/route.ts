import { NextRequest, NextResponse } from "next/server";
import { getAllPosts } from "@/lib/notion/getPosts";

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q")?.trim().toLowerCase();

  if (!q || q.length < 2) {
    return NextResponse.json([]);
  }

  const posts = await getAllPosts();

  const results = posts.filter((post) => {
    const title = post.title.toLowerCase();
    const summary = post.summary.toLowerCase();
    const category = post.category.toLowerCase();
    const tags = post.tags.map((t) => t.toLowerCase());

    return (
      title.includes(q) ||
      summary.includes(q) ||
      category.includes(q) ||
      tags.some((tag) => tag.includes(q))
    );
  });

  return NextResponse.json(results.slice(0, 10));
}
