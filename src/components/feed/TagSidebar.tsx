"use client";

import { Badge } from "@/components/ui/badge";
import type { TTagItem } from "@/types";

interface TagSidebarProps {
  tags: TTagItem[];
  activeTag: string | null;
  onTagClick: (tag: string | null) => void;
}

/** Mobile: horizontal scrollable tag pills */
export function MobileTagBar({ tags, activeTag, onTagClick }: TagSidebarProps) {
  return (
    <div className="lg:hidden -mx-6 px-6 overflow-x-auto hide-scrollbar">
      <div className="flex gap-2 pb-2" style={{ minWidth: "min-content" }}>
        <button
          onClick={() => onTagClick(null)}
          className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
            activeTag === null
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground hover:text-foreground"
          }`}
        >
          All
        </button>
        {tags.map((tag) => (
          <button
            key={tag.name}
            onClick={() =>
              onTagClick(activeTag === tag.name ? null : tag.name)
            }
            className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              activeTag === tag.name
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            {tag.name}
            <span className="ml-1 opacity-60">{tag.count}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

/** Desktop: vertical sidebar */
export function TagSidebar({ tags, activeTag, onTagClick }: TagSidebarProps) {
  return (
    <aside className="hidden lg:block w-56 shrink-0">
      <div className="sticky top-28">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
          Tags
        </h3>
        <div className="flex flex-col gap-1.5">
          <button
            onClick={() => onTagClick(null)}
            className={`group flex items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors ${
              activeTag === null
                ? "bg-primary/10 text-primary font-semibold"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            <span>All Posts</span>
            <Badge
              variant={activeTag === null ? "default" : "secondary"}
              className="text-[11px] px-1.5 py-0 min-w-[22px] justify-center"
            >
              {tags.reduce((sum, t) => sum + t.count, 0)}
            </Badge>
          </button>

          {tags.map((tag) => (
            <button
              key={tag.name}
              onClick={() =>
                onTagClick(activeTag === tag.name ? null : tag.name)
              }
              className={`group flex items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors ${
                activeTag === tag.name
                  ? "bg-primary/10 text-primary font-semibold"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <span className="truncate mr-2">{tag.name}</span>
              <Badge
                variant={activeTag === tag.name ? "default" : "secondary"}
                className="text-[11px] px-1.5 py-0 min-w-[22px] justify-center"
              >
                {tag.count}
              </Badge>
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}
