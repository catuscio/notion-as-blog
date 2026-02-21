import { Suspense } from "react";
import { TagHeader } from "@/components/feed/TagHeader";
import { FeedPostList } from "@/components/feed/FeedPostList";
import { BlogJsonLd, BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { getPublishedPosts } from "@/lib/notion/getPosts";
import { getAllTags } from "@/lib/notion/getAllSelectItems";
import { getFeedPageData } from "@/lib/notion/getFeedPageData";
import { safeQuery } from "@/lib/notion/safeQuery";
import { brand } from "@/config/brand";
import { copy } from "@/config/copy";
import { safeDecode } from "@/lib/safeDecode";
import type { Post } from "@/types";
import type { Metadata } from "next";

type Props = {
  params: Promise<{ tag: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { tag } = await params;
  const decoded = safeDecode(tag);
  const tagUrl = `${brand.url}/tag/${encodeURIComponent(decoded)}`;

  const allPosts = await safeQuery(getPublishedPosts, []);
  const count = allPosts.filter((p) => p.tags.includes(decoded)).length;
  const description = copy.tag.description(brand.name, decoded, count);

  return {
    title: `#${decoded}`,
    description,
    alternates: {
      canonical: tagUrl,
    },
    openGraph: {
      title: `#${decoded} — ${brand.name}`,
      description,
      url: tagUrl,
      siteName: brand.name,
      type: "website",
      images: [{ url: brand.assets.ogImage, width: brand.assets.ogWidth, height: brand.assets.ogHeight }],
    },
    twitter: {
      card: "summary_large_image",
      title: `#${decoded} — ${brand.name}`,
      description,
      images: [brand.assets.ogImage],
    },
    ...(count <= 2 && { robots: { index: false, follow: true } }),
  };
}

export async function generateStaticParams() {
  const posts = await safeQuery(getPublishedPosts, []);
  const tags = getAllTags(posts);
  return tags
    .filter((t) => posts.filter((p) => p.tags.includes(t.name)).length > 2)
    .map((t) => ({ tag: encodeURIComponent(t.name) }));
}

export default async function TagPage({ params }: Props) {
  const { tag } = await params;
  const decoded = safeDecode(tag);

  const allPosts = await safeQuery<Post[]>(getPublishedPosts, []);
  const posts = allPosts.filter((post) => post.tags.includes(decoded));
  const { tags, authorsMap } = await getFeedPageData(allPosts);

  const tagUrl = `${brand.url}/tag/${encodeURIComponent(decoded)}`;
  const description = copy.tag.description(brand.name, decoded, posts.length);

  return (
    <div className="max-w-[1024px] mx-auto px-6 py-12">
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
