import Image from "next/image";
import { copy } from "@/config/copy";
import { FeedPageHeader } from "./FeedPageHeader";
import type { Author } from "@/types";

export function AuthorHeader({ author }: { author: Author }) {
  return (
    <FeedPageHeader
      badge={copy.author.badge}
      title={
        <span className="flex items-center gap-4">
          {author.avatar && (
            <Image
              src={author.avatar}
              alt={author.name}
              width={56}
              height={56}
              className="rounded-full object-cover w-14 h-14"
            />
          )}
          {author.name}
        </span>
      }
      subtitle={
        (author.role || author.bio) ? (
          <>
            {author.role && <span className="font-medium">{author.role}</span>}
            {author.role && author.bio && <span> · </span>}
            {author.bio}
          </>
        ) : undefined
      }
    />
  );
}
