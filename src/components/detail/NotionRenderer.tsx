import { NotionBlockRenderer } from "@/components/detail/NotionBlockRenderer";
import type { NotionBlockWithChildren } from "@/lib/notion/types";

export function NotionRenderer({
  blocks,
}: {
  blocks: NotionBlockWithChildren[];
}) {
  return (
    <div className="prose prose-lg prose-slate dark:prose-invert max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-img:rounded-xl break-words [overflow-wrap:anywhere]">
      <NotionBlockRenderer blocks={blocks} />
    </div>
  );
}
