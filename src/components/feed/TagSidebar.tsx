import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { copy } from "@/config/copy";
import type { TagItem } from "@/types";

interface TagSidebarProps {
  tags: TagItem[];
  totalCount: number;
}

function tagHref(tag: string) {
  return `/tag/${encodeURIComponent(tag)}`;
}

/** Mobile: horizontal scrollable tag pills */
export function MobileTagBar({ tags }: TagSidebarProps) {
  return (
    <div className="lg:hidden -mx-6 px-6 overflow-x-auto hide-scrollbar">
      <div className="flex gap-2 pb-2" style={{ minWidth: "min-content" }}>
        <Link
          href="/"
          className="shrink-0 rounded-full px-4 py-1.5 text-sm font-semibold transition-colors bg-primary/15 text-foreground ring-1 ring-primary/30"
        >
          {copy.tag.all}
        </Link>
        {tags.map((tag) => (
          <Link
            key={tag.name}
            href={tagHref(tag.name)}
            className="shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-colors bg-muted text-muted-foreground hover:text-foreground"
          >
            {tag.name}
            <span className="ml-1 opacity-60">{tag.count}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}

/** Desktop: vertical sidebar */
export function TagSidebar({ tags, totalCount }: TagSidebarProps) {
  return (
    <aside className="hidden lg:block w-56 shrink-0">
      <div className="sticky top-28">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
          {copy.tag.tagsHeading}
        </h3>
        <div className="flex flex-col gap-1.5">
          <Link
            href="/"
            className="group flex items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors bg-primary/15 text-foreground font-semibold ring-1 ring-primary/30"
          >
            <span>{copy.tag.allPosts}</span>
            <Badge
              variant="secondary"
              className="text-[11px] px-1.5 py-0 min-w-[22px] justify-center"
            >
              {totalCount}
            </Badge>
          </Link>

          {tags.map((tag) => (
            <Link
              key={tag.name}
              href={tagHref(tag.name)}
              className="group flex items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <span className="truncate mr-2">{tag.name}</span>
              <Badge
                variant="secondary"
                className="text-[11px] px-1.5 py-0 min-w-[22px] justify-center"
              >
                {tag.count}
              </Badge>
            </Link>
          ))}
        </div>
      </div>
    </aside>
  );
}
