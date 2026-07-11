"use client";

import { useState, useEffect, useCallback } from "react";
import type { ContentItem } from "@/types";

const SEARCH_API = "/api/search";
const SEARCH_DEBOUNCE_MS = 300;

export function useSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const fetchResults = useCallback(async (q: string) => {
    if (q.trim().length < 2) {
      setResults([]);
      setError(false);
      return;
    }
    setLoading(true);
    setError(false);
    try {
      const res = await fetch(`${SEARCH_API}?q=${encodeURIComponent(q.trim())}`);
      if (!res.ok) {
        throw new Error(`Search request failed with status ${res.status}`);
      }
      setResults(await res.json());
    } catch {
      setResults([]);
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => fetchResults(query), SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [query, fetchResults]);

  // Reset active index when results change
  useEffect(() => {
    setActiveIndex(-1);
  }, [results]);

  return { query, setQuery, results, loading, error, activeIndex, setActiveIndex };
}
