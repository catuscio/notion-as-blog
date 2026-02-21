"use client";

import { FeedPostCard } from "./FeedPostCard";
import { TagFilter } from "./TagFilter";
import { Pagination } from "@/components/common/Pagination";
import { EmptyState } from "@/components/common/EmptyState";
import { brand } from "@/config/brand";
import { copy } from "@/config/copy";
import { resolveAuthor } from "@/lib/resolveAuthor";
import { useFeedPagination } from "@/hooks/useFeedPagination";
import type { Post, AuthorSummary } from "@/types";

export function FeedPostList({
  posts,
  tags,
  authorsMap,
  asLinks,
  allHref,
  initialTag,
}: {
  posts: Post[];
  tags: string[];
  authorsMap?: Record<string, AuthorSummary>;
  asLinks?: boolean;
  allHref?: string;
  initialTag?: string;
}) {
  const {
    activeTag,
    setActiveTag,
    filteredPosts,
    paginatedPosts,
    currentPage,
  } = useFeedPagination(posts);

  const displayTag = asLinks ? (initialTag ?? null) : activeTag;

  return (
    <>
      {tags.length > 0 && (
        <TagFilter
          tags={tags}
          activeTag={displayTag}
          onTagClick={setActiveTag}
          asLinks={asLinks}
          allHref={allHref}
        />
      )}
      <section className="flex flex-col gap-6 mt-8">
        {paginatedPosts.length === 0 ? (
          <EmptyState message={copy.noPostsFilter} />
        ) : (
          paginatedPosts.map((post) => (
            <FeedPostCard key={post.id} post={post} author={resolveAuthor(post, authorsMap)} />
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
