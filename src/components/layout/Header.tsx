import Link from "next/link";
import { brand } from "@/config/brand";
import { copy } from "@/config/copy";
import { BrandLogo } from "@/components/common/BrandLogo";
import { ThemeToggle } from "@/components/common/ThemeToggle";
import { HeaderNav } from "./HeaderNav";

export function Header({ showAbout }: { showAbout: boolean }) {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/85 backdrop-blur-md transition-colors duration-[var(--motion-standard)]">
      <div className="sg-content-limiter flex h-16 items-center justify-between">
        <Link
          href="/"
          className="group flex shrink-0 items-center gap-2 rounded-lg ui-focus-ring"
        >
          {brand.logo.image && <BrandLogo size={32} />}
          <span className={`text-xl font-bold tracking-tight ${brand.logo.image && !brand.logo.showNameWithLogo ? "sr-only" : ""}`}>
            {brand.name}
          </span>
        </Link>
        <div className="flex items-center gap-3 md:gap-4 shrink-0">
          <HeaderNav aboutLabel={copy.footer.about} categories={brand.categories} showAbout={showAbout} />
          {showAbout && (
            <Link
              href="/about"
              className="md:hidden rounded-full px-3 py-1.5 text-sm font-semibold text-muted-foreground ui-nav-link"
            >
              {copy.footer.about}
            </Link>
          )}
          <ThemeToggle />
          {brand.newsletter.enabled && (
            <Link
              href="#subscribe"
              className="hidden md:flex bg-primary hover:bg-primary/90 text-primary-foreground px-5 py-2 rounded-3xl text-sm font-semibold transition-transform active:scale-95 duration-[var(--motion-standard)] shadow-sm"
            >
              {brand.newsletter.cta}
            </Link>
          )}
        </div>
      </div>
      <div className="sg-content-limiter pb-3 md:hidden">
        <HeaderNav aboutLabel={copy.footer.about} categories={brand.categories} showAbout={showAbout} mobile />
      </div>
    </header>
  );
}
