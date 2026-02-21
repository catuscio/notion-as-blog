"use client";

import { type ReactNode, useRef, useEffect, useLayoutEffect } from "react";

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

export function AnimatedReveal({
  children,
  delay = 0,
}: {
  children: ReactNode;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Hide synchronously before paint (not in SSR HTML)
    el.style.opacity = "0";
    el.style.transform = "translateY(24px)";

    // Reveal after delay
    const timer = setTimeout(() => {
      el.style.transition = "opacity 600ms ease-out, transform 600ms ease-out";
      el.style.opacity = "1";
      el.style.transform = "translateY(0)";
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  return <div ref={ref}>{children}</div>;
}
