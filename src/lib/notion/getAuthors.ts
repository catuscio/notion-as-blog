import { unstable_cache } from "next/cache";
import { queryDataSourcePages } from "./queryDataSourcePages";
import { brand } from "@/config/brand";
import type { Author, AuthorSummary } from "@/types";
import type { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import { getRichTextPlain, getUrlOrText, getProp, getPeopleIds } from "./propertyHelpers";
import { stableImageFileUrl } from "./imageProxy";
import { loadOptionalAuthors } from "./optionalAuthors";

function parseAuthorPage(page: PageObjectResponse): Author {
  const props = page.properties;
  const get = (name: string) => getProp(props, name);

  return {
    id: page.id,
    name: getRichTextPlain(get("name")),
    peopleIds: getPeopleIds(get("people")),
    avatar: stableImageFileUrl(get("avatar"), page.id, "avatar"),
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

export const NOTION_AUTHORS_CACHE_TAG = "notion-authors";

async function fetchAuthorsFromNotion(): Promise<Author[]> {
  const dataSourceId = brand.notion.authorsDataSourceId;
  if (!dataSourceId) return [];

  const pages = await queryDataSourcePages(dataSourceId);
  return pages.map(parseAuthorPage);
}

const getCachedAuthors = unstable_cache(fetchAuthorsFromNotion, ["all-authors"], {
  revalidate: brand.cache.authorsRevalidate,
  tags: [NOTION_AUTHORS_CACHE_TAG],
});

/** Strict author access for routes whose primary resource is the Authors data source. */
export async function getAllAuthors(): Promise<Author[]> {
  return getCachedAuthors();
}

/**
 * Optional presentation enrichment. Primary content must remain available when
 * the separately configured Authors data source is unavailable.
 */
async function getOptionalAuthors(): Promise<Author[]> {
  return loadOptionalAuthors(getAllAuthors);
}

export async function getOptionalAuthorsByPeopleIds(peopleIds: string[]): Promise<Author[]> {
  if (peopleIds.length === 0) return [];
  return selectAuthorsByPeopleIds(await getOptionalAuthors(), peopleIds);
}

function selectAuthorsByPeopleIds(authors: Author[], peopleIds: string[]): Author[] {
  const authorsByPeopleId = new Map(
    authors.flatMap((author) => author.peopleIds.map((peopleId) => [peopleId, author] as const)),
  );
  const seen = new Set<string>();
  return peopleIds.flatMap((peopleId) => {
    const author = authorsByPeopleId.get(peopleId);
    if (!author || seen.has(author.id)) return [];
    seen.add(author.id);
    return [author];
  });
}

/**
 * Returns a lookup map keyed by both Notion peopleId and author name,
 * so callers can resolve an author summary with either key.
 */
export async function getOptionalAuthorLookupMap(): Promise<Record<string, AuthorSummary>> {
  return createAuthorLookupMap(await getOptionalAuthors());
}

export async function getOptionalAllAuthors(): Promise<Author[]> {
  return getOptionalAuthors();
}

function createAuthorLookupMap(authors: Author[]): Record<string, AuthorSummary> {
  const map: Record<string, AuthorSummary> = {};
  for (const author of authors) {
    const summary: AuthorSummary = { avatar: author.avatar, name: author.name };
    for (const peopleId of author.peopleIds) map[peopleId] = summary;
    map[author.name] = summary;
  }
  return map;
}
