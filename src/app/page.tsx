import { Suspense, type ReactNode } from "react";
import { RecentPostsSection } from "@/components/feed/RecentPostsSection";
import { NewsletterCTA } from "@/components/feed/NewsletterCTA";
import { BlogJsonLd } from "@/components/seo/JsonLd";
import { getListedPosts } from "@/lib/notion/getPosts";
import { getAllTags } from "@/lib/notion/getAllSelectItems";
import { safeQuery } from "@/lib/notion/safeQuery";
import { brand } from "@/config/brand";
import type { Post } from "@/types";

export default async function HomePage() {
  const posts = await safeQuery<Post[]>(getListedPosts, []);
  const tags = getAllTags(posts);
  const pinnedPosts = posts.filter((p) => p.pinned);
  const hasPinnedPosts = pinnedPosts.length > 0;
  let leadContent: ReactNode;
  if (hasPinnedPosts) {
    const { FeaturedSlideshow } = await import("@/components/feed/FeaturedSlideshow");
    leadContent = (
      <>
        <h1 className="sr-only">{`${brand.name} — ${brand.title}`}</h1>
        <FeaturedSlideshow posts={pinnedPosts} />
      </>
    );
  } else {
    const { HeroSection } = await import("@/components/feed/HeroSection");
    leadContent = <HeroSection />;
  }

  return (
    <div className="pt-12 pb-20">
      <BlogJsonLd url={brand.url} name={brand.title} description={brand.description} />
      {leadContent}
      <Suspense>
        <RecentPostsSection
          posts={posts}
          tags={tags}
          prioritizeFirstImage={!hasPinnedPosts}
        />
      </Suspense>
      <NewsletterCTA />
    </div>
  );
}
