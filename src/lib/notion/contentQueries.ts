import type { ContentItem } from "@/types";

export function isListed(item: ContentItem): boolean {
  return item.status === "Public";
}

export function isDetailAccessible(item: ContentItem): boolean {
  return item.status === "Public" || item.status === "PublicOnDetail";
}

export function getListedPostsByDate(posts: ContentItem[]): ContentItem[] {
  return posts
    .filter((post) => post.type === "Post" && isListed(post))
    .sort((a, b) => {
      if (!a.date && !b.date) return 0;
      if (!a.date) return 1;
      if (!b.date) return -1;
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
}

export function selectDetailAccessiblePosts(items: ContentItem[]): ContentItem[] {
  return items.filter((item) => item.type === "Post" && isDetailAccessible(item));
}

export function selectListedPages(items: ContentItem[]): ContentItem[] {
  return items.filter((item) => item.type === "Page" && isListed(item));
}

export function selectDetailAccessiblePages(items: ContentItem[]): ContentItem[] {
  return items.filter((item) => item.type === "Page" && isDetailAccessible(item));
}

export function getRelatedPosts(
  post: ContentItem,
  allPosts: ContentItem[],
  limit = 3
): ContentItem[] {
  const tags = new Set(post.tags);
  return allPosts
    .filter((candidate) => candidate.id !== post.id && candidate.type === "Post" && isListed(candidate))
    .map((candidate) => ({
      candidate,
      sameSeries: Boolean(post.series && candidate.series === post.series),
      sharedTags: candidate.tags.filter((tag) => tags.has(tag)).length,
      sameCategory: Boolean(post.category && candidate.category === post.category),
    }))
    .filter(({ sameSeries, sharedTags, sameCategory }) => sameSeries || sharedTags > 0 || sameCategory)
    .sort((a, b) => Number(b.sameSeries) - Number(a.sameSeries)
      || b.sharedTags - a.sharedTags
      || Number(b.sameCategory) - Number(a.sameCategory)
      || b.candidate.date.localeCompare(a.candidate.date)
      || a.candidate.slug.localeCompare(b.candidate.slug))
    .slice(0, Math.max(0, limit))
    .map(({ candidate }) => candidate);
}

export function getSeriesPosts(post: ContentItem, allPosts: ContentItem[]): ContentItem[] {
  if (post.series === null) return [];
  return allPosts
    .filter((p) => p.series === post.series)
    .sort((a, b) => a.date.localeCompare(b.date));
}

export function filterPostsByCategory(posts: ContentItem[], category: string): ContentItem[] {
  return posts.filter(
    (p) => p.category?.toLowerCase() === category.toLowerCase()
  );
}

export function filterPostsByAuthor(allPosts: ContentItem[], peopleIds: string[]): ContentItem[] {
  const pidSet = new Set(peopleIds);
  return allPosts.filter((post) =>
    post.authorIds.some((id) => pidSet.has(id))
  );
}
