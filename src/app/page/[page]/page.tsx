import { notFound } from "next/navigation";
import { RecentPostsSection } from "@/components/feed/RecentPostsSection";
import { BlogJsonLd, BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { getListedPosts } from "@/lib/notion/getPosts";
import { getAllTags } from "@/lib/notion/getAllSelectItems";
import { safeQuery } from "@/lib/notion/safeQuery";
import { brand } from "@/config/brand";
import { copy } from "@/config/copy";
import type { Post } from "@/types";
import type { Metadata } from "next";

export const revalidate = 1800;

type Props = {
  params: Promise<{ page: string }>;
};

function parsePage(value: string) {
  const page = Number(value);
  return Number.isInteger(page) && page > 1 ? page : null;
}

async function getPageCount() {
  const posts = await safeQuery<Post[]>(getListedPosts, []);
  return {
    posts,
    totalPages: Math.max(1, Math.ceil(posts.length / brand.postsPerPage)),
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { page: pageParam } = await params;
  const page = parsePage(pageParam);
  if (!page) return { title: copy.notFound.title };

  const url = `${brand.url}/page/${page}`;

  return {
    title: `${copy.recentPosts} ${page}`,
    description: brand.description,
    alternates: {
      canonical: url,
    },
    robots: {
      index: false,
      follow: true,
    },
    openGraph: {
      title: `${copy.recentPosts} ${page} — ${brand.name}`,
      description: brand.description,
      url,
      siteName: brand.name,
      type: "website",
      images: [{ url: brand.assets.ogImage, width: brand.assets.ogWidth, height: brand.assets.ogHeight }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${copy.recentPosts} ${page} — ${brand.name}`,
      description: brand.description,
      images: [brand.assets.ogImage],
    },
  };
}

export async function generateStaticParams() {
  const { totalPages } = await getPageCount();
  return Array.from({ length: Math.max(0, totalPages - 1) }, (_, i) => ({
    page: String(i + 2),
  }));
}

export default async function PaginatedPostsPage({ params }: Props) {
  const { page: pageParam } = await params;
  const page = parsePage(pageParam);
  if (!page) notFound();

  const { posts, totalPages } = await getPageCount();
  if (page > totalPages) notFound();

  const tags = getAllTags(posts);
  const url = `${brand.url}/page/${page}`;

  return (
    <div className="pt-12 pb-20">
      <BlogJsonLd url={url} name={`${copy.recentPosts} ${page} — ${brand.name}`} description={brand.description} />
      <BreadcrumbJsonLd items={[
        { name: copy.footer.home, url: brand.url },
        { name: `${copy.recentPosts} ${page}`, url },
      ]} />
      <h1 className="sr-only">{`${copy.recentPosts} ${page} — ${brand.name}`}</h1>
      <RecentPostsSection posts={posts} tags={tags} currentPage={page} />
    </div>
  );
}
