import "katex/dist/katex.min.css";
import "@/styles/jetbrains-mono.css";
import { NotionBlockRenderer } from "@/components/detail/NotionBlockRenderer";
import type { NotionBlockWithChildren } from "@/lib/notion/types";

export function NotionRenderer({
  blocks,
}: {
  blocks: NotionBlockWithChildren[];
}) {
  return (
    <div className="prose prose-lg prose-slate max-w-none break-words dark:prose-invert prose-headings:scroll-mt-24 prose-headings:tracking-tight prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-img:rounded-xl [overflow-wrap:anywhere]">
      <NotionBlockRenderer blocks={blocks} />
    </div>
  );
}
