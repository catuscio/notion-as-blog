import { Suspense } from "react";
import { notFound } from "next/navigation";
import { AuthorHeader } from "@/components/feed/AuthorHeader";
import { FeedPostList } from "@/components/feed/FeedPostList";
import { PersonJsonLd, BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { getPublishedPosts } from "@/lib/notion/getPosts";
import { getAllAuthors } from "@/lib/notion/getAuthors";
import { getFeedPageData } from "@/lib/notion/getFeedPageData";
import { filterPostsByAuthor } from "@/lib/notion/filterPosts";
import { safeQuery } from "@/lib/notion/safeQuery";
import { brand } from "@/config/brand";
import { copy } from "@/config/copy";
import { safeDecode } from "@/lib/safeDecode";
import type { Post } from "@/types";
import type { Metadata } from "next";

type Props = {
  params: Promise<{ name: string }>;
};

async function resolveAuthor(name: string) {
  const decoded = safeDecode(name);
  const authors = await safeQuery(getAllAuthors, []);
  return authors.find((a) => a.name === decoded) ?? null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { name } = await params;
  const author = await resolveAuthor(name);
  if (!author) return { title: copy.notFound.title };

  const allPosts = await safeQuery(getPublishedPosts, []);
  const count = filterPostsByAuthor(allPosts, author.peopleIds).length;

  const authorUrl = `${brand.url}/author/${encodeURIComponent(author.name)}`;
  const description = author.bio || copy.author.descriptionFallback(brand.name, author.name);

  return {
    title: author.name,
    description,
    alternates: {
      canonical: authorUrl,
    },
    openGraph: {
      title: `${author.name} — ${brand.name}`,
      description,
      url: authorUrl,
      siteName: brand.name,
      type: "profile",
      images: [{ url: brand.assets.ogImage, width: brand.assets.ogWidth, height: brand.assets.ogHeight }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${author.name} — ${brand.name}`,
      description,
      images: [brand.assets.ogImage],
    },
    ...(count <= 2 && { robots: { index: false, follow: true } }),
  };
}

export async function generateStaticParams() {
  const authors = await safeQuery(getAllAuthors, []);
  return authors.map((a) => ({ name: encodeURIComponent(a.name) }));
}

export default async function AuthorPage({ params }: Props) {
  const { name } = await params;
  const author = await resolveAuthor(name);
  if (!author) notFound();

  const allPosts = await safeQuery<Post[]>(getPublishedPosts, []);
  const posts = filterPostsByAuthor(allPosts, author.peopleIds);
  const { tags, authorsMap } = await getFeedPageData(posts);

  const authorUrl = `${brand.url}/author/${encodeURIComponent(author.name)}`;
  const sameAs = Object.values(author.socials).filter(Boolean) as string[];

  return (
    <div className="max-w-[1024px] mx-auto px-6 py-12">
      <PersonJsonLd
        name={author.name}
        url={authorUrl}
        image={author.avatar || undefined}
        jobTitle={author.role || undefined}
        description={author.bio || undefined}
        sameAs={sameAs}
      />
      <BreadcrumbJsonLd items={[
        { name: copy.footer.home, url: brand.url },
        { name: author.name, url: authorUrl },
      ]} />
      <AuthorHeader author={author} />
      <Suspense>
        <FeedPostList posts={posts} tags={tags} authorsMap={authorsMap} />
      </Suspense>
    </div>
  );
}
