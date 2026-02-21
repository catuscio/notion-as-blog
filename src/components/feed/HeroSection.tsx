import { Fragment } from "react";
import { brand } from "@/config/brand";

/** Splits text on `\n` and joins with <br /> */
function Multiline({ text }: { text: string }) {
  const parts = text.split("\n");
  return parts.map((part, i) => (
    <Fragment key={i}>
      {i > 0 && <br />}
      {part}
    </Fragment>
  ));
}

export function HeroSection() {
  const title = brand.title;
  const idx = brand.highlight ? title.indexOf(brand.highlight) : -1;
  const before = idx >= 0 ? title.slice(0, idx) : title;
  const highlight = idx >= 0 ? brand.highlight : "";
  const after = idx >= 0 ? title.slice(idx + brand.highlight.length) : "";

  return (
    <section className="max-w-[1024px] mx-auto px-6 mb-24 md:mb-32">
      <div className="max-w-3xl">
        <h1 className="text-4xl md:text-7xl font-extrabold tracking-tight mb-6 leading-[1.15] break-words">
          <Multiline text={before} />
          {highlight && (
            <>
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
          <Multiline text={after} />
        </h1>
        <p className="text-xl md:text-2xl text-muted-foreground font-normal leading-relaxed max-w-2xl">
          <Multiline text={brand.description} />
        </p>
      </div>
    </section>
  );
}
