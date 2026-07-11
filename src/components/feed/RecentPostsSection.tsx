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
    <section className="max-w-[1024px] mx-auto px-6 mt-12 mb-24">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
        <h2 className="text-2xl font-bold shrink-0">{copy.recentPosts}</h2>
        <div className="w-full sm:w-64">
          <SearchInputLoader />
        </div>
      </div>

      <MobileTagBar tags={tags} totalCount={posts.length} />

      <div className="flex gap-10 mt-8 lg:mt-0">
        <div className="flex-1 min-w-0">
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
