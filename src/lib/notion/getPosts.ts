import { unstable_cache } from "next/cache";
import { createSingleFlight } from "@/lib/singleFlight";
import { notionClient } from "./client";
import { getPageProperties } from "./getPageProperties";
import {
  getListedPostsByDate,
  selectDetailAccessiblePages,
  selectDetailAccessiblePosts,
  selectListedPages,
} from "./filterPosts";
import { brand } from "@/config/brand";
import type { Post } from "@/types";
import type { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";

export const NOTION_CONTENT_CACHE_TAG = "notion-content";

async function fetchAllFromNotion(): Promise<Post[]> {
  const dataSourceId = brand.notion.dataSourceId;
  if (!dataSourceId) {
    throw new Error("NOTION_DATA_SOURCE_ID environment variable is required");
  }

  const pages: PageObjectResponse[] = [];
  let cursor: string | undefined;

  do {
    const response = await notionClient.dataSources.query({
      data_source_id: dataSourceId,
      start_cursor: cursor,
      page_size: brand.notion.pageSize,
    });

    for (const page of response.results) {
      if ("properties" in page) {
        pages.push(page as PageObjectResponse);
      }
    }

    cursor = response.has_more ? (response.next_cursor ?? undefined) : undefined;
  } while (cursor);

  return pages.map((page) => getPageProperties(page));
}

const getCachedPosts = unstable_cache(
  fetchAllFromNotion,
  ["all-posts"],
  {
    revalidate: brand.cache.revalidate,
    tags: [NOTION_CONTENT_CACHE_TAG],
  }
);

export interface ContentCatalog {
  listedPosts: Post[];
  detailAccessiblePosts: Post[];
  listedPages: Post[];
  detailAccessiblePages: Post[];
}

/** Fetches the shared Notion dataset once and derives every visibility view from it. */
export const getContentCatalog = createSingleFlight(async (): Promise<ContentCatalog> => {
  const all = await getCachedPosts();
  return {
    listedPosts: getListedPostsByDate(all),
    detailAccessiblePosts: selectDetailAccessiblePosts(all),
    listedPages: selectListedPages(all),
    detailAccessiblePages: selectDetailAccessiblePages(all),
  };
});

/** Content that may appear in feeds, search, navigation, and discovery surfaces. */
export async function getListedPosts(): Promise<Post[]> {
  return (await getContentCatalog()).listedPosts;
}
