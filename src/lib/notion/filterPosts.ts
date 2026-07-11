import type { Post } from "@/types";

export function isListed(item: Post): boolean {
  return item.status === "Public";
}

export function isDetailAccessible(item: Post): boolean {
  return item.status === "Public" || item.status === "PublicOnDetail";
}

export function getListedPostsByDate(posts: Post[]): Post[] {
  return posts
    .filter((post) => post.type === "Post" && isListed(post))
    .sort((a, b) => {
      if (!a.date && !b.date) return 0;
      if (!a.date) return 1;
      if (!b.date) return -1;
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
}

export function selectDetailAccessiblePosts(items: Post[]): Post[] {
  return items.filter((item) => item.type === "Post" && isDetailAccessible(item));
}

export function selectListedPages(items: Post[]): Post[] {
  return items.filter((item) => item.type === "Page" && isListed(item));
}

export function selectDetailAccessiblePages(items: Post[]): Post[] {
  return items.filter((item) => item.type === "Page" && isDetailAccessible(item));
}

export function getRelatedPosts(
  post: Post,
  allPosts: Post[],
  limit = 3
): Post[] {
  return allPosts
    .filter((p) => p.id !== post.id && p.category === post.category)
    .slice(0, limit);
}

export function getSeriesPosts(post: Post, allPosts: Post[]): Post[] {
  if (post.series === null) return [];
  return allPosts
    .filter((p) => p.series === post.series)
    .sort((a, b) => a.date.localeCompare(b.date));
}

export function filterPostsByCategory(posts: Post[], category: string): Post[] {
  return posts.filter(
    (p) => p.category?.toLowerCase() === category.toLowerCase()
  );
}

export function filterPostsByAuthor(allPosts: Post[], peopleIds: string[]): Post[] {
  const pidSet = new Set(peopleIds);
  return allPosts.filter((post) =>
    post.authorIds.some((id) => pidSet.has(id))
  );
}
