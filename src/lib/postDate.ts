import type { Post } from "@/types";

/** Returns the best available date for a post: lastEditedTime > date > epoch(0). */
export function getPostDate(post: Post): Date {
  if (post.lastEditedTime) return new Date(post.lastEditedTime);
  if (post.date) return new Date(post.date);
  return new Date(0);
}

/** Returns the latest date among the given posts, or undefined if empty. */
export function latestDateAmong(posts: Post[]): Date | undefined {
  if (posts.length === 0) return undefined;
  return posts.reduce((latest, post) => {
    const d = getPostDate(post);
    return d > latest ? d : latest;
  }, new Date(0));
}
