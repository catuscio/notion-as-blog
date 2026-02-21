"use client";

import { Fragment, useState, useEffect } from "react";
import { brand } from "@/config/brand";
import { useMounted } from "@/hooks/useMounted";

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

/** Renders partial text up to `charIndex` within a segment, with \n → <br /> */
function PartialMultiline({ text, show }: { text: string; show: number }) {
  const visible = text.slice(0, show);
  const parts = visible.split("\n");
  return parts.map((part, i) => (
    <Fragment key={i}>
      {i > 0 && <br />}
      {part}
    </Fragment>
  ));
}

const SPEED = 40;

export function HeroSection() {
  const title = brand.title;
  const idx = brand.highlight ? title.indexOf(brand.highlight) : -1;
  const before = idx >= 0 ? title.slice(0, idx) : title;
  const highlight = idx >= 0 ? brand.highlight : "";
  const after = idx >= 0 ? title.slice(idx + brand.highlight.length) : "";
  const totalLen = before.length + highlight.length + after.length;

  const mounted = useMounted();
  const [charIndex, setCharIndex] = useState(0);
  const typingDone = charIndex >= totalLen;
  useEffect(() => {
    if (!mounted || typingDone) return;
    const timer = setTimeout(() => setCharIndex((i) => i + 1), SPEED);
    return () => clearTimeout(timer);
  }, [mounted, charIndex, typingDone]);

  // How many chars to show in each segment
  const beforeShow = Math.min(charIndex, before.length);
  const highlightShow = Math.min(
    Math.max(charIndex - before.length, 0),
    highlight.length,
  );
  const afterShow = Math.min(
    Math.max(charIndex - before.length - highlight.length, 0),
    after.length,
  );

  const staticTitle = (
    <>
      <Multiline text={before} />
      {highlight && (
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
      )}
      <Multiline text={after} />
    </>
  );

  const animatedTitle = (
    <>
      <span aria-hidden="true">
        <PartialMultiline text={before} show={beforeShow} />
        {highlightShow > 0 && (
          <span className="text-primary relative inline-block">
            <PartialMultiline text={highlight} show={highlightShow} />
            {highlightShow === highlight.length && (
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
            )}
          </span>
        )}
        {afterShow > 0 && <PartialMultiline text={after} show={afterShow} />}
        <span
          className={`inline-block w-[3px] bg-current align-middle ml-0.5${typingDone ? " animate-cursor-blink" : ""}`}
          style={{ height: "1lh" }}
        />
      </span>
      <span className="sr-only">{staticTitle}</span>
    </>
  );

  return (
    <section className="max-w-[1024px] mx-auto px-6 mb-24 md:mb-32">
      <div className="max-w-3xl">
        <h1 className="text-4xl md:text-7xl font-extrabold tracking-tight mb-6 leading-[1.15] break-words">
          {mounted ? animatedTitle : staticTitle}
        </h1>
        <p className="text-xl md:text-2xl text-muted-foreground font-normal leading-relaxed max-w-2xl">
          <Multiline text={brand.description} />
        </p>
      </div>
    </section>
  );
}
