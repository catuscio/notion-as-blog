"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { getCategoryFromPath } from "@/lib/getCategoryFromPath";

type HeaderNavCategory = {
  name: string;
  slug: string;
};

const navLinkClass = (active: boolean) =>
  `text-sm font-medium whitespace-nowrap transition-colors ${
    active ? "font-bold text-foreground" : "text-muted-foreground hover:text-foreground"
  }`;

export function HeaderNav({
  aboutLabel,
  categories,
}: {
  aboutLabel: string;
  categories: readonly HeaderNavCategory[];
}) {
  const pathname = usePathname();
  const activeCategory = getCategoryFromPath(pathname);

  return (
    <nav className="hidden md:flex items-center gap-5 overflow-x-auto hide-scrollbar">
      <Link href="/about" className={navLinkClass(pathname === "/about")}>
        {aboutLabel}
      </Link>
      {categories.map((cat) => {
        const isActive = activeCategory === cat.slug;
        return (
          <Link
            key={cat.name}
            href={`/category/${cat.slug}`}
            className={navLinkClass(isActive)}
          >
            {cat.name}
          </Link>
        );
      })}
    </nav>
  );
}
