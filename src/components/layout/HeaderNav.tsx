"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { getCategoryFromPath } from "@/lib/getCategoryFromPath";

type HeaderNavCategory = {
  name: string;
  slug: string;
};

const navLinkClass = (active: boolean) =>
  `rounded text-sm font-medium whitespace-nowrap ui-nav-link ${
    active ? "font-bold text-foreground" : "text-muted-foreground"
  }`;

export function HeaderNav({
  aboutLabel,
  categories,
  showAbout,
  mobile = false,
}: {
  aboutLabel: string;
  categories: readonly HeaderNavCategory[];
  showAbout: boolean;
  mobile?: boolean;
}) {
  const pathname = usePathname();
  const activeCategory = getCategoryFromPath(pathname);

  return (
    <nav aria-label={mobile ? "Categories" : "Main navigation"} className={`${mobile ? "flex md:hidden" : "hidden md:flex"} min-w-0 items-center gap-[var(--nav-gap)] overflow-x-auto hide-scrollbar`}>
      {showAbout && !mobile && (
        <Link href="/about" className={navLinkClass(pathname === "/about")}>
          {aboutLabel}
        </Link>
      )}
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
