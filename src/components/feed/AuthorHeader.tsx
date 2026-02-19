import Image from "next/image";
import type { TAuthor } from "@/types";

export function AuthorHeader({
  author,
  authorName,
  postCount,
}: {
  author: TAuthor | null;
  authorName: string;
  postCount: number;
}) {
  const displayName = author?.name || authorName;
  const avatar = author?.avatar;
  const bio = author?.bio;
  const role = author?.role;

  return (
    <div className="mb-10 flex items-start gap-6">
      <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center shrink-0 overflow-hidden">
        {avatar ? (
          <Image
            src={avatar}
            alt={displayName}
            width={80}
            height={80}
            className="object-cover w-full h-full"
          />
        ) : (
          <span className="material-symbols-outlined text-[40px] text-muted-foreground">
            person
          </span>
        )}
      </div>
      <div>
        <h1 className="text-3xl font-bold">{displayName}</h1>
        {role && (
          <p className="text-muted-foreground text-sm mt-1">{role}</p>
        )}
        {bio && (
          <p className="text-muted-foreground mt-2 leading-relaxed">{bio}</p>
        )}
        <p className="text-sm text-muted-foreground mt-2">
          {postCount} {postCount === 1 ? "post" : "posts"}
        </p>
      </div>
    </div>
  );
}
