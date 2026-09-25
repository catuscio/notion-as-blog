import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CategoryBadge } from "@/components/common/CategoryBadge";
import { PostThumbnail } from "@/components/common/PostThumbnail";
import { copy } from "@/config/copy";
import { formatDate } from "@/lib/format";
import type { ContentItem } from "@/types";

export function PostCard({
  post,
  priorityImage = false,
}: {
  post: ContentItem;
  priorityImage?: boolean;
}) {
  return (
    <Link
      href={`/${post.slug}`}
      className="group block rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
    >
      <article className="relative grid gap-6 overflow-hidden rounded-2xl border border-transparent bg-card/60 p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-border hover:bg-muted/40 hover:shadow-toss md:grid-cols-[minmax(0,1fr)_12rem] md:gap-10">
        <div className="flex-1 order-2 md:order-1">
          <div className="sg-cluster mb-3 text-sm font-medium [--cluster-gap:var(--space-3)]">
            {post.category && <CategoryBadge category={post.category} />}
            <span className="text-muted-foreground/50">&bull;</span>
            <span className="text-muted-foreground">{formatDate(post.date)}</span>
          </div>
          <h3 className="mb-3 text-xl font-semibold leading-snug text-balance transition-colors group-hover:text-primary md:text-3xl">
            {post.title}
          </h3>
          {post.summary && (
            <p className="text-muted-foreground leading-relaxed mb-4 text-base md:text-lg line-clamp-3">
              {post.summary}
            </p>
          )}
          <div className="sg-cluster text-sm font-semibold text-primary [--cluster-gap:var(--space-2)]">
            <span>{copy.readArticle}</span>
            <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
          </div>
        </div>
        <PostThumbnail
          src={post.thumbnail}
          alt={post.title}
          size="md"
          preload={priorityImage}
          hoverScale
          className="order-1 aspect-video w-full md:order-2 md:h-32 md:w-48"
        />
      </article>
    </Link>
  );
}
