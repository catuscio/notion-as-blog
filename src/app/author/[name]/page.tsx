import { Suspense } from "react";
import { notFound } from "next/navigation";
import { AuthorHeader } from "@/components/feed/AuthorHeader";
import { FeedPostList } from "@/components/feed/FeedPostList";
import { PersonJsonLd, BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { getListedPosts } from "@/lib/notion/contentCatalog";
import { getAllAuthors, getOptionalAllAuthors } from "@/lib/notion/getAuthors";
import { getFeedData } from "@/lib/notion/getFeedData";
import { filterPostsByAuthor } from "@/lib/notion/contentQueries";
import { brand } from "@/config/brand";
import { copy } from "@/config/copy";
import { safeDecode } from "@/lib/safeDecode";
import { createListingMetadata } from "@/lib/listingMetadata";
import type { Metadata } from "next";

type Props = {
  params: Promise<{ name: string }>;
};

async function getAuthorFromRoute(name: string) {
  const decoded = safeDecode(name);
  const authors = await getAllAuthors();
  return authors.find((a) => a.name === decoded) ?? null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { name } = await params;
  const author = await getAuthorFromRoute(name);
  if (!author) return { title: copy.notFound.title };

  const allPosts = await getListedPosts();
  const count = filterPostsByAuthor(allPosts, author.peopleIds).length;

  const authorUrl = `${brand.url}/author/${encodeURIComponent(author.name)}`;
  const description = author.bio || copy.author.descriptionFallback(brand.name, author.name);

  return createListingMetadata({
    title: author.name,
    socialTitle: `${author.name} — ${brand.name}`,
    description,
    url: authorUrl,
    openGraphType: "profile",
    robots: count <= 2 ? { index: false, follow: true } : undefined,
  });
}

export async function generateStaticParams() {
  const authors = await getOptionalAllAuthors();
  return authors.map((a) => ({ name: encodeURIComponent(a.name) }));
}

export default async function AuthorPage({ params }: Props) {
  const { name } = await params;
  const author = await getAuthorFromRoute(name);
  if (!author) notFound();

  const allPosts = await getListedPosts();
  const posts = filterPostsByAuthor(allPosts, author.peopleIds);
  const { tags, authorsMap } = await getFeedData(posts);

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
