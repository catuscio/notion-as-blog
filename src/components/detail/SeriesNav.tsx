import Link from "next/link";
import { PostThumbnail } from "@/components/common/PostThumbnail";
import { copy } from "@/config/copy";
import { formatDate } from "@/lib/format";
import type { Post } from "@/types";

interface SeriesNavProps {
  posts: Post[];
  currentPostId: string;
  seriesName: string;
}

function SeriesNavItem({
  post,
  index,
  isCurrent,
}: {
  post: Post;
  index: number;
  isCurrent: boolean;
}) {
  const thumbnail = (
    <div className="w-16 h-16 rounded-lg bg-muted overflow-hidden shrink-0 relative">
      <PostThumbnail
        src={post.thumbnail}
        alt={post.title}
        size="sm"
        hoverScale={!isCurrent}
        blurDataURL={post.blurDataURL}
        className="w-full h-full"
      />
      <span
        className={`absolute top-0.5 left-0.5 text-[10px] font-bold w-4 h-4 rounded flex items-center justify-center ${
          isCurrent
            ? "bg-primary text-primary-foreground"
            : "bg-muted-foreground/80 text-background"
        }`}
      >
        {index + 1}
      </span>
    </div>
  );

  const content = (
    <div className="min-w-0">
      <h5
        className={`text-sm font-semibold line-clamp-2 ${
          isCurrent
            ? "text-primary"
            : "group-hover:text-primary transition-colors"
        }`}
      >
        {post.title}
      </h5>
      <span className="text-xs text-muted-foreground mt-1 block">
        {isCurrent ? copy.readingNow : formatDate(post.date, "short")}
      </span>
    </div>
  );

  if (isCurrent) {
    return (
      <div className="flex gap-3 items-start rounded-lg p-2 bg-primary/5">
        {thumbnail}
        {content}
      </div>
    );
  }

  return (
    <Link
      href={`/${post.slug}`}
      className="group flex gap-3 items-start rounded-lg p-2 hover:bg-muted/50 transition-colors"
    >
      {thumbnail}
      {content}
    </Link>
  );
}

export function SeriesNav({ posts, currentPostId, seriesName }: SeriesNavProps) {
  if (posts.length === 0) return null;

  return (
    <div>
      <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-4">
        <Link href={`/series/${encodeURIComponent(seriesName)}`} className="hover:text-primary transition-colors">
          {copy.series.label} · {seriesName}
        </Link>
      </h4>
      <div className="flex flex-col gap-3">
        {posts.map((post, index) => (
          <SeriesNavItem
            key={post.id}
            post={post}
            index={index}
            isCurrent={post.id === currentPostId}
          />
        ))}
      </div>
    </div>
  );
}
