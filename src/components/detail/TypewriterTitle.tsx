"use client";

import { useState, useEffect } from "react";
import { useMounted } from "@/hooks/useMounted";

export function TypewriterTitle({
  text,
  className,
  speed = 40,
}: {
  text: string;
  className?: string;
  speed?: number;
}) {
  const mounted = useMounted();
  const [charIndex, setCharIndex] = useState(0);
  const done = charIndex >= text.length;

  useEffect(() => {
    if (!mounted || done) return;
    const timer = setTimeout(() => setCharIndex((i) => i + 1), speed);
    return () => clearTimeout(timer);
  }, [mounted, charIndex, done, speed, text.length]);

  if (!mounted) {
    return <span className={className}>{text}</span>;
  }

  return (
    <span className={className}>
      <span aria-hidden="true">
        {text.slice(0, charIndex)}
        {!done && (
          <span className="border-r-2 border-current animate-pulse" />
        )}
      </span>
      <span className="sr-only">{text}</span>
    </span>
  );
}
