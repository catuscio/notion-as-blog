"use client";

import { FeedPostCard } from "./FeedPostCard";
import { TagFilter } from "./TagFilter";
import { Pagination } from "@/components/common/Pagination";
import { useFeedPagination } from "@/hooks/useFeedPagination";
import { brand } from "@/config/brand";
import type { TPost, AuthorSummary } from "@/types";
import { resolveAuthor } from "@/lib/resolveAuthor";

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
    filteredPosts,
    paginatedPosts,
    currentPage,
  } = useFeedPagination({ posts });

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
    <>
      {tags.length > 0 && (
        <TagFilter tags={tags} activeTag={activeTag} onTagClick={handleTagClick} />
      )}
      <section className="flex flex-col gap-6 mt-8">
        {paginatedPosts.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <p className="text-lg">No posts match this filter.</p>
          </div>
        ) : (
          paginatedPosts.map((post) => (
            <FeedPostCard
              key={post.id}
              post={post}
              author={
                authorsMap
                  ? resolveAuthor(post.authorIds, post.author, authorsMap)
                  : undefined
              }
            />
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
