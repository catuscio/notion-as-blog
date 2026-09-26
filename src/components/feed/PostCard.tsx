import Link from "next/link";
import { CategoryBadge } from "@/components/common/CategoryBadge";
import { PostThumbnail } from "@/components/common/PostThumbnail";
import { copy } from "@/config/copy";
import { formatDate } from "@/lib/format";
import type { ContentItem, AuthorSummary } from "@/types";

export function PostCard({
  post,
  priorityImage = false,
  authors,
  readingTime,
}: {
  post: ContentItem;
  priorityImage?: boolean;
  authors?: AuthorSummary[];
  readingTime?: number;
}) {
  const authorNames = authors?.length
    ? authors.map((author) => author.name).join(", ")
    : post.author || (authors !== undefined ? copy.authorFallback : undefined);

  return (
    <Link
      href={`/${post.slug}`}
      aria-label={post.title}
      className="group block rounded-lg ui-focus-ring"
    >
      <article className={`grid gap-6 border-b border-border py-6 ${post.thumbnail ? "md:grid-cols-[minmax(0,1fr)_12rem]" : ""}`}>
        <div className="min-w-0">
          <div className="sg-cluster mb-3 text-sm [--cluster-gap:var(--space-3)]">
            {post.category && <CategoryBadge category={post.category} />}
            <span className="text-muted-foreground">{formatDate(post.date)}</span>
            {authorNames && <span className="text-muted-foreground">{authorNames}</span>}
            {readingTime && <span className="text-muted-foreground">{readingTime} {copy.readingTime}</span>}
          </div>
          <h3 className="text-xl md:text-2xl font-semibold leading-snug text-balance break-words transition-colors duration-[var(--motion-fast)] group-hover:text-primary group-focus-visible:text-primary">
            {post.title}
          </h3>
          {post.summary && (
            <p className="mt-3 text-muted-foreground leading-normal text-base line-clamp-3">
              {post.summary}
            </p>
          )}
        </div>
        <PostThumbnail
          src={post.thumbnail}
          alt={post.title}
          size="md"
          preload={priorityImage}
        />
      </article>
    </Link>
  );
}
