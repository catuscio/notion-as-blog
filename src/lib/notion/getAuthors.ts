import { notionClient } from "./client";
import { brand } from "@/config/brand";
import type { TAuthor } from "@/types";
import type { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import { getRichTextPlain, getFileUrl, getUrl, getProp } from "./propertyHelpers";

function parseAuthorPage(page: PageObjectResponse): TAuthor {
  const props = page.properties;
  const get = (name: string) => getProp(props, name);

  return {
    id: page.id,
    name: getRichTextPlain(get("name")),
    avatar: getFileUrl(get("avatar")),
    bio: getRichTextPlain(get("bio")),
    role: getRichTextPlain(get("role")),
    socials: {
      github: getUrl(get("github")),
      x: getUrl(get("x") ?? get("twitter")),
      linkedin: getUrl(get("linkedin")),
      website: getUrl(get("website")),
      email: getRichTextPlain(get("email")),
    },
  };
}

let cachedAuthors: TAuthor[] | null = null;
let cacheTimestamp = 0;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

async function fetchAuthorsFromNotion(): Promise<TAuthor[]> {
  const dataSourceId = brand.notion.authorsDataSourceId;
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

  return pages.map(parseAuthorPage);
}

export async function getAllAuthors(): Promise<TAuthor[]> {
  const now = Date.now();
  if (cachedAuthors && now - cacheTimestamp < CACHE_TTL) {
    return cachedAuthors;
  }

  const authors = await fetchAuthorsFromNotion();
  cachedAuthors = authors;
  cacheTimestamp = now;
  return authors;
}

export async function getAuthorByName(name: string): Promise<TAuthor | null> {
  const authors = await getAllAuthors();
  return authors.find((a) => a.name === name) ?? null;
}
