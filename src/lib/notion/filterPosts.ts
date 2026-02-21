import type { Post } from "@/types";

export function getPublicPostsByDate(posts: Post[]): Post[] {
  return posts
    .filter((post) => post.status === "Public" && post.type === "Post")
    .sort((a, b) => {
      if (!a.date && !b.date) return 0;
      if (!a.date) return 1;
      if (!b.date) return -1;
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
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
