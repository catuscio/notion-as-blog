import { unstable_cache } from "next/cache";
import { createSingleFlight } from "@/lib/singleFlight";
import { notionClient } from "./client";
import { mapNotionPageToContent } from "./mapNotionPage";
import {
  getListedPostsByDate,
  selectDetailAccessiblePages,
  selectDetailAccessiblePosts,
  selectListedPages,
} from "./contentQueries";
import { brand } from "@/config/brand";
import type { ContentItem } from "@/types";
import type { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";

export const NOTION_CONTENT_CACHE_TAG = "notion-content";

async function fetchContentFromNotion(): Promise<ContentItem[]> {
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

  return pages.map(mapNotionPageToContent);
}

const getCachedContent = unstable_cache(
  fetchContentFromNotion,
  ["all-content"],
  {
    revalidate: brand.cache.revalidate,
    tags: [NOTION_CONTENT_CACHE_TAG],
  }
);

export interface ContentCatalog {
  listedPosts: ContentItem[];
  detailAccessiblePosts: ContentItem[];
  listedPages: ContentItem[];
  detailAccessiblePages: ContentItem[];
}

/** Fetches the shared Notion dataset once and derives every visibility view from it. */
export const getContentCatalog = createSingleFlight(async (): Promise<ContentCatalog> => {
  if (process.env.BLOG_UI_PREVIEW === "1" && process.env.NOTION_API_KEY === "preview") {
    return (await import("./uiPreviewFixture")).uiPreviewCatalog;
  }
  const contentItems = await getCachedContent();
  return {
    listedPosts: getListedPostsByDate(contentItems),
    detailAccessiblePosts: selectDetailAccessiblePosts(contentItems),
    listedPages: selectListedPages(contentItems),
    detailAccessiblePages: selectDetailAccessiblePages(contentItems),
  };
});

/** Content that may appear in feeds, search, navigation, and discovery surfaces. */
export async function getListedPosts(): Promise<ContentItem[]> {
  return (await getContentCatalog()).listedPosts;
}
