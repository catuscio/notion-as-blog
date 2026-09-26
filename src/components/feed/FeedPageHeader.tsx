import type { ReactNode } from "react";
import { copy } from "@/config/copy";

interface FeedPageHeaderProps {
  title: ReactNode;
  count?: number;
  subtitle?: ReactNode;
  children?: ReactNode;
}

export function FeedPageHeader({ title, count, subtitle, children }: FeedPageHeaderProps) {
  return (
    <section className="mb-6">
      {children}
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-2">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight break-words min-w-0">{title}</h1>
        {count !== undefined && <span className="text-sm text-muted-foreground">{copy.postCount(count)}</span>}
      </div>
      {subtitle && <p className="mt-3 text-base text-muted-foreground max-w-xl leading-normal">{subtitle}</p>}
    </section>
  );
}
