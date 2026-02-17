import { Suspense } from "react";
import { HeroSection } from "@/components/feed/HeroSection";
import { FeaturedSlideshow } from "@/components/feed/FeaturedSlideshow";
import { RecentPostsSection } from "@/components/feed/RecentPostsSection";
import { NewsletterCTA } from "@/components/feed/NewsletterCTA";
import { getAllPosts } from "@/lib/notion/getPosts";
import { getAllTags } from "@/lib/notion/getAllSelectItems";
export const revalidate = 3600;

export default async function HomePage() {
  let posts: Awaited<ReturnType<typeof getAllPosts>> = [];
  try {
    posts = await getAllPosts();
  } catch {
    // Notion unavailable — show empty state
  }

  const tags = getAllTags(posts);
  const pinnedPosts = posts.filter((p) => p.pinned);

  return (
    <div className="pt-12 pb-20">
      {pinnedPosts.length > 0 ? (
        <FeaturedSlideshow posts={pinnedPosts} />
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
