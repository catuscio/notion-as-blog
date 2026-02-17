"use client";

import { FeedPostCard } from "./FeedPostCard";
import type { AuthorSummary } from "./FeedPostCard";
import { TagFilter } from "./TagFilter";
import { Pagination } from "@/components/common/Pagination";
import { useFilteredPaginatedPosts } from "@/hooks/useFilteredPaginatedPosts";
import { brand } from "@/config/brand";
import type { TPost } from "@/types";

export function FeedPostList({
  posts,
  tags,
  authorsMap,
}: {
  posts: TPost[];
  tags: string[];
  authorsMap?: Record<string, AuthorSummary>;
}) {
  const {
    activeTag,
    setActiveTag,
    filteredPosts,
    paginatedPosts,
    currentPage,
  } = useFilteredPaginatedPosts({ posts });

  return (
    <>
      {tags.length > 0 && (
        <TagFilter tags={tags} activeTag={activeTag} onTagClick={setActiveTag} />
      )}
      <section className="flex flex-col gap-6 mt-8">
        {paginatedPosts.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <p className="text-lg">No posts match this filter.</p>
          </div>
        ) : (
          paginatedPosts.map((post) => (
            <FeedPostCard key={post.id} post={post} author={authorsMap?.[post.author]} />
          ))
        )}
      </section>
      <Pagination
        totalItems={filteredPosts.length}
        itemsPerPage={brand.postsPerPage}
        currentPage={currentPage}
      />
    </>
  );
}
