import Link from "next/link";
import Image from "next/image";
import { FileText } from "lucide-react";
import { copy } from "@/config/copy";
import { formatDate } from "@/lib/format";
import type { Post } from "@/types";

interface SeriesCollectionProps {
  posts: Post[];
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
                className={`group relative bg-card rounded-xl overflow-hidden shadow-[var(--shadow-toss)] border transition-all duration-300 w-56 shrink-0 ${
                  isCurrent
                    ? "ring-2 ring-primary border-transparent"
                    : "border-transparent dark:border-border hover:shadow-[var(--shadow-toss-hover)] hover:-translate-y-0.5"
                }`}
              >
                <div className="aspect-video relative bg-muted">
                  {post.thumbnail ? (
                    <Image
                      src={post.thumbnail}
                      alt={post.title}
                      fill
                      className={`object-cover transition-transform duration-700 ${
                        !isCurrent ? "group-hover:scale-110" : ""
                      }`}
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center text-primary/30">
                      <FileText size={36} className="opacity-50" />
                    </div>
                  )}
                  <span className="absolute top-2 left-2 bg-primary text-primary-foreground text-xs font-bold px-2 py-0.5 rounded-md">
                    {index + 1}
                  </span>
                </div>
                <div className="p-4">
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
              <Link key={post.id} href={`/${post.slug}`} className="shrink-0">
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
