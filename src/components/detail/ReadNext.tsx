import Link from "next/link";
import { PostThumbnail } from "@/components/common/PostThumbnail";
import type { TPost } from "@/types";

export function ReadNext({
  posts,
  readingTimeMap,
}: {
  posts: TPost[];
  readingTimeMap?: Record<string, number>;
}) {
  if (posts.length === 0) return null;

  return (
    <div>
      <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-4">
        Read Next
      </h4>
      <div className="flex flex-col gap-4">
        {posts.slice(0, 3).map((post) => (
          <Link
            key={post.id}
            href={`/${post.slug}`}
            className="group flex gap-3 items-start"
          >
            <PostThumbnail
              src={post.thumbnail}
              alt={post.title}
              size="sm"
              hoverScale
            />
            <div>
              <h5 className="text-sm font-semibold group-hover:text-primary transition-colors line-clamp-2">
                {post.title}
              </h5>
              <span className="text-xs text-muted-foreground mt-1 block">
                {readingTimeMap?.[post.id]
                  ? `${readingTimeMap[post.id]} min read`
                  : ""}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
