import { TagControl } from "@/components/common/TagControl";
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

/** Mobile tag navigation keeps its existing horizontal scrolling behavior. */
export function MobileTagBar({ tags }: TagSidebarProps) {
  return (
    <nav aria-label="Tags, scroll horizontally for more" className="tag-scroll-reel lg:hidden -mx-6 overflow-x-auto px-6 hide-scrollbar">
      <div className="flex gap-[var(--tag-gap)] pb-2 min-w-max">
        <TagControl href="/" label={copy.tag.all} selected />
        {tags.map((tag) => <TagControl key={tag.name} href={tagHref(tag.name)} label={displayTagName(tag.name)} count={tag.count} />)}
      </div>
    </nav>
  );
}

export function TagSidebar({ tags, totalCount }: TagSidebarProps) {
  return (
    <aside className="sg-sticky-aside-side hidden lg:block">
      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">{copy.tag.tagsHeading}</h3>
      <div className="flex flex-col gap-2">
        <TagControl href="/" label={copy.tag.allPosts} count={totalCount} selected layout="row" />
        {tags.map((tag) => <TagControl key={tag.name} href={tagHref(tag.name)} label={displayTagName(tag.name)} count={tag.count} layout="row" />)}
      </div>
    </aside>
  );
}
