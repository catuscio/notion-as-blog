import type { Post, AuthorSummary } from "@/types";

export function resolveAuthor(
  post: Post,
  authorsMap: Record<string, AuthorSummary> | undefined
): AuthorSummary | undefined {
  if (!authorsMap) return undefined;
  return authorsMap[post.authorIds[0]] ?? authorsMap[post.author];
}
