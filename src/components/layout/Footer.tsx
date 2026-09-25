import Link from "next/link";
import { brand } from "@/config/brand";
import { copy } from "@/config/copy";
import { BrandLogo } from "@/components/common/BrandLogo";
import { socialIconMap } from "./SocialIcons";

export function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="sg-content-limiter py-12">
        <div className="sg-cluster justify-between [--cluster-gap:var(--space-6)]">
          <div className="flex items-center gap-2">
            {brand.logo.image && <BrandLogo size={24} />}
            <span className={`text-lg font-bold ${brand.logo.image && !brand.logo.showNameWithLogo ? "sr-only" : ""}`}>
              {brand.name}
            </span>
          </div>
          <div className="sg-cluster text-sm font-medium text-muted-foreground [--cluster-gap:var(--space-6)]">
            <Link href="/" className="hover:text-primary transition-colors">
              {copy.footer.home}
            </Link>
            <Link href="/about" className="hover:text-primary transition-colors">
              {copy.footer.about}
            </Link>
            <a
              href={brand.templateUrl}
              className="hover:text-primary transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              {copy.footer.template}
            </a>
          </div>
          <div className="sg-cluster [--cluster-gap:var(--space-3)]">
            {socialIconMap.map(({ key, label, icon }) => {
              const url = brand.social[key];
              if (!url) return null;
              return (
                <a
                  key={key}
                  href={url}
                  aria-label={label}
                  className="text-muted-foreground hover:text-foreground transition-colors"
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
