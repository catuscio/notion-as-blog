import { PostCard } from "./PostCard";
import type { TPost } from "@/types";

export function PostList({ posts }: { posts: TPost[] }) {
  if (posts.length === 0) {
    return (
      <div className="text-center py-16 text-muted-foreground">
        <span className="material-symbols-outlined text-6xl mb-4 block opacity-30">
          draft
        </span>
        <p className="text-lg">No posts yet. Check back soon!</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 md:gap-12">
      {posts.map((post, i) => (
        <div key={post.id}>
          <PostCard post={post} />
          {i < posts.length - 1 && (
            <div className="h-px bg-border w-full mt-8 md:mt-12" />
          )}
        </div>
      ))}
    </div>
  );
}
