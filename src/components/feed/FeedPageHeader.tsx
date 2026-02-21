import type { ReactNode } from "react";

interface FeedPageHeaderProps {
  badge: string;
  title: ReactNode;
  subtitle?: ReactNode;
  children?: ReactNode;
}

export function FeedPageHeader({ badge, title, subtitle, children }: FeedPageHeaderProps) {
  return (
    <section className="mb-12">
      <div>
        <span className="inline-block mb-3 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
          {badge}
        </span>
        {children}
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
          {title}
        </h1>
        {subtitle && (
          <p className="text-lg text-muted-foreground max-w-xl leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
}
