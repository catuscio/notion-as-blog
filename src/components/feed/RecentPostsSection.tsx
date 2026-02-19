"use client";

import { useSearchParams } from "next/navigation";
import { PostList } from "./PostList";
import { TagSidebar, MobileTagBar } from "./TagSidebar";
import { SearchInput } from "@/components/common/SearchInput";
import { Pagination } from "@/components/common/Pagination";
import { useFeedPagination } from "@/hooks/useFeedPagination";
import { brand } from "@/config/brand";
import type { TPost, TTagItem } from "@/types";

export function RecentPostsSection({
  posts,
  tags,
}: {
  posts: TPost[];
  tags: TTagItem[];
}) {
  const searchParams = useSearchParams();
  const authorFilter = searchParams.get("author");

  const {
    activeTag,
    filteredPosts,
    paginatedPosts,
    currentPage,
  } = useFeedPagination({ posts, authorFilter });

  function handleTagClick(tag: string | null) {
    const url = new URL(window.location.href);
    if (tag) {
      url.searchParams.set("tag", tag);
    } else {
      url.searchParams.delete("tag");
    }
    url.searchParams.delete("page");
    window.history.pushState({}, "", url.toString());
    window.dispatchEvent(new PopStateEvent("popstate"));
  }

  return (
    <section className="max-w-[1024px] mx-auto px-6 mt-12 mb-24">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
        <h2 className="text-2xl font-bold shrink-0">
          Recent Posts
          {authorFilter && (
            <span className="text-primary ml-2 text-lg font-medium">
              by {authorFilter}
            </span>
          )}
          {activeTag && (
            <span className="text-primary ml-2 text-lg font-medium">
              / {activeTag}
            </span>
          )}
        </h2>
        <div className="w-full sm:w-64">
          <SearchInput />
        </div>
      </div>

      <MobileTagBar
        tags={tags}
        activeTag={activeTag}
        onTagClick={handleTagClick}
      />

      <div className="flex gap-10 mt-8 lg:mt-0">
        <div className="flex-1 min-w-0">
          <PostList posts={paginatedPosts} />
          <Pagination
            totalItems={filteredPosts.length}
            itemsPerPage={brand.postsPerPage}
            currentPage={currentPage}
          />
        </div>
        <TagSidebar
          tags={tags}
          activeTag={activeTag}
          onTagClick={handleTagClick}
        />
      </div>
    </section>
  );
}
