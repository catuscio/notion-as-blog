import type { ContentItem } from "@/types";

export function searchPosts(posts: ContentItem[], query: string): ContentItem[] {
  const q = query.toLowerCase();
  return posts.filter((post) => {
    const title = post.title.toLowerCase();
    const summary = post.summary.toLowerCase();
    const category = post.category?.toLowerCase() ?? "";
    const tags = post.tags.map((t) => t.toLowerCase());

    return (
      title.includes(q) ||
      summary.includes(q) ||
      category.includes(q) ||
      tags.some((tag) => tag.includes(q))
    );
  });
}
