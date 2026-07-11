"use client";

import { useState, useEffect } from "react";
import {
  MAX_SEARCH_QUERY_LENGTH,
  MIN_SEARCH_QUERY_LENGTH,
  type SearchErrorCode,
  type SearchErrorResponse,
  type SearchResult,
} from "@/lib/searchContract";

const SEARCH_API = "/api/search";
const SEARCH_DEBOUNCE_MS = 300;

export function useSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<SearchErrorCode | null>(null);
  const [activeIndex, setActiveIndex] = useState(-1);

  useEffect(() => {
    const normalizedQuery = query.trim();
    if (normalizedQuery.length < MIN_SEARCH_QUERY_LENGTH) {
      setResults([]);
      setError(null);
      setLoading(false);
      return;
    }

    if (normalizedQuery.length > MAX_SEARCH_QUERY_LENGTH) {
      setResults([]);
      setError("QUERY_TOO_LONG");
      setLoading(false);
      return;
    }

    const controller = new AbortController();
    const timer = setTimeout(async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `${SEARCH_API}?q=${encodeURIComponent(normalizedQuery)}`,
          { signal: controller.signal },
        );
        if (!response.ok) {
          const body = (await response.json().catch(() => null)) as SearchErrorResponse | null;
          setResults([]);
          setError(body?.error.code ?? "SEARCH_UNAVAILABLE");
          return;
        }
        setResults((await response.json()) as SearchResult[]);
      } catch (requestError) {
        if (requestError instanceof DOMException && requestError.name === "AbortError") return;
        setResults([]);
        setError("SEARCH_UNAVAILABLE");
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }, SEARCH_DEBOUNCE_MS);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query]);

  // Reset active index when results change
  useEffect(() => {
    setActiveIndex(-1);
  }, [results]);

  return { query, setQuery, results, loading, error, activeIndex, setActiveIndex };
}
