import { FileText } from "lucide-react";
import { PostCard } from "./PostCard";
import { EmptyState } from "@/components/common/EmptyState";
import { copy } from "@/config/copy";
import type { Post } from "@/types";

export function PostList({ posts }: { posts: Post[] }) {
  if (posts.length === 0) {
    return <EmptyState icon={<FileText size={60} />} message={copy.noPosts} />;
  }

  return (
    <div className="flex flex-col divide-y divide-border">
      {posts.map((post) => (
        <div key={post.id} className="py-8 md:py-12 first:pt-0 last:pb-0">
          <PostCard post={post} />
        </div>
      ))}
    </div>
  );
}
