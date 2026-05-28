import Link from "next/link";
import { brand } from "@/config/brand";
import { copy } from "@/config/copy";
import { BrandLogo } from "@/components/common/BrandLogo";
import { ThemeToggle } from "@/components/common/ThemeToggle";
import { HeaderNav } from "./HeaderNav";

export function Header() {
  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border transition-all duration-200">
      <div className="max-w-[1024px] mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group shrink-0">
          {brand.logo.image && <BrandLogo size={32} />}
          <span className={`text-xl font-bold tracking-tight ${brand.logo.image && !brand.logo.showNameWithLogo ? "sr-only" : ""}`}>
            {brand.name}
          </span>
        </Link>
        <div className="flex items-center gap-3 md:gap-4 shrink-0">
          <HeaderNav aboutLabel={copy.footer.about} categories={brand.categories} />
          <Link
            href="/about"
            className="md:hidden rounded-full px-3 py-1.5 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
          >
            {copy.footer.about}
          </Link>
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
