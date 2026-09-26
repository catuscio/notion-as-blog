import { notionClient } from "./client";
import { brand } from "@/config/brand";
import type { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";

/** Shared cursor pagination for content and author data sources. */
export async function queryDataSourcePages(dataSourceId: string): Promise<PageObjectResponse[]> {
  const pages: PageObjectResponse[] = [];
  let cursor: string | undefined;

  do {
    const response = await notionClient.dataSources.query({
      data_source_id: dataSourceId,
      start_cursor: cursor,
      page_size: brand.notion.pageSize,
    });
    for (const page of response.results) {
      if ("properties" in page) pages.push(page as PageObjectResponse);
    }
    cursor = response.has_more ? (response.next_cursor ?? undefined) : undefined;
  } while (cursor);

  return pages;
}
