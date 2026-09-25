import { PostList } from "./PostList";
import { TagSidebar, MobileTagBar } from "./TagSidebar";
import { PaginationNav } from "@/components/common/PaginationNav";
import { SearchInputLoader } from "@/components/common/SearchInputLoader";
import { brand } from "@/config/brand";
import { copy } from "@/config/copy";
import type { ContentItem, TagItem } from "@/types";

export function RecentPostsSection({
  posts,
  tags,
  currentPage = 1,
  prioritizeFirstImage = true,
}: {
  posts: ContentItem[];
  tags: TagItem[];
  currentPage?: number;
  prioritizeFirstImage?: boolean;
}) {
  const start = (currentPage - 1) * brand.postsPerPage;
  const paginatedPosts = posts.slice(start, start + brand.postsPerPage);

  return (
    <section className="sg-content-limiter mb-24 mt-12">
      <div className="sg-cluster mb-10 justify-between [--cluster-gap:var(--space-4)]">
        <h2 className="text-2xl font-bold shrink-0">{copy.recentPosts}</h2>
        <div className="w-full sm:w-64">
          <SearchInputLoader />
        </div>
      </div>

      <MobileTagBar tags={tags} totalCount={posts.length} />

      <div className="sg-sticky-aside mt-8 lg:mt-0">
        <div className="sg-sticky-aside-main">
          <PostList posts={paginatedPosts} prioritizeFirstImage={prioritizeFirstImage} />
          <PaginationNav
            totalItems={posts.length}
            itemsPerPage={brand.postsPerPage}
            currentPage={currentPage}
          />
        </div>
        <TagSidebar tags={tags} totalCount={posts.length} />
      </div>
    </section>
  );
}
