"use client";

import { PostList } from "./PostList";
import { TagSidebar, MobileTagBar } from "./TagSidebar";
import { SearchInput } from "@/components/common/SearchInput";
import { Pagination } from "@/components/common/Pagination";
import { brand } from "@/config/brand";
import { copy } from "@/config/copy";
import { useFeedPagination } from "@/hooks/useFeedPagination";
import type { Post, TagItem } from "@/types";

export function RecentPostsSection({
  posts,
  tags,
}: {
  posts: Post[];
  tags: TagItem[];
}) {
  const {
    activeTag,
    setActiveTag,
    filteredPosts,
    paginatedPosts,
    currentPage,
  } = useFeedPagination(posts);

  return (
    <section className="max-w-[1024px] mx-auto px-6 mt-12 mb-24">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
        <h2 className="text-2xl font-bold shrink-0">
          {copy.recentPosts}
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
        totalCount={posts.length}
        activeTag={activeTag}
        onTagClick={setActiveTag}
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
          totalCount={posts.length}
          activeTag={activeTag}
          onTagClick={setActiveTag}
        />
      </div>
    </section>
  );
}
