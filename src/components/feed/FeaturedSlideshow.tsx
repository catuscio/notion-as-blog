"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { CategoryBadge } from "@/components/common/CategoryBadge";
import { brand } from "@/config/brand";
import { copy } from "@/config/copy";
import type { ContentItem } from "@/types";

const INTERVAL_MS = brand.slideshow.intervalMs;
const SWIPE_THRESHOLD_PX = 50;

type Direction = "next" | "prev";

export function FeaturedSlideshow({ posts }: { posts: ContentItem[] }) {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState<Direction>("next");
  const [isAnimating, setIsAnimating] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [touching, setTouching] = useState(false);

  const total = posts.length;

  const goTo = useCallback(
    (index: number, dir: Direction) => {
      if (isAnimating || index === current) return;
      setDirection(dir);
      setIsAnimating(!window.matchMedia("(prefers-reduced-motion: reduce)").matches);
      setCurrent(index);
    },
    [isAnimating, current]
  );

  const next = useCallback(() => {
    goTo((current + 1) % total, "next");
  }, [current, total, goTo]);

  const prev = useCallback(() => {
    goTo((current - 1 + total) % total, "prev");
  }, [current, total, goTo]);

  useEffect(() => {
    if (hovered || focused || touching || total <= 1) return;
    const id = setInterval(next, INTERVAL_MS);
    return () => clearInterval(id);
  }, [hovered, focused, touching, next, total]);

  /* ── Touch swipe ── */
  const touchRef = useRef<{ x: number; y: number } | null>(null);

  const onTouchStart = useCallback(
    (e: React.TouchEvent) => {
      touchRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      setTouching(true);
    },
    []
  );

  const onTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      if (touchRef.current) {
        const dx = e.changedTouches[0].clientX - touchRef.current.x;
        const dy = e.changedTouches[0].clientY - touchRef.current.y;
        touchRef.current = null;
        if (Math.abs(dx) >= SWIPE_THRESHOLD_PX && Math.abs(dx) > Math.abs(dy)) {
          if (dx < 0) { next(); } else { prev(); }
        }
      }
      setTouching(false);
    },
    [next, prev]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        prev();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        next();
      }
    },
    [prev, next]
  );

  if (total === 0) return null;

  const arrowClassName =
    "absolute top-4 md:top-1/2 md:-translate-y-1/2 z-10 w-10 h-10 rounded-full bg-black/50 hover:bg-black/70 backdrop-blur text-white flex items-center justify-center opacity-100 md:opacity-0 md:group-hover:opacity-100 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white transition-opacity duration-300";

  const slideClass = (i: number) => {
    if (i === current) {
      return "translate-x-0 opacity-100 pointer-events-auto";
    }
    if (direction === "next") {
      return "translate-x-full opacity-0 pointer-events-none";
    }
    return "-translate-x-full opacity-0 pointer-events-none";
  };

  return (
    <section
      className="sg-content-limiter mb-20 md:mb-28"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocusCapture={() => setFocused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false);
      }}
    >
      <div
        role="region"
        aria-roledescription="carousel"
        aria-label={copy.aria.featuredPosts}
        tabIndex={0}
        onKeyDown={handleKeyDown}
        className="group relative w-full min-h-80 md:min-h-0 md:aspect-[5/2] rounded-2xl overflow-hidden bg-muted outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {/* Slides */}
        {posts.map((p, i) => (
          <Link
            key={p.id}
            href={`/${p.slug}`}
            aria-hidden={i !== current}
            tabIndex={i !== current ? -1 : undefined}
            className={`absolute inset-0 transition-[transform,opacity] duration-500 ease-in-out motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white ${slideClass(i)}`}
            onTransitionEnd={() => setIsAnimating(false)}
          >
            {/* Thumbnail */}
            {p.thumbnail ? (
              <Image
                src={p.thumbnail}
                alt={p.title}
                fill
                sizes="(max-width: 1024px) calc(100vw - 48px), 1024px"
                className="object-cover"
                loading={i === 0 ? "eager" : "lazy"}
                fetchPriority={i === 0 ? "high" : "auto"}
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5" />
            )}

            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-black/10" />

            {/* Text content */}
            <div className="absolute bottom-0 left-0 right-0 p-6 pb-10 md:p-10 text-white">
              <div className="flex items-center gap-3 mb-3">
                {p.category && <CategoryBadge category={p.category} />}
              </div>
              <h2 className="text-xl md:text-4xl font-semibold mb-2 leading-snug drop-shadow-lg line-clamp-3 md:line-clamp-2">
                {p.title}
              </h2>
              {p.summary && (
                <p className="text-sm md:text-base text-white/80 line-clamp-3 md:line-clamp-2 max-w-2xl drop-shadow">
                  {p.summary}
                </p>
              )}
            </div>
          </Link>
        ))}

        {/* Prev / Next arrows */}
        {total > 1 && (
          <>
            <button
              type="button"
              onClick={(e) => { e.preventDefault(); prev(); }}
              className={`${arrowClassName} right-14 md:right-auto md:left-3`}
              aria-label={copy.aria.previousSlide}
            >
              <ChevronLeft size={20} />
            </button>
            <button
              type="button"
              onClick={(e) => { e.preventDefault(); next(); }}
              className={`${arrowClassName} right-3`}
              aria-label={copy.aria.nextSlide}
            >
              <ChevronRight size={20} />
            </button>
          </>
        )}

        {/* Indicators */}
        {total > 1 && (
          <div className="absolute bottom-1 left-1/2 -translate-x-1/2 z-10 flex opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300">
            {posts.map((p, i) => (
              <button
                key={p.id}
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  goTo(i, i > current ? "next" : "prev");
                }}
                className="w-8 h-6 flex items-center justify-center rounded-full"
                aria-label={copy.aria.goToSlide(i + 1)}
              >
                <span
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === current
                      ? "w-8 bg-white"
                      : "w-4 bg-white/40 group-hover:bg-white/60"
                  }`}
                />
              </button>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
