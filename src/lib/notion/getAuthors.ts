import { notionClient } from "./client";
import { cacheCoverImage } from "./imageCache";
import { safeQuery } from "./safeQuery";
import { brand } from "@/config/brand";
import type { Author, AuthorSummary } from "@/types";
import type { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import { getRichTextPlain, getImageFileUrl, getUrlOrText, getProp, getPeopleIds } from "./propertyHelpers";

function parseAuthorPage(page: PageObjectResponse): Author {
  const props = page.properties;
  const get = (name: string) => getProp(props, name);

  return {
    id: page.id,
    name: getRichTextPlain(get("name")),
    peopleIds: getPeopleIds(get("people")),
    avatar: getImageFileUrl(get("avatar")),
    blurDataURL: "",
    bio: getRichTextPlain(get("bio")),
    role: getRichTextPlain(get("role")),
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
let cachedAuthors: Author[] | null = null;
let cacheTimestamp = 0;
const CACHE_TTL = brand.cache.authorsTtlMs;

async function fetchAuthorsFromNotion(): Promise<Author[]> {
  const dataSourceId = brand.notion.authorsDataSourceId;
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

    const authors = pages.map(parseAuthorPage);
    await Promise.all(
      authors.map(async (author) => {
        if (author.avatar) {
          const result = await safeQuery(
            () => cacheCoverImage(author.id, author.avatar),
            { url: author.avatar, blurDataURL: "" }
          );
          author.avatar = result.url;
          author.blurDataURL = result.blurDataURL;
        }
      })
    );
    return authors;
  } catch (error) {
    console.error("[getAuthors] Failed to fetch from Notion:", error);
    return [];
  }
}

export async function getAllAuthors(): Promise<Author[]> {
  const now = Date.now();
  if (cachedAuthors && now - cacheTimestamp < CACHE_TTL) {
    return cachedAuthors;
  }

  const authors = await fetchAuthorsFromNotion();
  cachedAuthors = authors;
  cacheTimestamp = now;
  return authors;
}

export async function getAuthorByPeopleIds(peopleIds: string[]): Promise<Author | null> {
  if (peopleIds.length === 0) return null;
  const authors = await getAllAuthors();
  return authors.find((a) => a.peopleIds.some((pid) => peopleIds.includes(pid))) ?? null;
}

/**
 * Returns a lookup map keyed by both Notion peopleId and author name,
 * so callers can resolve an author summary with either key.
 */
export async function getAuthorLookupMap(): Promise<Record<string, AuthorSummary>> {
  const authors = await getAllAuthors();
  const map: Record<string, AuthorSummary> = {};
  for (const a of authors) {
    const summary: AuthorSummary = { avatar: a.avatar, name: a.name, blurDataURL: a.blurDataURL };
    for (const pid of a.peopleIds) {
      map[pid] = summary;
    }
    map[a.name] = summary;
  }
  return map;
}

export async function getAuthorByName(name: string): Promise<Author | null> {
  const authors = await getAllAuthors();
  return authors.find((a) => a.name === name) ?? null;
}
