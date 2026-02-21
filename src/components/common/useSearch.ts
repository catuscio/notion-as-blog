"use client";

import { useState, useEffect, useCallback } from "react";
import type { Post } from "@/types";

const SEARCH_API = "/api/search";
const SEARCH_DEBOUNCE_MS = 300;

export function useSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const fetchResults = useCallback(async (q: string) => {
    if (q.trim().length < 2) {
      setResults([]);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${SEARCH_API}?q=${encodeURIComponent(q.trim())}`);
      if (res.ok) {
        setResults(await res.json());
      } else {
        setResults([]);
      }
    } catch {
      setResults([]);
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

  return { query, setQuery, results, loading, activeIndex, setActiveIndex };
}
