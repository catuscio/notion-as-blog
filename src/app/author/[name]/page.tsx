import { Suspense } from "react";
import { AuthorHeader } from "@/components/feed/AuthorHeader";
import { FeedPostList } from "@/components/feed/FeedPostList";
import { PersonJsonLd, BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { getPublishedPosts } from "@/lib/notion/getPosts";
import { getAllAuthors, getAuthorByName } from "@/lib/notion/getAuthors";
import { getFeedPageData } from "@/lib/notion/getFeedPageData";
import { safeQuery } from "@/lib/notion/safeQuery";
import { brand } from "@/config/brand";
import type { Metadata } from "next";

type Props = {
  params: Promise<{ name: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { name } = await params;
  const decoded = decodeURIComponent(name);
  const authorUrl = `${brand.url}/author/${encodeURIComponent(decoded)}`;

  const author = await safeQuery(() => getAuthorByName(decoded), null);
  const posts = await safeQuery(() => getPublishedPosts(), []);
  const count = posts.filter((p) => p.author === decoded).length;

  return {
    title: `${decoded} — ${brand.name}`,
    description: author?.bio || `Articles by ${decoded} on ${brand.name}`,
    alternates: { canonical: authorUrl },
    openGraph: {
      title: `${decoded} — ${brand.name}`,
      description: author?.bio || `Articles by ${decoded}`,
      url: authorUrl,
      siteName: brand.name,
      type: "profile",
    },
    twitter: { card: "summary_large_image" },
    ...(count <= 2 && { robots: { index: false, follow: true } }),
  };
}

export async function generateStaticParams() {
  try {
    const authors = await getAllAuthors();
    return authors.map((a) => ({ name: encodeURIComponent(a.name) }));
  } catch {
    return [];
  }
}

export default async function AuthorPage({ params }: Props) {
  const { name } = await params;
  const decoded = decodeURIComponent(name);

  const author = await safeQuery(() => getAuthorByName(decoded), null);
  const allPosts = await safeQuery(() => getPublishedPosts(), []);
  const posts = allPosts.filter((p) => p.author === decoded);
  const { tags, authorsMap } = await getFeedPageData(posts);

  const authorUrl = `${brand.url}/author/${encodeURIComponent(decoded)}`;

  return (
    <div className="max-w-[1024px] mx-auto px-6 py-12">
      <PersonJsonLd
        name={decoded}
        url={authorUrl}
        image={author?.avatar}
        jobTitle={author?.role}
        description={author?.bio}
      />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: brand.url },
          { name: decoded, url: authorUrl },
        ]}
      />
      <AuthorHeader
        author={author}
        authorName={decoded}
        postCount={posts.length}
      />
      <Suspense>
        <FeedPostList posts={posts} tags={tags} authorsMap={authorsMap} />
      </Suspense>
    </div>
  );
}
