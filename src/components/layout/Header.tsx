"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { brand } from "@/config/brand";
import { ThemeToggle } from "@/components/common/ThemeToggle";

const navLinkClass = (active: boolean) =>
  `text-sm font-medium whitespace-nowrap transition-colors ${
    active ? "font-bold text-foreground" : "text-muted-foreground hover:text-foreground"
  }`;

export function Header() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const activeCategory = pathname.startsWith("/category/")
    ? decodeURIComponent(pathname.split("/category/")[1])
    : null;

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border transition-all duration-200">
      <div className="max-w-[1024px] mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group shrink-0">
          <div className="w-8 h-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center transition-transform group-hover:scale-95 duration-200">
            <span className="material-symbols-outlined text-[20px] font-bold">
              {brand.logo.icon}
            </span>
          </div>
          <span className="text-xl font-bold tracking-tight">
            {brand.name}
          </span>
        </Link>
        <div className="flex items-center gap-4 shrink-0">
          <nav className="hidden md:flex items-center gap-5 overflow-x-auto hide-scrollbar">
            <Link href="/" className={navLinkClass(isHome)}>
              Home
            </Link>
            <Link href="/about" className={navLinkClass(pathname === "/about")}>
              About
            </Link>
            {brand.categories.map((cat) => {
              const isActive =
                activeCategory?.toLowerCase() === cat.name.toLowerCase();
              return (
                <Link
                  key={cat.name}
                  href={`/category/${encodeURIComponent(cat.name)}`}
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
              Subscribe
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
