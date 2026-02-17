import Link from "next/link";
import Image from "next/image";
import { PostThumbnail } from "@/components/common/PostThumbnail";
import { formatDate } from "@/lib/format";
import type { TPost } from "@/types";

export type AuthorSummary = {
  avatar: string;
  name: string;
};

export function FeedPostCard({
  post,
  readingTime,
  author,
}: {
  post: TPost;
  readingTime?: number;
  author?: AuthorSummary;
}) {
  return (
    <Link href={`/${post.slug}`}>
      <article className="group relative bg-card rounded-2xl p-6 md:p-8 shadow-[var(--shadow-toss)] hover:shadow-[var(--shadow-toss-hover)] hover:-translate-y-1 transition-all duration-300 border border-transparent dark:border-border cursor-pointer overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-150 duration-700 ease-out" />
        <div className="relative z-10 flex flex-col md:flex-row gap-8 items-start">
          <div className="flex-1 flex flex-col h-full justify-between">
            <div>
              <div className="flex items-center gap-3 mb-3 text-sm">
                {post.tags[0] && (
                  <span className="font-bold text-primary">{post.tags[0]}</span>
                )}
                <span className="text-muted-foreground/30">&bull;</span>
                <span className="text-muted-foreground">
                  {readingTime ? `${readingTime} min read` : ""}
                </span>
              </div>
              <h3 className="text-xl md:text-2xl font-bold mb-3 leading-tight group-hover:text-primary transition-colors break-words">
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
                  <span className="material-symbols-outlined text-[18px]">
                    person
                  </span>
                )}
              </div>
              <div className="flex flex-col text-xs">
                <span className="font-semibold">{author?.name || post.author || "Author"}</span>
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
