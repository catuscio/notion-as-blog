"use client";

import { useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { brand } from "@/config/brand";
import type { TPost } from "@/types";

interface UseFilteredPaginatedPostsOptions {
  posts: TPost[];
  authorFilter?: string | null;
}

export function useFilteredPaginatedPosts({
  posts,
  authorFilter,
}: UseFilteredPaginatedPostsOptions) {
  const searchParams = useSearchParams();
  const currentPage = Math.max(1, Number(searchParams.get("page")) || 1);
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const filteredPosts = useMemo(() => {
    let result = posts;
    if (authorFilter) {
      result = result.filter((post) => post.author === authorFilter);
    }
    if (activeTag) {
      result = result.filter((post) => post.tags.includes(activeTag));
    }
    return result;
  }, [posts, activeTag, authorFilter]);

  const paginatedPosts = useMemo(() => {
    const start = (currentPage - 1) * brand.postsPerPage;
    return filteredPosts.slice(start, start + brand.postsPerPage);
  }, [filteredPosts, currentPage]);

  return {
    activeTag,
    setActiveTag,
    filteredPosts,
    paginatedPosts,
    currentPage,
  };
}
