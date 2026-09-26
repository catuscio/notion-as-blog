import Link from "next/link";
import { PostThumbnail } from "@/components/common/PostThumbnail";
import { copy } from "@/config/copy";
import type { ContentItem } from "@/types";

export function ReadNext({
  posts,
  readingTimeMap,
}: {
  posts: ContentItem[];
  readingTimeMap?: Record<string, number>;
}) {
  if (posts.length === 0) return null;

  return (
    <div className="sg-stack [--stack-gap:var(--space-4)]">
      <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
        {copy.readNext}
      </h4>
      <div className="sg-stack [--stack-gap:var(--space-4)]">
        {posts.slice(0, 3).map((post) => (
          <Link
            key={post.id}
            href={`/${post.slug}`}
            className="group flex items-start gap-3 rounded-lg ui-focus-ring"
          >
            <PostThumbnail
              src={post.thumbnail}
              alt={post.title}
              size="sm"
            />
            <div>
              <h5 className="text-sm font-semibold group-hover:text-primary transition-colors line-clamp-2">
                {post.title}
              </h5>
              <span className="text-xs text-muted-foreground mt-1 block">
                {readingTimeMap?.[post.id]
                  ? `${readingTimeMap[post.id]} ${copy.readingTime}`
                  : ""}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
