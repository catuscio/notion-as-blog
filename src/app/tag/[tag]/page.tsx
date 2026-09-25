import { Suspense } from "react";
import { TagHeader } from "@/components/feed/TagHeader";
import { FeedPostList } from "@/components/feed/FeedPostList";
import { BlogJsonLd, BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { getListedPosts } from "@/lib/notion/contentCatalog";
import { getVisibleTagCounts } from "@/lib/notion/getTagCounts";
import { getFeedData } from "@/lib/notion/getFeedData";
import { brand } from "@/config/brand";
import { copy } from "@/config/copy";
import { safeDecode } from "@/lib/safeDecode";
import { createListingMetadata } from "@/lib/listingMetadata";
import type { Metadata } from "next";

type Props = {
  params: Promise<{ tag: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { tag } = await params;
  const decoded = safeDecode(tag);
  const tagUrl = `${brand.url}/tag/${encodeURIComponent(decoded)}`;

  const allPosts = await getListedPosts();
  const count = allPosts.filter((p) => p.tags.includes(decoded)).length;
  const description = copy.tag.description(brand.name, decoded, count);

  return createListingMetadata({
    title: `#${decoded}`,
    socialTitle: `#${decoded} — ${brand.name}`,
    description,
    url: tagUrl,
    robots: count <= 2 ? { index: false, follow: true } : undefined,
  });
}

export async function generateStaticParams() {
  const posts = await getListedPosts();
  const tags = getVisibleTagCounts(posts);
  return tags
    .filter((t) => posts.filter((p) => p.tags.includes(t.name)).length > 2)
    .map((t) => ({ tag: encodeURIComponent(t.name) }));
}

export default async function TagPage({ params }: Props) {
  const { tag } = await params;
  const decoded = safeDecode(tag);

  const allPosts = await getListedPosts();
  const posts = allPosts.filter((post) => post.tags.includes(decoded));
  const { tags, authorsMap } = await getFeedData(allPosts);

  const tagUrl = `${brand.url}/tag/${encodeURIComponent(decoded)}`;
  const description = copy.tag.description(brand.name, decoded, posts.length);

  return (
    <div className="sg-content-limiter py-12">
      <BlogJsonLd url={tagUrl} name={`#${decoded} — ${brand.name}`} description={description} />
      <BreadcrumbJsonLd items={[
        { name: copy.footer.home, url: brand.url },
        { name: `#${decoded}`, url: tagUrl },
      ]} />
      <TagHeader tagName={decoded} />
      <Suspense>
        <FeedPostList
          posts={posts}
          tags={tags}
          authorsMap={authorsMap}
          asLinks
          allHref="/"
          initialTag={decoded}
        />
      </Suspense>
    </div>
  );
}
