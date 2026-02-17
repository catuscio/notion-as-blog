"use client";

import { Button } from "@/components/ui/button";

export function TagFilter({
  tags,
  activeTag,
  onTagClick,
}: {
  tags: string[];
  activeTag: string | null;
  onTagClick: (tag: string | null) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2 mt-8 py-2">
      <Button
        variant={activeTag === null ? "default" : "outline"}
        className="rounded-full px-5 py-2.5 text-sm font-semibold active:scale-95 transition-transform"
        onClick={() => onTagClick(null)}
      >
        All Posts
      </Button>
      {tags.map((tag) => (
        <Button
          key={tag}
          variant={activeTag === tag ? "default" : "outline"}
          className="rounded-full px-5 py-2.5 text-sm font-medium active:scale-95 transition-transform"
          onClick={() => onTagClick(tag)}
        >
          {tag}
        </Button>
      ))}
    </div>
  );
}
