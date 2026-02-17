import type { TPost, TTagItem, TCategoryItem } from "@/types";

export function getAllTags(posts: TPost[]): TTagItem[] {
  const tagMap = new Map<string, number>();
  posts.forEach((post) => {
    post.tags.forEach((tag) => {
      tagMap.set(tag, (tagMap.get(tag) || 0) + 1);
    });
  });
  return Array.from(tagMap.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
}

export function getAllCategories(posts: TPost[]): TCategoryItem[] {
  const catMap = new Map<string, number>();
  posts.forEach((post) => {
    if (post.category) {
      catMap.set(post.category, (catMap.get(post.category) || 0) + 1);
    }
  });
  return Array.from(catMap.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
}
