import Link from "next/link";
import { PostThumbnail } from "@/components/common/PostThumbnail";
import { AvatarStack } from "@/components/common/AvatarStack";
import { copy } from "@/config/copy";
import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/format";
import { displayTagName } from "@/lib/displayTagName";
import type { ContentItem, AuthorSummary } from "@/types";

const cardClassName = cn(
  "group relative bg-card rounded-2xl p-6 md:p-8 overflow-hidden cursor-pointer",
  "shadow-[var(--shadow-toss)] hover:shadow-[var(--shadow-toss-hover)]",
  "hover:-translate-y-1 transition-all duration-300",
  "border border-transparent dark:border-border"
);

export function FeedPostCard({
  post,
  readingTime,
  authors,
}: {
  post: ContentItem;
  readingTime?: number;
  authors?: AuthorSummary[];
}) {
  const authorList = authors && authors.length > 0
    ? authors
    : [{ name: post.author || copy.authorFallback, avatar: "" }];
  const primaryTag = post.tags?.[0] ? displayTagName(post.tags[0]) : "";

  return (
    <Link
      href={`/${post.slug}`}
      aria-label={post.title}
      className="block rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
    >
      <article className={cardClassName}>
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-150 duration-700 ease-out" />
        <div className="relative z-10 flex flex-col md:flex-row gap-8 items-start">
          <div className="flex-1 flex flex-col h-full justify-between">
            <div>
              <div className="flex items-center gap-3 mb-3 text-sm">
                {primaryTag && (
                  <span className="font-semibold text-primary">{primaryTag}</span>
                )}
                {primaryTag && readingTime && (
                  <span className="text-muted-foreground/30">&bull;</span>
                )}
                {readingTime && (
                  <span className="text-muted-foreground">
                    {readingTime} {copy.readingTime}
                  </span>
                )}
              </div>
              <h3 className="text-xl md:text-2xl font-semibold mb-3 leading-snug group-hover:text-primary transition-colors break-words">
                {post.title}
              </h3>
              {post.summary && (
                <p className="text-muted-foreground line-clamp-3 mb-6 leading-relaxed">
                  {post.summary}
                </p>
              )}
            </div>
            <div className="flex items-center gap-3 mt-auto">
              <AvatarStack authors={authorList} size="sm" showNames={false} />
              <div className="flex flex-col text-xs min-w-0">
                <span className="font-semibold truncate">
                  {authorList.map((a) => a.name).join(", ")}
                </span>
                <span className="text-muted-foreground">{formatDate(post.date, "short")}</span>
              </div>
            </div>
          </div>
          <PostThumbnail
            src={post.thumbnail}
            alt={post.title}
            size="lg"
            fill
            hoverScale
            className="w-full md:w-48 aspect-video md:aspect-square relative"
          />
        </div>
      </article>
    </Link>
  );
}
