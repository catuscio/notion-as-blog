"use client";

import { TagControl } from "@/components/common/TagControl";
import { copy } from "@/config/copy";
import { displayTagName } from "@/lib/displayTagName";

interface TagFilterProps {
  tags: string[];
  activeTag: string | null;
  onTagClick: (tag: string | null) => void;
  asLinks?: boolean;
  allHref?: string;
}

export function TagFilter({ tags, activeTag, onTagClick, asLinks = false, allHref = "/" }: TagFilterProps) {
  return (
    <div className="flex flex-wrap gap-x-[var(--tag-gap)] gap-y-2">
      <TagControl label={copy.tag.allPosts} selected={activeTag === null}
        href={asLinks ? allHref : undefined} onClick={asLinks ? undefined : () => onTagClick(null)} />
      {tags.map((tag) => (
        <TagControl key={tag} label={displayTagName(tag)} selected={activeTag === tag}
          href={asLinks ? `/tag/${encodeURIComponent(tag)}` : undefined}
          onClick={asLinks ? undefined : () => onTagClick(tag)} />
      ))}
    </div>
  );
}
