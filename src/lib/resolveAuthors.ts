import type { ContentItem, AuthorSummary } from "@/types";

export function resolveAuthors(
  post: ContentItem,
  authorsMap: Record<string, AuthorSummary> | undefined
): AuthorSummary[] {
  if (!authorsMap) return [];

  const seen = new Set<string>();
  const result: AuthorSummary[] = [];

  for (const pid of post.authorIds) {
    const author = authorsMap[pid];
    if (author && !seen.has(author.name)) {
      seen.add(author.name);
      result.push(author);
    }
  }

  if (result.length === 0) {
    const names = post.author.split(", ").filter(Boolean);
    for (const name of names) {
      const author = authorsMap[name];
      if (author && !seen.has(author.name)) {
        seen.add(author.name);
        result.push(author);
      }
    }
  }

  return result;
}
