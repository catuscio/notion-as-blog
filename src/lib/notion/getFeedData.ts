import { getVisibleTagCounts } from "./getTagCounts";
import { getOptionalAuthorLookupMap } from "./getAuthors";
import type { ContentItem } from "@/types";

export async function getFeedData(posts: ContentItem[]) {
  const tags = getVisibleTagCounts(posts).map((tag) => tag.name);
  const authorsMap = await getOptionalAuthorLookupMap();
  return { tags, authorsMap };
}
