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
    <section className="max-w-[1024px] mx-auto px-6 mb-24 md:mb-32">
      <div className="max-w-3xl">
        <h1 className="text-4xl md:text-7xl font-extrabold tracking-tight mb-6 leading-[1.15] break-words">
          <HeroTitle title={brand.title} highlight={brand.highlight} />
        </h1>
        <p className="text-xl md:text-2xl text-muted-foreground font-normal leading-relaxed max-w-2xl">
          <Multiline text={brand.description} />
        </p>
      </div>
    </section>
  );
}
