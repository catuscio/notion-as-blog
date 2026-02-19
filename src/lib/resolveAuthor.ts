import type { AuthorSummary } from "@/types";

export function resolveAuthor(
  authorIds: string[],
  authorName: string,
  authorsMap: Record<string, AuthorSummary>
): AuthorSummary | undefined {
  for (const id of authorIds) {
    if (authorsMap[id]) return authorsMap[id];
  }
  if (authorName && authorsMap[authorName]) return authorsMap[authorName];
  return undefined;
}
