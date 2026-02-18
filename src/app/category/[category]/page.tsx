import { Suspense } from "react";
import { CategoryHeader } from "@/components/feed/CategoryHeader";
import { FeedPostList } from "@/components/feed/FeedPostList";
import { getPostsByCategory } from "@/lib/notion/getPost";
import { getAllTags } from "@/lib/notion/getAllSelectItems";
import { getAllAuthors } from "@/lib/notion/getAuthors";
import { brand } from "@/config/brand";
import type { Metadata } from "next";

type Props = {
  params: Promise<{ category: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  const decoded = decodeURIComponent(category);
  const categoryUrl = `${brand.url}/category/${encodeURIComponent(decoded)}`;
  return {
    title: `${decoded} — ${brand.name}`,
    description: `Browse ${decoded} articles on ${brand.name}`,
    alternates: {
      canonical: categoryUrl,
    },
    openGraph: {
      title: `${decoded} — ${brand.name}`,
      description: `Browse ${decoded} articles on ${brand.name}`,
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

  let posts: Awaited<ReturnType<typeof getPostsByCategory>> = [];
  try {
    posts = await getPostsByCategory(decoded);
  } catch {
    // Notion unavailable
  }

  const tags = getAllTags(posts).map((t) => t.name);

  let authorsMap: Record<string, { avatar: string; name: string }> = {};
  try {
    const authors = await getAllAuthors();
    authorsMap = Object.fromEntries(
      authors.map((a) => [a.name, { avatar: a.avatar, name: a.name }])
    );
  } catch {
    // Authors DB unavailable
  }

  return (
    <div className="max-w-[1024px] mx-auto px-6 py-12">
      <CategoryHeader categoryName={decoded} />
      <Suspense>
        <FeedPostList posts={posts} tags={tags} authorsMap={authorsMap} />
      </Suspense>
    </div>
  );
}
