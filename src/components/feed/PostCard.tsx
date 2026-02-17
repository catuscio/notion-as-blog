import Link from "next/link";
import { CategoryBadge } from "@/components/common/CategoryBadge";
import { PostThumbnail } from "@/components/common/PostThumbnail";
import { formatDate } from "@/lib/format";
import type { TPost } from "@/types";

export function PostCard({ post }: { post: TPost }) {
  return (
    <Link href={`/${post.slug}`}>
      <article className="group relative flex flex-col md:flex-row gap-6 md:gap-10 items-start p-4 -mx-4 rounded-2xl hover:bg-muted/50 transition-colors duration-300 cursor-pointer overflow-hidden">
        <div className="flex-1 order-2 md:order-1">
          <div className="flex items-center gap-3 mb-3 text-sm font-medium">
            {post.category && <CategoryBadge category={post.category} />}
            <span className="text-muted-foreground/50">&bull;</span>
            <span className="text-muted-foreground">{formatDate(post.date)}</span>
          </div>
          <h3 className="text-xl md:text-3xl font-bold mb-3 group-hover:text-primary transition-colors leading-tight break-words">
            {post.title}
          </h3>
          {post.summary && (
            <p className="text-muted-foreground leading-relaxed mb-4 text-base md:text-lg line-clamp-3">
              {post.summary}
            </p>
          )}
          <div className="flex items-center text-primary font-bold text-sm">
            <span>Read article</span>
            <span className="material-symbols-outlined text-[18px] ml-1 transition-transform group-hover:translate-x-1">
              arrow_forward
            </span>
          </div>
        </div>
        <PostThumbnail
          src={post.thumbnail}
          alt={post.title}
          size="md"
          className="order-1 md:order-2 w-full md:w-48 aspect-video md:aspect-auto md:h-32"
        />
      </article>
    </Link>
  );
}
