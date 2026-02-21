"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { copy } from "@/config/copy";

interface TagFilterProps {
  tags: string[];
  activeTag: string | null;
  onTagClick: (tag: string | null) => void;
  asLinks?: boolean;
  allHref?: string;
}

const tagBtnClass = "rounded-full px-5 py-2.5 text-sm font-medium active:scale-95 transition-transform";

function TagButton({
  label,
  active,
  asLink,
  href,
  onClick,
}: {
  label: string;
  active: boolean;
  asLink: boolean;
  href: string;
  onClick: () => void;
}) {
  const variant = active ? "default" : "outline";
  if (asLink) {
    return (
      <Button variant={variant} className={tagBtnClass} asChild>
        <Link href={href}>{label}</Link>
      </Button>
    );
  }
  return (
    <Button variant={variant} className={tagBtnClass} onClick={onClick}>
      {label}
    </Button>
  );
}

export function TagFilter({
  tags,
  activeTag,
  onTagClick,
  asLinks = false,
  allHref = "/",
}: TagFilterProps) {
  return (
    <div className="flex flex-wrap gap-2 mt-8 py-2">
      <TagButton
        label={copy.tag.allPosts}
        active={activeTag === null}
        asLink={asLinks}
        href={allHref}
        onClick={() => onTagClick(null)}
      />
      {tags.map((tag) => (
        <TagButton
          key={tag}
          label={tag}
          active={activeTag === tag}
          asLink={asLinks}
          href={`/tag/${encodeURIComponent(tag)}`}
          onClick={() => onTagClick(tag)}
        />
      ))}
    </div>
  );
}
