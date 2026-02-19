import { Suspense } from "react";
import { TagHeader } from "@/components/feed/TagHeader";
import { FeedPostList } from "@/components/feed/FeedPostList";
import { BlogJsonLd, BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { getPublishedPosts } from "@/lib/notion/getPosts";
import { getAllTags } from "@/lib/notion/getAllSelectItems";
import { getFeedPageData } from "@/lib/notion/getFeedPageData";
import { safeQuery } from "@/lib/notion/safeQuery";
import { brand } from "@/config/brand";
import type { Metadata } from "next";

type Props = {
  params: Promise<{ tag: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { tag } = await params;
  const decoded = decodeURIComponent(tag);
  const tagUrl = `${brand.url}/tag/${encodeURIComponent(decoded)}`;

  const posts = await safeQuery(() => getPublishedPosts(), []);
  const count = posts.filter((p) => p.tags.includes(decoded)).length;

  return {
    title: `#${decoded} — ${brand.name}`,
    description: `Browse ${count} articles tagged with "${decoded}" on ${brand.name}`,
    alternates: { canonical: tagUrl },
    openGraph: {
      title: `#${decoded} — ${brand.name}`,
      description: `Browse articles tagged with "${decoded}"`,
      url: tagUrl,
      siteName: brand.name,
      type: "website",
    },
    twitter: { card: "summary_large_image" },
    ...(count <= 2 && { robots: { index: false, follow: true } }),
  };
}

export async function generateStaticParams() {
  try {
    const posts = await getPublishedPosts();
    const tags = getAllTags(posts);
    return tags
      .filter((t) => t.count > 2)
      .map((t) => ({ tag: encodeURIComponent(t.name) }));
  } catch {
    return [];
  }
}

export default async function TagPage({ params }: Props) {
  const { tag } = await params;
  const decoded = decodeURIComponent(tag);

  const allPosts = await safeQuery(() => getPublishedPosts(), []);
  const posts = allPosts.filter((p) => p.tags.includes(decoded));
  const { tags, authorsMap } = await getFeedPageData(posts);

  const tagUrl = `${brand.url}/tag/${encodeURIComponent(decoded)}`;

  return (
    <div className="max-w-[1024px] mx-auto px-6 py-12">
      <BlogJsonLd
        name={`#${decoded} — ${brand.name}`}
        description={`Articles tagged with "${decoded}"`}
        url={tagUrl}
      />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: brand.url },
          { name: `#${decoded}`, url: tagUrl },
        ]}
      />
      <TagHeader tagName={decoded} postCount={posts.length} />
      <Suspense>
        <FeedPostList posts={posts} tags={tags} authorsMap={authorsMap} />
      </Suspense>
    </div>
  );
}
