import Link from "next/link";
import { getPublishedPosts } from "@/lib/notion/getPosts";
import { searchPosts } from "@/lib/searchPosts";
import { safeQuery } from "@/lib/notion/safeQuery";
import { brand } from "@/config/brand";
import { formatDate } from "@/lib/format";
import type { Metadata } from "next";

type Props = {
  searchParams: Promise<{ q?: string }>;
};

export const metadata: Metadata = {
  title: `Search — ${brand.name}`,
  robots: { index: false, follow: true },
};

export default async function SearchPage({ searchParams }: Props) {
  const { q = "" } = await searchParams;
  const query = q.trim();

  const allPosts = await safeQuery(() => getPublishedPosts(), []);
  const results = query ? searchPosts(allPosts, query).slice(0, brand.search.pageLimit) : [];

  return (
    <div className="max-w-[1024px] mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-2">Search</h1>
      {query && (
        <p className="text-muted-foreground mb-8">
          {results.length} {results.length === 1 ? "result" : "results"} for &ldquo;{query}&rdquo;
        </p>
      )}

      {!query && (
        <p className="text-muted-foreground mt-4">
          Enter a search term to find articles.
        </p>
      )}

      {query && results.length === 0 && (
        <div className="text-center py-16 text-muted-foreground">
          <span className="material-symbols-outlined text-[48px] mb-4 opacity-50">
            search_off
          </span>
          <p className="text-lg">No results found for &ldquo;{query}&rdquo;</p>
          <p className="text-sm mt-2">Try searching with different keywords.</p>
        </div>
      )}

      {results.length > 0 && (
        <div className="flex flex-col gap-4">
          {results.map((post) => (
            <Link
              key={post.id}
              href={`/${post.slug}`}
              className="block p-6 rounded-xl border border-border hover:bg-muted/50 transition-colors"
            >
              <h2 className="text-lg font-semibold mb-1">{post.title}</h2>
              {post.summary && (
                <p className="text-muted-foreground text-sm line-clamp-2 mb-2">
                  {post.summary}
                </p>
              )}
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                {post.category && <span>{post.category}</span>}
                <span>{formatDate(post.date, "short")}</span>
                {post.tags.slice(0, 3).map((tag) => (
                  <span key={tag} className="bg-muted px-1.5 py-0.5 rounded">
                    {tag}
                  </span>
                ))}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
