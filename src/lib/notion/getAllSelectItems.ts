import type { Post, TagItem } from "@/types";
import { brand } from "@/config/brand";

export function getAllTags(posts: Post[]): TagItem[] {
  const tagMap = new Map<string, number>();
  posts.forEach((post) => {
    post.tags.forEach((tag) => {
      tagMap.set(tag, (tagMap.get(tag) || 0) + 1);
    });
  });
  return Array.from(tagMap.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .filter((tag) => tag.count >= brand.tags.minPostCount)
    .slice(0, brand.tags.maxDisplayCount);
}
