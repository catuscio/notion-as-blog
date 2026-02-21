"use client";

import { useMemo, useCallback } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { brand } from "@/config/brand";
import type { Post } from "@/types";

export function useFeedPagination(posts: Post[]) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentPage = Math.max(1, Number(searchParams.get("page")) || 1);
  const activeTag = searchParams.get("tag");

  const setActiveTag = useCallback(
    (tag: string | null) => {
      const params = new URLSearchParams(searchParams.toString());
      if (tag) {
        params.set("tag", tag);
      } else {
        params.delete("tag");
      }
      params.delete("page");
      const qs = params.toString();
      router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [router, pathname, searchParams]
  );

  const filteredPosts = useMemo(() => {
    if (!activeTag) return posts;
    return posts.filter((post) => (post.tags ?? []).includes(activeTag));
  }, [posts, activeTag]);

  const paginatedPosts = useMemo(() => {
    const start = (currentPage - 1) * brand.postsPerPage;
    return filteredPosts.slice(start, start + brand.postsPerPage);
  }, [filteredPosts, currentPage]);

  return { activeTag, setActiveTag, filteredPosts, paginatedPosts, currentPage };
}
