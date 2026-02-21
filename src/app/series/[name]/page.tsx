import { Suspense } from "react";
import { SeriesHeader } from "@/components/feed/SeriesHeader";
import { FeedPostList } from "@/components/feed/FeedPostList";
import { BreadcrumbJsonLd, SeriesJsonLd } from "@/components/seo/JsonLd";
import { getPublishedPosts } from "@/lib/notion/getPosts";
import { getFeedPageData } from "@/lib/notion/getFeedPageData";
import { safeQuery } from "@/lib/notion/safeQuery";
import { brand } from "@/config/brand";
import { copy } from "@/config/copy";
import { safeDecode } from "@/lib/safeDecode";
import type { Post } from "@/types";
import type { Metadata } from "next";

type Props = {
  params: Promise<{ name: string }>;
};

function getSeriesPostsFromAll(allPosts: Post[], seriesName: string): Post[] {
  return allPosts
    .filter((p) => p.series === seriesName)
    .sort((a, b) => a.date.localeCompare(b.date));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { name } = await params;
  const decoded = safeDecode(name);
  const seriesUrl = `${brand.url}/series/${encodeURIComponent(decoded)}`;

  const allPosts = await safeQuery(getPublishedPosts, []);
  const posts = getSeriesPostsFromAll(allPosts, decoded);
  const description = copy.series.description(decoded, brand.name, posts.length);

  return {
    title: `${decoded} — ${copy.series.label}`,
    description,
    alternates: {
      canonical: seriesUrl,
    },
    openGraph: {
      title: `${decoded} — ${copy.series.label} — ${brand.name}`,
      description,
      url: seriesUrl,
      siteName: brand.name,
      type: "website",
      images: [{ url: brand.assets.ogImage, width: brand.assets.ogWidth, height: brand.assets.ogHeight }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${decoded} — ${copy.series.label} — ${brand.name}`,
      description,
      images: [brand.assets.ogImage],
    },
    ...(posts.length < 2 && { robots: { index: false, follow: true } }),
  };
}

export async function generateStaticParams() {
  const posts = await safeQuery(getPublishedPosts, []);
  const seriesMap = new Map<string, number>();
  for (const post of posts) {
    if (post.series) {
      seriesMap.set(post.series, (seriesMap.get(post.series) ?? 0) + 1);
    }
  }
  return Array.from(seriesMap.entries())
    .filter(([, count]) => count >= 2)
    .map(([name]) => ({ name: encodeURIComponent(name) }));
}

export default async function SeriesPage({ params }: Props) {
  const { name } = await params;
  const decoded = safeDecode(name);

  const allPosts = await safeQuery<Post[]>(getPublishedPosts, []);
  const posts = getSeriesPostsFromAll(allPosts, decoded);
  const { tags, authorsMap } = await getFeedPageData(posts);

  const seriesUrl = `${brand.url}/series/${encodeURIComponent(decoded)}`;
  const description = copy.series.description(decoded, brand.name, posts.length);

  return (
    <div className="max-w-[1024px] mx-auto px-6 py-12">
      <SeriesJsonLd
        name={decoded}
        url={seriesUrl}
        description={description}
        posts={posts}
      />
      <BreadcrumbJsonLd items={[
        { name: copy.footer.home, url: brand.url },
        { name: decoded, url: seriesUrl },
      ]} />
      <SeriesHeader seriesName={decoded} />
      <Suspense>
        <FeedPostList posts={posts} tags={tags} authorsMap={authorsMap} />
      </Suspense>
    </div>
  );
}
