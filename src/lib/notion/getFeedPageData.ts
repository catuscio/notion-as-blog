import { getAllTags } from "./getAllSelectItems";
import { getAuthorLookupMap } from "./getAuthors";
import type { Post } from "@/types";

export async function getFeedPageData(posts: Post[]) {
  const tags = getAllTags(posts).map((t) => t.name);
  const authorsMap = await getAuthorLookupMap();
  return { tags, authorsMap };
}
