import { getVisibleTagCounts } from "./getTagCounts";
import { getAuthorLookupMap } from "./getAuthors";
import type { ContentItem } from "@/types";

export async function getFeedData(posts: ContentItem[]) {
  const tags = getVisibleTagCounts(posts).map((tag) => tag.name);
  const authorsMap = await getAuthorLookupMap();
  return { tags, authorsMap };
}
