import { FileText } from "lucide-react";
import { PostCard } from "./PostCard";
import { EmptyState } from "@/components/common/EmptyState";
import { copy } from "@/config/copy";
import type { ContentItem } from "@/types";

export function PostList({
  posts,
  prioritizeFirstImage = false,
}: {
  posts: ContentItem[];
  prioritizeFirstImage?: boolean;
}) {
  if (posts.length === 0) {
    return <EmptyState icon={<FileText size={60} />} message={copy.noPosts} />;
  }

  return (
    <div className="sg-stack [--stack-gap:0px]">
      {posts.map((post, index) => (
        <div key={post.id}>
          <PostCard post={post} priorityImage={prioritizeFirstImage && index === 0} />
        </div>
      ))}
    </div>
  );
}
