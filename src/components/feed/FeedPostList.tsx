"use client";

import { PostCard } from "./PostCard";
import { TagFilter } from "./TagFilter";
import { QueryPagination } from "@/components/common/QueryPagination";
import { EmptyState } from "@/components/common/EmptyState";
import { brand } from "@/config/brand";
import { copy } from "@/config/copy";
import { resolveAuthors } from "@/lib/resolveAuthors";
import { useFeedPagination } from "@/hooks/useFeedPagination";
import type { ContentItem, AuthorSummary } from "@/types";

export function FeedPostList({
  posts,
  tags,
  authorsMap,
  asLinks,
  allHref,
  initialTag,
}: {
  posts: ContentItem[];
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
      <section className="flex flex-col mt-4">
        {paginatedPosts.length === 0 ? (
          <EmptyState message={copy.noPostsFilter} />
        ) : (
          paginatedPosts.map((post) => (
            <PostCard key={post.id} post={post} authors={resolveAuthors(post, authorsMap)} />
          ))
        )}
      </section>
      <QueryPagination
        totalItems={filteredPosts.length}
        itemsPerPage={brand.postsPerPage}
        currentPage={currentPage}
      />
    </>
  );
}
