import { Suspense } from "react";
import { notFound } from "next/navigation";
import { CategoryHeader } from "@/components/feed/CategoryHeader";
import { FeedPostList } from "@/components/feed/FeedPostList";
import { BlogJsonLd, BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { getListedPosts } from "@/lib/notion/contentCatalog";
import { filterPostsByCategory } from "@/lib/notion/contentQueries";
import { getFeedData } from "@/lib/notion/getFeedData";
import { createListingMetadata } from "@/lib/listingMetadata";
import { brand, getCategoryBySlug } from "@/config/brand";
import { copy } from "@/config/copy";
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
  return createListingMetadata({
    title: cat.name,
    socialTitle: `${cat.name} — ${brand.name}`,
    description,
    url: categoryUrl,
  });
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

  const allPosts = await getListedPosts();
  const posts = filterPostsByCategory(allPosts, cat.name);
  const { tags, authorsMap } = await getFeedData(posts);

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
