import Link from "next/link";
import Image from "next/image";
import { User } from "lucide-react";
import { PostThumbnail } from "@/components/common/PostThumbnail";
import { copy } from "@/config/copy";
import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/format";
import type { Post, AuthorSummary } from "@/types";

const cardClassName = cn(
  "group relative bg-card rounded-2xl p-6 md:p-8 overflow-hidden cursor-pointer",
  "shadow-[var(--shadow-toss)] hover:shadow-[var(--shadow-toss-hover)]",
  "hover:-translate-y-1 transition-all duration-300",
  "border border-transparent dark:border-border"
);

export function FeedPostCard({
  post,
  readingTime,
  author,
}: {
  post: Post;
  readingTime?: number;
  author?: AuthorSummary;
}) {
  return (
    <Link href={`/${post.slug}`} aria-label={post.title}>
      <article className={cardClassName}>
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-150 duration-700 ease-out" />
        <div className="relative z-10 flex flex-col md:flex-row gap-8 items-start">
          <div className="flex-1 flex flex-col h-full justify-between">
            <div>
              <div className="flex items-center gap-3 mb-3 text-sm">
                {post.tags?.[0] && (
                  <span className="font-semibold text-primary">{post.tags[0]}</span>
                )}
                {post.tags?.[0] && readingTime && (
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
              <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground overflow-hidden">
                {author?.avatar ? (
                  <Image
                    src={author.avatar}
                    alt={author.name}
                    width={32}
                    height={32}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <User size={18} />
                )}
              </div>
              <div className="flex flex-col text-xs">
                <span className="font-semibold">{author?.name || post.author || copy.authorFallback}</span>
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
