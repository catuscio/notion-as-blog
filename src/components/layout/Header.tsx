"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { brand } from "@/config/brand";
import { copy } from "@/config/copy";
import { BrandLogo } from "@/components/common/BrandLogo";
import { ThemeToggle } from "@/components/common/ThemeToggle";
import { getCategoryFromPath } from "@/lib/getCategoryFromPath";

const navLinkClass = (active: boolean) =>
  `text-sm font-medium whitespace-nowrap transition-colors ${
    active ? "font-bold text-foreground" : "text-muted-foreground hover:text-foreground"
  }`;

export function Header() {
  const pathname = usePathname();
  const activeCategory = getCategoryFromPath(pathname);

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border transition-all duration-200">
      <div className="max-w-[1024px] mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group shrink-0">
          {brand.logo.image && <BrandLogo size={32} />}
          <span className={`text-xl font-bold tracking-tight ${brand.logo.image && !brand.logo.showNameWithLogo ? "sr-only" : ""}`}>
            {brand.name}
          </span>
        </Link>
        <div className="flex items-center gap-4 shrink-0">
          <nav className="hidden md:flex items-center gap-5 overflow-x-auto hide-scrollbar">
            <Link href="/about" className={navLinkClass(pathname === "/about")}>
              {copy.footer.about}
            </Link>
            {brand.categories.map((cat) => {
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
          <ThemeToggle />
          {brand.newsletter.enabled && (
            <Link
              href="#subscribe"
              className="hidden md:flex bg-primary hover:bg-primary/90 text-primary-foreground px-5 py-2 rounded-3xl text-sm font-semibold transition-transform active:scale-95 duration-200 shadow-sm"
            >
              {brand.newsletter.cta}
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
