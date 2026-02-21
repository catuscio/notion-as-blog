"use client";

import { type ReactNode, useRef, useEffect, useLayoutEffect } from "react";

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

// Module-level ref count to manage scrollbar hiding across multiple instances
let activeCount = 0;

function lockScroll() {
  activeCount++;
  if (activeCount === 1) {
    document.documentElement.style.overflow = "hidden";
  }
}

function unlockScroll() {
  activeCount--;
  if (activeCount <= 0) {
    activeCount = 0;
    document.documentElement.style.overflow = "";
  }
}

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

    // Hide scrollbar during animation
    lockScroll();

    // Reveal after delay
    const timer = setTimeout(() => {
      el.style.transition = "opacity 600ms ease-out, transform 600ms ease-out";
      el.style.opacity = "1";
      el.style.transform = "translateY(0)";

      // Restore scrollbar after reveal transition finishes
      const onEnd = () => {
        unlockScroll();
        el.removeEventListener("transitionend", onEnd);
      };
      el.addEventListener("transitionend", onEnd, { once: true });
    }, delay);

    return () => {
      clearTimeout(timer);
      unlockScroll();
    };
  }, [delay]);

  return <div ref={ref}>{children}</div>;
}
