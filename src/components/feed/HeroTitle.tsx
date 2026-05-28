"use client";

import { Fragment, useEffect, useState } from "react";
import { useMounted } from "@/hooks/useMounted";

function Multiline({ text }: { text: string }) {
  return text.split("\n").map((part, i) => (
    <Fragment key={i}>
      {i > 0 && <br />}
      {part}
    </Fragment>
  ));
}

function PartialMultiline({ text, show }: { text: string; show: number }) {
  return text.slice(0, show).split("\n").map((part, i) => (
    <Fragment key={i}>
      {i > 0 && <br />}
      {part}
    </Fragment>
  ));
}

const SPEED = 40;

export function HeroTitle({
  title,
  highlight,
}: {
  title: string;
  highlight: string;
}) {
  const idx = highlight ? title.indexOf(highlight) : -1;
  const before = idx >= 0 ? title.slice(0, idx) : title;
  const highlightText = idx >= 0 ? highlight : "";
  const after = idx >= 0 ? title.slice(idx + highlight.length) : "";
  const totalLen = before.length + highlightText.length + after.length;

  const mounted = useMounted();
  const [charIndex, setCharIndex] = useState(0);
  const typingDone = charIndex >= totalLen;

  useEffect(() => {
    if (!mounted || typingDone) return;
    const timer = setTimeout(() => setCharIndex((i) => i + 1), SPEED);
    return () => clearTimeout(timer);
  }, [mounted, charIndex, typingDone]);

  const beforeShow = Math.min(charIndex, before.length);
  const highlightShow = Math.min(
    Math.max(charIndex - before.length, 0),
    highlightText.length,
  );
  const afterShow = Math.min(
    Math.max(charIndex - before.length - highlightText.length, 0),
    after.length,
  );

  const staticTitle = (
    <>
      <Multiline text={before} />
      {highlightText && (
        <span className="text-primary relative inline-block">
          {highlightText}
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

  if (!mounted || typingDone) return staticTitle;

  return (
    <>
      <span aria-hidden="true">
        <PartialMultiline text={before} show={beforeShow} />
        {highlightShow > 0 && (
          <span className="text-primary relative inline-block">
            <PartialMultiline text={highlightText} show={highlightShow} />
            {highlightShow === highlightText.length && (
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
}
