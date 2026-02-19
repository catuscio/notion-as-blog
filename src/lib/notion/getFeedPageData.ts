import { getAllTags } from "./getAllSelectItems";
import { getAllAuthors } from "./getAuthors";
import { safeQuery } from "./safeQuery";
import type { TPost, AuthorSummary } from "@/types";

export async function getFeedPageData(posts: TPost[]) {
  const tags = getAllTags(posts).map((t) => t.name);

  const authors = await safeQuery(() => getAllAuthors(), []);
  const authorsMap: Record<string, AuthorSummary> = {};
  for (const a of authors) {
    authorsMap[a.name] = { avatar: a.avatar, name: a.name };
    for (const pid of a.peopleIds) {
      authorsMap[pid] = { avatar: a.avatar, name: a.name };
    }
  }

  return { tags, authorsMap };
}
