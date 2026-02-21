import { brand } from "@/config/brand";

export function HeroSection() {
  const idx = brand.highlight ? brand.title.indexOf(brand.highlight) : -1;
  const before = idx >= 0 ? brand.title.slice(0, idx) : brand.title;
  const highlight = idx >= 0 ? brand.highlight : "";
  const after = idx >= 0 ? brand.title.slice(idx + brand.highlight.length) : "";

  return (
    <section className="max-w-[1024px] mx-auto px-6 mb-24 md:mb-32">
      <div className="max-w-3xl">
        <h1 className="text-4xl md:text-7xl font-extrabold tracking-tight mb-6 leading-[1.15] break-words">
          {before}
          {highlight && (
            <>
              <br className="hidden md:block" />
              <span className="text-primary relative inline-block">
                {highlight}
                <svg
                  className="absolute -bottom-2 left-0 w-full h-3 text-primary/20"
                  preserveAspectRatio="none"
                  viewBox="0 0 100 10"
                >
                  <path
                    d="M0 5 Q 50 10 100 5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="8"
                  />
                </svg>
              </span>
            </>
          )}
          {after}
        </h1>
        <p className="text-xl md:text-2xl text-muted-foreground font-normal leading-relaxed max-w-2xl">
          {brand.description}
        </p>
      </div>
    </section>
  );
}
