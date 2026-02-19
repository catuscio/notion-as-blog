import { Suspense } from "react";
import { HeroSection } from "@/components/feed/HeroSection";
import { FeaturedSlideshow } from "@/components/feed/FeaturedSlideshow";
import { RecentPostsSection } from "@/components/feed/RecentPostsSection";
import { NewsletterCTA } from "@/components/feed/NewsletterCTA";
import { BlogJsonLd } from "@/components/seo/JsonLd";
import { getPublishedPosts } from "@/lib/notion/getPosts";
import { getAllTags } from "@/lib/notion/getAllSelectItems";
import { safeQuery } from "@/lib/notion/safeQuery";
import { brand } from "@/config/brand";

export default async function HomePage() {
  const posts = await safeQuery(() => getPublishedPosts(), []);

  const tags = getAllTags(posts);
  const pinnedPosts = posts.filter((p) => p.pinned);

  return (
    <div className="pt-12 pb-20">
      <BlogJsonLd
        name={brand.name}
        description={brand.description}
        url={brand.url}
      />
      {pinnedPosts.length > 0 ? (
        <>
          <h1 className="sr-only">{`${brand.name} — ${brand.title}`}</h1>
          <FeaturedSlideshow posts={pinnedPosts} />
        </>
      ) : (
        <HeroSection />
      )}
      <Suspense>
        <RecentPostsSection posts={posts} tags={tags} />
      </Suspense>
      <NewsletterCTA />
    </div>
  );
}
