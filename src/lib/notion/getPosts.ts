import { notionClient } from "./client";
import { getPageProperties } from "./getPageProperties";
import { filterPublicPosts } from "./filterPosts";
import { brand } from "@/config/brand";
import type { TPost } from "@/types";
import type { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";

async function fetchAllFromNotion(): Promise<TPost[]> {
  const dataSourceId = brand.notion.dataSourceId;
  if (!dataSourceId) return [];

  const pages: PageObjectResponse[] = [];
  let cursor: string | undefined = undefined;

  do {
    const response = await notionClient.dataSources.query({
      data_source_id: dataSourceId,
      start_cursor: cursor,
      page_size: 100,
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

export async function getAllPosts(): Promise<TPost[]> {
  const all = await fetchAllFromNotion();
  return filterPublicPosts(all);
}

export async function getAllPages(): Promise<TPost[]> {
  const all = await fetchAllFromNotion();
  return all.filter(
    (item) => item.type === "Page" && (item.status === "Public" || item.status === "PublicOnDetail")
  );
}
