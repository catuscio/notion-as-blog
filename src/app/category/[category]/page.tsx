import { Suspense } from "react";
import { CategoryHeader } from "@/components/feed/CategoryHeader";
import { FeedPostList } from "@/components/feed/FeedPostList";
import { BlogJsonLd } from "@/components/seo/JsonLd";
import { getPostsByCategory } from "@/lib/notion/getPost";
import { getFeedPageData } from "@/lib/notion/getFeedPageData";
import { safeQuery } from "@/lib/notion/safeQuery";
import { brand, getCategoryBySlug } from "@/config/brand";
import type { Metadata } from "next";

type Props = {
  params: Promise<{ category: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  const decoded = decodeURIComponent(category);
  const categoryUrl = `${brand.url}/category/${encodeURIComponent(decoded)}`;
  const catConfig = getCategoryBySlug(decoded);
  return {
    title: `${decoded} — ${brand.name}`,
    description: catConfig?.description || `Browse ${decoded} articles on ${brand.name}`,
    alternates: {
      canonical: categoryUrl,
    },
    openGraph: {
      title: `${decoded} — ${brand.name}`,
      description: catConfig?.description || `Browse ${decoded} articles on ${brand.name}`,
      url: categoryUrl,
      siteName: brand.name,
      type: "website",
    },
  };
}

export async function generateStaticParams() {
  return brand.categories.map((cat) => ({
    category: encodeURIComponent(cat.name),
  }));
}

export default async function CategoryPage({ params }: Props) {
  const { category } = await params;
  const decoded = decodeURIComponent(category);

  const posts = await safeQuery(() => getPostsByCategory(decoded), []);
  const { tags, authorsMap } = await getFeedPageData(posts);

  const categoryUrl = `${brand.url}/category/${encodeURIComponent(decoded)}`;
  const catConfig = getCategoryBySlug(decoded);

  return (
    <div className="max-w-[1024px] mx-auto px-6 py-12">
      <BlogJsonLd
        name={`${decoded} — ${brand.name}`}
        description={catConfig?.description || `${decoded} articles`}
        url={categoryUrl}
      />
      <CategoryHeader categoryName={decoded} />
      <Suspense>
        <FeedPostList posts={posts} tags={tags} authorsMap={authorsMap} />
      </Suspense>
    </div>
  );
}
