import type { Post, AuthorSummary } from "@/types";

export function resolveAuthor(
  post: Post,
  authorsMap: Record<string, AuthorSummary> | undefined
): AuthorSummary | undefined {
  if (!authorsMap) return undefined;
  return authorsMap[post.authorIds[0]] ?? authorsMap[post.author];
}

export function resolveAuthors(
  post: Post,
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
