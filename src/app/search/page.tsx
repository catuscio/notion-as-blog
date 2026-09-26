import { Suspense } from "react";
import { SearchInputLoader } from "@/components/common/SearchInputLoader";
import { PostCard } from "@/components/feed/PostCard";
import { getListedPosts } from "@/lib/notion/contentCatalog";
import { getOptionalAuthorLookupMap } from "@/lib/notion/getAuthors";
import { searchPosts } from "@/lib/searchPosts";
import { brand } from "@/config/brand";
import { copy } from "@/config/copy";
import { resolveAuthors } from "@/lib/resolveAuthors";
import { MAX_SEARCH_QUERY_LENGTH, MIN_SEARCH_QUERY_LENGTH } from "@/lib/searchContract";
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

async function SearchResults({ query }: { query: string }) {
  if (query.length < MIN_SEARCH_QUERY_LENGTH) {
    return (
      <div className="text-center py-16 text-muted-foreground">
        <p className="text-lg">{copy.search.minLength}</p>
      </div>
    );
  }

  if (query.length > MAX_SEARCH_QUERY_LENGTH) {
    return (
      <div className="text-center py-16 text-destructive">
        <p className="text-lg">{copy.search.queryTooLong}</p>
      </div>
    );
  }

  const allPosts = await getListedPosts();
  const authorsMap = await getOptionalAuthorLookupMap();
  const results = searchPosts(allPosts, query).slice(0, brand.search.pageLimit);

  if (results.length === 0) {
    return (
      <div className="text-center py-16 text-muted-foreground">
        <p className="text-lg">{copy.search.noResults(query)}</p>
      </div>
    );
  }

  return (
    <section className="flex flex-col">
      {results.map((post) => (
        <PostCard
          key={post.id}
          post={post}
          authors={resolveAuthors(post, authorsMap)}
        />
      ))}
    </section>
  );
}

export default async function SearchPage({ searchParams }: Props) {
  const { q } = await searchParams;
  const query = q?.trim() ?? "";
  return (
    <div className="sg-content-limiter py-12">
      <h1 className="text-3xl font-bold tracking-tight mb-2">
        {query ? (
          copy.search.headingWithQuery(query)
        ) : (
          copy.search.heading
        )}
      </h1>
      <div className="max-w-xl mt-6 mb-4"><SearchInputLoader /></div>
      <Suspense>
        <SearchResults query={query} />
      </Suspense>
    </div>
  );
}
