import Link from "next/link";
import { cn } from "@/lib/utils";

interface TagControlProps {
  label: string;
  selected?: boolean;
  count?: number;
  href?: string;
  onClick?: () => void;
  layout?: "inline" | "row";
}

export function TagControl({ label, selected = false, count, href, onClick, layout = "inline" }: TagControlProps) {
  const className = cn("ui-tag-control shrink-0", layout === "row" && "w-full justify-between");
  const content = (
    <>
      <span className={layout === "row" ? "truncate" : undefined}>{label}</span>
      {count !== undefined && <span className="text-xs tabular-nums text-muted-foreground">{count}</span>}
    </>
  );

  if (href !== undefined) {
    return <Link href={href} className={className} data-selected={selected} aria-current={selected ? "page" : undefined}>{content}</Link>;
  }

  return <button type="button" className={className} data-selected={selected} aria-pressed={selected} onClick={onClick}>{content}</button>;
}
