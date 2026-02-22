import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CategoryBadge } from "@/components/common/CategoryBadge";
import { PostThumbnail } from "@/components/common/PostThumbnail";
import { copy } from "@/config/copy";
import { formatDate } from "@/lib/format";
import type { Post } from "@/types";

export function PostCard({ post }: { post: Post }) {
  return (
    <Link href={`/${post.slug}`}>
      <article className="group relative flex flex-col md:flex-row gap-6 md:gap-10 items-start p-4 -mx-4 rounded-2xl hover:bg-muted/50 transition-colors duration-300 cursor-pointer overflow-hidden">
        <div className="flex-1 order-2 md:order-1">
          <div className="flex items-center gap-3 mb-3 text-sm font-medium">
            {post.category && <CategoryBadge category={post.category} />}
            <span className="text-muted-foreground/50">&bull;</span>
            <span className="text-muted-foreground">{formatDate(post.date)}</span>
          </div>
          <h3 className="text-xl md:text-3xl font-semibold mb-3 group-hover:text-primary transition-colors leading-snug break-words">
            {post.title}
          </h3>
          {post.summary && (
            <p className="text-muted-foreground leading-relaxed mb-4 text-base md:text-lg line-clamp-3">
              {post.summary}
            </p>
          )}
          <div className="flex items-center text-primary font-semibold text-sm">
            <span>{copy.readArticle}</span>
            <ArrowRight size={18} className="ml-1 transition-transform group-hover:translate-x-1" />
          </div>
        </div>
        <PostThumbnail
          src={post.thumbnail}
          alt={post.title}
          size="md"
          blurDataURL={post.blurDataURL}
          className="order-1 md:order-2 w-full md:w-48 aspect-video md:aspect-auto md:h-32"
        />
      </article>
    </Link>
  );
}
