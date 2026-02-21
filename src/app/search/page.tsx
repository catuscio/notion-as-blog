import { Suspense } from "react";
import { FeedPostCard } from "@/components/feed/FeedPostCard";
import { getPublishedPosts } from "@/lib/notion/getPosts";
import { getAuthorLookupMap } from "@/lib/notion/getAuthors";
import { searchPosts } from "@/lib/searchPosts";
import { safeQuery } from "@/lib/notion/safeQuery";
import { brand } from "@/config/brand";
import { copy } from "@/config/copy";
import { resolveAuthor } from "@/lib/resolveAuthor";
import type { Post, AuthorSummary } from "@/types";
import type { Metadata } from "next";

type Props = {
  searchParams: Promise<{ q?: string }>;
};

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { q } = await searchParams;
  const query = q?.trim() ?? "";
  const title = query ? copy.search.titleWithQuery(query) : copy.search.title;

  return {
    title,
    description: copy.search.description(brand.name),
    robots: { index: false, follow: true },
  };
}

async function SearchResults({ query, authorsMap }: { query: string; authorsMap: Record<string, AuthorSummary> }) {
  const allPosts = await safeQuery<Post[]>(getPublishedPosts, []);
  const results = query.length >= 2 ? searchPosts(allPosts, query).slice(0, brand.search.pageLimit) : [];

  if (query.length < 2) {
    return (
      <div className="text-center py-16 text-muted-foreground">
        <p className="text-lg">{copy.search.minLength}</p>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="text-center py-16 text-muted-foreground">
        <p className="text-lg">{copy.search.noResults(query)}</p>
      </div>
    );
  }

  return (
    <section className="flex flex-col gap-6">
      {results.map((post) => (
        <FeedPostCard
          key={post.id}
          post={post}
          author={resolveAuthor(post, authorsMap)}
        />
      ))}
    </section>
  );
}

export default async function SearchPage({ searchParams }: Props) {
  const { q } = await searchParams;
  const query = q?.trim() ?? "";
  const authorsMap = await safeQuery(getAuthorLookupMap, {});

  return (
    <div className="max-w-[1024px] mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold tracking-tight mb-2">
        {query ? (
          copy.search.headingWithQuery(query)
        ) : (
          copy.search.heading
        )}
      </h1>
      <Suspense>
        <SearchResults query={query} authorsMap={authorsMap} />
      </Suspense>
    </div>
  );
}
