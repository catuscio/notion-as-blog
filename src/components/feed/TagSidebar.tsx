import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { copy } from "@/config/copy";
import { displayTagName } from "@/lib/displayTagName";
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
    <nav aria-label="Tags, scroll horizontally for more" className="tag-scroll-reel lg:hidden -mx-6 overflow-x-auto px-6 hide-scrollbar">
      <div className="flex gap-2 pb-2" style={{ minWidth: "min-content" }}>
        <Link
          href="/"
          className="shrink-0 rounded-full bg-primary/15 px-4 py-1.5 text-sm font-semibold text-foreground ring-1 ring-primary/30 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
        >
          {copy.tag.all}
        </Link>
        {tags.map((tag) => (
          <Link
            key={tag.name}
            href={tagHref(tag.name)}
            className="shrink-0 rounded-full bg-muted px-4 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
          >
            {displayTagName(tag.name)}
            <span className="ml-1 opacity-60">{tag.count}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}

/** Desktop: vertical sidebar */
export function TagSidebar({ tags, totalCount }: TagSidebarProps) {
  return (
    <aside className="sg-sticky-aside-side hidden lg:block">
      <div>
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
          {copy.tag.tagsHeading}
        </h3>
        <div className="flex flex-col gap-1.5">
          <Link
            href="/"
            className="group flex items-center justify-between rounded-lg bg-primary/15 px-3 py-2 text-sm font-semibold text-foreground ring-1 ring-primary/30 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
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
              className="group flex items-center justify-between rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
            >
              <span className="truncate mr-2">{displayTagName(tag.name)}</span>
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
