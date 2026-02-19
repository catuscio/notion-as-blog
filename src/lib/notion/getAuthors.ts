import { notionClient } from "./client";
import { brand } from "@/config/brand";
import type { TAuthor, AuthorSummary } from "@/types";
import type { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import { getRichTextPlain, getFileUrl, getUrlOrText, getPeopleIds, getProp } from "./propertyHelpers";

function parseAuthorPage(page: PageObjectResponse): TAuthor {
  const props = page.properties;
  const get = (name: string) => getProp(props, name);

  return {
    id: page.id,
    name: getRichTextPlain(get("name")),
    avatar: getFileUrl(get("avatar")),
    bio: getRichTextPlain(get("bio")),
    role: getRichTextPlain(get("role")),
    peopleIds: getPeopleIds(get("people")),
    socials: {
      github: getUrlOrText(get("github")),
      x: getUrlOrText(get("x") ?? get("twitter")),
      linkedin: getUrlOrText(get("linkedin")),
      website: getUrlOrText(get("website")),
      email: getRichTextPlain(get("email")),
    },
  };
}

// Manual in-memory TTL cache instead of unstable_cache:
// Authors DB is small and rarely changes, so a lightweight in-process cache
// avoids Next.js cache serialization overhead. In serverless environments,
// each instance maintains its own cache — acceptable given the short TTL.
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

export async function getAuthorByPeopleIds(peopleIds: string[]): Promise<TAuthor | null> {
  if (peopleIds.length === 0) return null;
  const authors = await getAllAuthors();
  return authors.find((a) =>
    a.peopleIds.some((pid) => peopleIds.includes(pid))
  ) ?? null;
}

export async function getAuthorLookupMap(): Promise<Record<string, AuthorSummary>> {
  const authors = await getAllAuthors();
  const map: Record<string, AuthorSummary> = {};
  for (const a of authors) {
    const summary: AuthorSummary = { avatar: a.avatar, name: a.name };
    map[a.name] = summary;
    for (const pid of a.peopleIds) {
      map[pid] = summary;
    }
  }
  return map;
}
