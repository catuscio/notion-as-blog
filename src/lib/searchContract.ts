import type { ContentItem } from "@/types";

export const MIN_SEARCH_QUERY_LENGTH = 2;
export const MAX_SEARCH_QUERY_LENGTH = 100;

export type SearchErrorCode = "QUERY_TOO_LONG" | "SEARCH_UNAVAILABLE";

export interface SearchResult {
  slug: string;
  title: string;
  summary: string;
  thumbnail: string;
  category: string | null;
  tags: string[];
}

export interface SearchErrorResponse {
  error: {
    code: SearchErrorCode;
    message: string;
  };
}

export function toSearchResult(content: ContentItem): SearchResult {
  const { slug, title, summary, thumbnail, category, tags } = content;
  return { slug, title, summary, thumbnail, category, tags };
}
