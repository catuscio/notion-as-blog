"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { CategoryBadge } from "@/components/common/CategoryBadge";
import { brand } from "@/config/brand";
import { copy } from "@/config/copy";
import type { Post } from "@/types";

const INTERVAL_MS = brand.slideshow.intervalMs;
const SWIPE_THRESHOLD_PX = 50;

type Direction = "next" | "prev";

export function FeaturedSlideshow({ posts }: { posts: Post[] }) {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState<Direction>("next");
  const [isAnimating, setIsAnimating] = useState(false);
  const [paused, setPaused] = useState(false);

  const total = posts.length;

  const goTo = useCallback(
    (index: number, dir: Direction) => {
      if (isAnimating || index === current) return;
      setDirection(dir);
      setIsAnimating(true);
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
    if (paused || total <= 1) return;
    const id = setInterval(next, INTERVAL_MS);
    return () => clearInterval(id);
  }, [paused, next, total]);

  /* ── Touch swipe ── */
  const touchRef = useRef<{ x: number; y: number } | null>(null);

  const onTouchStart = useCallback(
    (e: React.TouchEvent) => {
      touchRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      setPaused(true);
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
      setPaused(false);
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
    "absolute top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-black/30 hover:bg-black/50 backdrop-blur text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300";

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
      className="max-w-[1024px] mx-auto px-6 mb-24 md:mb-32"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div
        role="region"
        aria-roledescription="carousel"
        aria-label={copy.aria.featuredPosts}
        tabIndex={0}
        onKeyDown={handleKeyDown}
        className="group relative w-full aspect-[2/1] md:aspect-[5/2] rounded-2xl overflow-hidden bg-muted outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
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
            className={`absolute inset-0 transition-all duration-500 ease-in-out ${slideClass(i)}`}
            onTransitionEnd={() => setIsAnimating(false)}
          >
            {/* Thumbnail */}
            {p.thumbnail ? (
              <Image
                src={p.thumbnail}
                alt={p.title}
                fill
                sizes="(max-width: 1024px) 100vw, 1024px"
                className="object-cover"
                priority={i === 0}
                {...(p.blurDataURL ? { placeholder: "blur" as const, blurDataURL: p.blurDataURL } : {})}
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5" />
            )}

            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

            {/* Text content */}
            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 text-white">
              <div className="flex items-center gap-3 mb-3">
                {p.category && <CategoryBadge category={p.category} />}
              </div>
              <h2 className="text-xl md:text-4xl font-semibold mb-2 leading-snug drop-shadow-lg line-clamp-2">
                {p.title}
              </h2>
              {p.summary && (
                <p className="text-sm md:text-base text-white/80 line-clamp-2 max-w-2xl drop-shadow">
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
              className={`${arrowClassName} left-3`}
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
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 flex gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300">
            {posts.map((p, i) => (
              <button
                key={p.id}
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  goTo(i, i > current ? "next" : "prev");
                }}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === current
                    ? "w-8 bg-white"
                    : "w-4 bg-white/40 hover:bg-white/60"
                }`}
                aria-label={copy.aria.goToSlide(i + 1)}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
