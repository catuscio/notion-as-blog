import { User } from "lucide-react";
import { copy } from "@/config/copy";
import { AvatarStack } from "@/components/common/AvatarStack";
import type { Post, Author } from "@/types";
import { formatDate } from "@/lib/format";
import { ShareButton } from "./ShareButton";

export function PostHeaderMeta({
  post,
  authors,
  readingTime,
}: {
  post: Post;
  authors: Author[];
  readingTime: number;
}) {
  const authorSummaries = authors.map((a) => ({
    name: a.name,
    avatar: a.avatar,
    blurDataURL: a.blurDataURL,
  }));

  const displayName =
    authors.length > 0
      ? authors.map((a) => a.name).join(", ")
      : post.author || copy.authorFallback;

  return (
    <div className="flex items-center justify-between gap-4 border-b border-border pb-8">
      <div className="flex items-center gap-4 min-w-0">
        {authorSummaries.length > 0 ? (
          <AvatarStack authors={authorSummaries} size="md" showNames={false} />
        ) : (
          <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center text-muted-foreground overflow-hidden shrink-0">
            <User size={24} />
          </div>
        )}
        <div>
          <p className="font-semibold">{displayName}</p>
          <p className="text-sm text-muted-foreground flex items-center gap-2">
            <span>{formatDate(post.date)}</span>
            <span className="w-1 h-1 rounded-full bg-muted-foreground/30" />
            <span>{readingTime} {copy.readingTime}</span>
          </p>
        </div>
      </div>
      <ShareButton title={post.title} />
    </div>
  );
}

export function PostHeader({
  post,
  authors,
  readingTime,
  titleSlot,
  metaSlot,
}: {
  post: Post;
  authors: Author[];
  readingTime: number;
  titleSlot?: React.ReactNode;
  metaSlot?: React.ReactNode;
}) {
  return (
    <div className="mb-8">
      <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-6 leading-[1.15] break-words">
        {titleSlot ?? post.title}
      </h1>
      {metaSlot ?? <PostHeaderMeta post={post} authors={authors} readingTime={readingTime} />}
    </div>
  );
}
