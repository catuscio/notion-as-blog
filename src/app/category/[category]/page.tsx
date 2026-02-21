import { Suspense } from "react";
import { notFound } from "next/navigation";
import { CategoryHeader } from "@/components/feed/CategoryHeader";
import { FeedPostList } from "@/components/feed/FeedPostList";
import { BlogJsonLd, BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { getPublishedPosts } from "@/lib/notion/getPosts";
import { filterPostsByCategory } from "@/lib/notion/filterPosts";
import { getFeedPageData } from "@/lib/notion/getFeedPageData";
import { safeQuery } from "@/lib/notion/safeQuery";
import { brand, getCategoryBySlug } from "@/config/brand";
import { copy } from "@/config/copy";
import type { Post } from "@/types";
import type { Metadata } from "next";

type Props = {
  params: Promise<{ category: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  const cat = getCategoryBySlug(category);
  if (!cat) return { title: copy.notFound.title };

  const categoryUrl = `${brand.url}/category/${cat.slug}`;
  const description = cat.description;
  return {
    title: cat.name,
    description,
    alternates: {
      canonical: categoryUrl,
    },
    openGraph: {
      title: `${cat.name} — ${brand.name}`,
      description,
      url: categoryUrl,
      siteName: brand.name,
      type: "website",
      images: [{ url: brand.assets.ogImage, width: brand.assets.ogWidth, height: brand.assets.ogHeight }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${cat.name} — ${brand.name}`,
      description,
      images: [brand.assets.ogImage],
    },
  };
}

export async function generateStaticParams() {
  return brand.categories.map((cat) => ({
    category: cat.slug,
  }));
}

export default async function CategoryPage({ params }: Props) {
  const { category } = await params;
  const cat = getCategoryBySlug(category);
  if (!cat) notFound();

  const allPosts = await safeQuery<Post[]>(getPublishedPosts, []);
  const posts = filterPostsByCategory(allPosts, cat.name);
  const { tags, authorsMap } = await getFeedPageData(posts);

  const categoryUrl = `${brand.url}/category/${cat.slug}`;

  return (
    <div className="max-w-[1024px] mx-auto px-6 py-12">
      <BlogJsonLd url={categoryUrl} name={`${cat.name} — ${brand.name}`} description={cat.description} />
      <BreadcrumbJsonLd items={[
        { name: copy.footer.home, url: brand.url },
        { name: cat.name, url: categoryUrl },
      ]} />
      <CategoryHeader categoryName={cat.name} />
      <Suspense>
        <FeedPostList
          posts={posts}
          tags={tags}
          authorsMap={authorsMap}
          asLinks
          allHref={`/category/${cat.slug}`}
        />
      </Suspense>
    </div>
  );
}
