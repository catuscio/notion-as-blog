import { Suspense } from "react";
import { SeriesHeader } from "@/components/feed/SeriesHeader";
import { FeedPostList } from "@/components/feed/FeedPostList";
import { BreadcrumbJsonLd, SeriesJsonLd } from "@/components/seo/JsonLd";
import { getListedPosts } from "@/lib/notion/getPosts";
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

// Series names come from Notion content and can be very long. Avoid build-time
// static prerender output paths exceeding filesystem filename limits.
export const dynamic = "force-dynamic";

function getSeriesPostsFromAll(allPosts: Post[], seriesName: string): Post[] {
  return allPosts
    .filter((p) => p.series === seriesName)
    .sort((a, b) => a.date.localeCompare(b.date));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { name } = await params;
  const decoded = safeDecode(name);
  const seriesUrl = `${brand.url}/series/${encodeURIComponent(decoded)}`;

  const allPosts = await safeQuery(getListedPosts, []);
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


export default async function SeriesPage({ params }: Props) {
  const { name } = await params;
  const decoded = safeDecode(name);

  const allPosts = await safeQuery<Post[]>(getListedPosts, []);
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
