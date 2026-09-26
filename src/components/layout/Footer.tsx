import Link from "next/link";
import { brand } from "@/config/brand";
import { copy } from "@/config/copy";
import { BrandLogo } from "@/components/common/BrandLogo";
import { socialIconMap } from "./SocialIcons";

export function Footer({ showAbout }: { showAbout: boolean }) {
  return (
    <footer className="border-t border-border bg-background">
      <div className="sg-content-limiter py-12">
        <div className="grid items-center gap-6 md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)]">
          <div className="flex items-center gap-2 justify-self-center md:justify-self-start">
            {brand.logo.image && <BrandLogo size={24} />}
            <span className={`text-lg font-bold ${brand.logo.image && !brand.logo.showNameWithLogo ? "sr-only" : ""}`}>
              {brand.name}
            </span>
          </div>
          <div className="sg-cluster justify-center justify-self-center text-sm font-medium text-muted-foreground [--cluster-gap:var(--space-6)]">
            <Link href="/" className="rounded ui-nav-link">
              {copy.footer.home}
            </Link>
            {showAbout && (
              <Link href="/about" className="rounded ui-nav-link">
                {copy.footer.about}
              </Link>
            )}
            <a
              href={brand.templateUrl}
              className="rounded ui-nav-link"
              target="_blank"
              rel="noopener noreferrer"
            >
              {copy.footer.template}
            </a>
          </div>
          <div className="sg-cluster justify-center justify-self-center md:justify-self-end [--cluster-gap:var(--space-3)]">
            {socialIconMap.map(({ key, label, icon }) => {
              const url = brand.social[key];
              if (!url) return null;
              return (
                <a
                  key={key}
                  href={url}
                  aria-label={label}
                  data-social={key}
                  className="social-link rounded text-muted-foreground transition-colors ui-focus-ring"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {icon}
                </a>
              );
            })}
          </div>
        </div>
        <div className="text-center mt-8 text-sm text-muted-foreground">
          &copy; {brand.since} {brand.name}. {copy.copyright}
        </div>
      </div>
    </footer>
  );
}
