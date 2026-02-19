import type { TPost } from "@/types";

export function getPublicPostsByDate(posts: TPost[]): TPost[] {
  return posts
    .filter((post) => (post.status === "Public" || post.status === "PublicOnDetail") && post.type === "Post")
    .sort((a, b) => {
      if (!a.date || !b.date) return 0;
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
}
