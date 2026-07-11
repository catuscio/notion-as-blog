import { Suspense } from "react";
import { SeriesHeader } from "@/components/feed/SeriesHeader";
import { FeedPostList } from "@/components/feed/FeedPostList";
import { BreadcrumbJsonLd, SeriesJsonLd } from "@/components/seo/JsonLd";
import { getListedPosts } from "@/lib/notion/contentCatalog";
import { getFeedData } from "@/lib/notion/getFeedData";
import { brand } from "@/config/brand";
import { copy } from "@/config/copy";
import { safeDecode } from "@/lib/safeDecode";
import { createListingMetadata } from "@/lib/listingMetadata";
import type { ContentItem } from "@/types";
import type { Metadata } from "next";

type Props = {
  params: Promise<{ name: string }>;
};

// Series names come from Notion content and can be very long. Avoid build-time
// static prerender output paths exceeding filesystem filename limits.
export const dynamic = "force-dynamic";

function selectSeriesPosts(allPosts: ContentItem[], seriesName: string): ContentItem[] {
  return allPosts
    .filter((p) => p.series === seriesName)
    .sort((a, b) => a.date.localeCompare(b.date));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { name } = await params;
  const decoded = safeDecode(name);
  const seriesUrl = `${brand.url}/series/${encodeURIComponent(decoded)}`;

  const allPosts = await getListedPosts();
  const posts = selectSeriesPosts(allPosts, decoded);
  const description = copy.series.description(decoded, brand.name, posts.length);

  return createListingMetadata({
    title: `${decoded} — ${copy.series.label}`,
    socialTitle: `${decoded} — ${copy.series.label} — ${brand.name}`,
    description,
    url: seriesUrl,
    robots: posts.length < 2 ? { index: false, follow: true } : undefined,
  });
}


export default async function SeriesPage({ params }: Props) {
  const { name } = await params;
  const decoded = safeDecode(name);

  const allPosts = await getListedPosts();
  const posts = selectSeriesPosts(allPosts, decoded);
  const { tags, authorsMap } = await getFeedData(posts);

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
