"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { brand } from "@/config/brand";
import { copy } from "@/config/copy";
import { getCategoryFromPath } from "@/lib/getCategoryFromPath";

export function CategoryNav() {
  const pathname = usePathname();

  const isHome = pathname === "/";
  const activeCategory = getCategoryFromPath(pathname);

  return (
    <div className="sticky top-16 z-40 bg-background/95 backdrop-blur-sm border-b border-border shadow-sm">
      <div className="max-w-[1024px] mx-auto px-6 w-full">
        <nav className="flex items-center gap-8 h-12 overflow-x-auto hide-scrollbar">
          <Link
            href="/"
            className={`text-sm font-medium py-4 whitespace-nowrap transition-colors ${
              isHome
                ? "font-bold text-foreground border-b-2 border-foreground"
                : "text-muted-foreground hover:text-foreground border-b-2 border-transparent hover:border-muted-foreground/30"
            }`}
          >
            {copy.footer.home}
          </Link>
          {brand.categories.map((cat) => {
            const isActive = activeCategory === cat.slug;
            return (
              <Link
                key={cat.name}
                href={`/category/${cat.slug}`}
                className={`text-sm font-medium py-4 whitespace-nowrap transition-colors ${
                  isActive
                    ? "font-bold text-foreground border-b-2 border-foreground"
                    : "text-muted-foreground hover:text-foreground border-b-2 border-transparent hover:border-muted-foreground/30"
                }`}
              >
                {cat.name}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
