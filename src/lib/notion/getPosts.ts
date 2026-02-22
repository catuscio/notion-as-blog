import { unstable_cache } from "next/cache";
import { notionClient } from "./client";
import { getPageProperties } from "./getPageProperties";
import { getPublicPostsByDate } from "./filterPosts";
import { cacheCoverImage } from "./imageCache";
import { safeQuery } from "./safeQuery";
import { brand } from "@/config/brand";
import type { Post } from "@/types";
import type { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";

async function fetchAllFromNotion(): Promise<Post[]> {
  const dataSourceId = brand.notion.dataSourceId;
  if (!dataSourceId) return [];

  try {
    const pages: PageObjectResponse[] = [];
    let cursor: string | undefined = undefined;

    do {
      const response = await notionClient.dataSources.query({
        data_source_id: dataSourceId,
        start_cursor: cursor,
        page_size: brand.notion.pageSize,
      });

      for (const page of response?.results ?? []) {
        if ("properties" in page) {
          pages.push(page as PageObjectResponse);
        }
      }

      cursor = response.has_more ? (response.next_cursor ?? undefined) : undefined;
    } while (cursor);

    const posts = pages.map((page) => getPageProperties(page));
    await Promise.all(
      posts.map(async (post) => {
        if (post.thumbnail) {
          const result = await safeQuery(
            () => cacheCoverImage(post.id, post.thumbnail),
            { url: post.thumbnail, blurDataURL: "" }
          );
          post.thumbnail = result.url;
          post.blurDataURL = result.blurDataURL;
        }
      })
    );
    return posts;
  } catch (error) {
    console.error("[getPosts] Failed to fetch from Notion:", error);
    return [];
  }
}

const getCachedPosts = unstable_cache(
  fetchAllFromNotion,
  ["all-posts"],
  { revalidate: brand.cache.revalidate }
);

export async function getPublishedPosts(): Promise<Post[]> {
  const all = await getCachedPosts();
  return getPublicPostsByDate(all);
}

/** Returns only Public posts (excludes PublicOnDetail), for feeds and sitemaps. */
export async function getPublicPosts(): Promise<Post[]> {
  const all = await getPublishedPosts();
  return all.filter((p) => p.status === "Public");
}

export async function getPublishedPages(): Promise<Post[]> {
  const all = await getCachedPosts();
  return all.filter(
    (item) => item.type === "Page" && (item.status === "Public" || item.status === "PublicOnDetail")
  );
}
