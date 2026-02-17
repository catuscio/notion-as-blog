import Image from "next/image";
import type { TPost, TAuthor } from "@/types";
import { formatDate } from "@/lib/format";
import { ShareButton } from "./ShareButton";

export function PostHeader({
  post,
  author,
  readingTime,
}: {
  post: TPost;
  author: TAuthor | null;
  readingTime: number;
}) {
  return (
    <div className="mb-8">
      <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-6 leading-[1.15] break-words">
        {post.title}
      </h1>
      <div className="flex items-center justify-between gap-4 border-b border-border pb-8">
        <div className="flex items-center gap-4 min-w-0">
          <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center text-muted-foreground overflow-hidden shrink-0">
            {author?.avatar ? (
              <Image
                src={author.avatar}
                alt={author.name}
                width={48}
                height={48}
                className="object-cover w-full h-full"
              />
            ) : (
              <span className="material-symbols-outlined text-[24px]">
                person
              </span>
            )}
          </div>
          <div>
            <p className="font-semibold">{author?.name || post.author || "Author"}</p>
            <p className="text-sm text-muted-foreground flex items-center gap-2">
              <span>{formatDate(post.date)}</span>
              <span className="w-1 h-1 rounded-full bg-muted-foreground/30" />
              <span>{readingTime} min read</span>
            </p>
          </div>
        </div>
        <ShareButton title={post.title} />
      </div>
    </div>
  );
}
