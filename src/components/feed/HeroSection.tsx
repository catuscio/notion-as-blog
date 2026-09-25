import { Fragment } from "react";
import { brand } from "@/config/brand";
import { HeroTitle } from "./HeroTitle";

function Multiline({ text }: { text: string }) {
  return text.split("\n").map((part, i) => (
    <Fragment key={i}>
      {i > 0 && <br />}
      {part}
    </Fragment>
  ));
}

export function HeroSection() {
  return (
    <section className="sg-content-limiter mb-20 grid min-h-[42dvh] items-center md:mb-28">
      <div className="sg-stack max-w-3xl [--stack-gap:var(--space-6)]">
        <h1 className="text-4xl font-extrabold leading-[1.08] tracking-tight text-balance md:text-7xl">
          <HeroTitle title={brand.title} highlight={brand.highlight} />
        </h1>
        <p className="max-w-2xl text-xl font-normal leading-relaxed text-muted-foreground md:text-2xl">
          <Multiline text={brand.description} />
        </p>
      </div>
    </section>
  );
}
