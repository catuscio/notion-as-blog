import Link from "next/link";
import Image from "next/image";
import { copy } from "@/config/copy";
import { formatDate } from "@/lib/format";
import type { ContentItem } from "@/types";

interface SeriesCollectionProps {
  posts: ContentItem[];
  currentPostId: string;
  seriesName: string;
}

export function SeriesCollection({
  posts,
  currentPostId,
  seriesName,
}: SeriesCollectionProps) {
  if (posts.length === 0) return null;

  const currentIndex = posts.findIndex((p) => p.id === currentPostId);

  return (
    <section className="mb-12">
      <div className="flex items-center justify-between gap-4 mb-6">
        <h3 className="text-lg font-bold truncate">
          <Link href={`/series/${encodeURIComponent(seriesName)}`} className="hover:text-primary transition-colors">
            {copy.series.label} · {seriesName}
          </Link>
        </h3>
        <span className="text-sm text-muted-foreground shrink-0">
          {currentIndex + 1} / {posts.length}
        </span>
      </div>
      <div className="relative">
        <div className="overflow-x-auto hide-scrollbar">
          <div className="inline-flex gap-4 py-4 px-1">
          {posts.map((post, index) => {
            const isCurrent = post.id === currentPostId;
            const formattedDate = post.date ? formatDate(post.date, "short") : "";

            const card = (
              <article
                className={`group relative rounded-lg overflow-hidden border w-56 shrink-0 ${
                  isCurrent
                    ? "ring-2 ring-primary border-transparent"
                    : "border-border"
                }`}
              >
                {post.thumbnail && (
                  <div className="aspect-video relative bg-muted">
                    <Image src={post.thumbnail} alt={post.title} fill sizes="224px" className="object-cover" />
                  </div>
                )}
                <div className="p-4">
                  <span className="block mb-2 text-xs text-muted-foreground tabular-nums">{index + 1}</span>
                  <h4
                    className={`text-sm font-semibold line-clamp-2 mb-1 transition-colors ${
                      isCurrent
                        ? "text-primary"
                        : "group-hover:text-primary"
                    }`}
                  >
                    {post.title}
                  </h4>
                  <span className="text-xs text-muted-foreground">
                    {formattedDate}
                  </span>
                </div>
              </article>
            );

            if (isCurrent) {
              return (
                <div key={post.id} className="cursor-default shrink-0">
                  {card}
                </div>
              );
            }

            return (
              <Link key={post.id} href={`/${post.slug}`} className="shrink-0 rounded-lg ui-focus-ring">
                {card}
              </Link>
            );
          })}
          </div>
        </div>
      </div>
    </section>
  );
}
