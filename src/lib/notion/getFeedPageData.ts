import { getAllTags } from "./getAllSelectItems";
import { getAuthorLookupMap } from "./getAuthors";
import { safeQuery } from "./safeQuery";
import type { Post, AuthorSummary } from "@/types";

export async function getFeedPageData(posts: Post[]) {
  const tags = getAllTags(posts).map((t) => t.name);
  const authorsMap = await safeQuery<Record<string, AuthorSummary>>(
    getAuthorLookupMap,
    {}
  );
  return { tags, authorsMap };
}
