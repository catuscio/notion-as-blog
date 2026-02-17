"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { CategoryBadge } from "@/components/common/CategoryBadge";
import type { TPost } from "@/types";

const INTERVAL_MS = 5000;

export function FeaturedSlideshow({ posts }: { posts: TPost[] }) {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);

  const total = posts.length;

  const next = useCallback(() => {
    setCurrent((i) => (i + 1) % total);
  }, [total]);

  const prev = useCallback(() => {
    setCurrent((i) => (i - 1 + total) % total);
  }, [total]);

  useEffect(() => {
    if (paused || total <= 1) return;
    const id = setInterval(next, INTERVAL_MS);
    return () => clearInterval(id);
  }, [paused, next, total]);

  if (total === 0) return null;

  return (
    <section
      className="max-w-[1024px] mx-auto px-6 mb-24 md:mb-32"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="group relative w-full aspect-[2/1] md:aspect-[5/2] rounded-2xl overflow-hidden bg-muted">
        {/* Slides */}
        {posts.map((p, i) => (
          <Link
            key={p.id}
            href={`/${p.slug}`}
            aria-hidden={i !== current}
            className={`absolute inset-0 transition-opacity duration-700 ${
              i === current
                ? "opacity-100 pointer-events-auto"
                : "opacity-0 pointer-events-none"
            }`}
          >
            {/* Thumbnail */}
            {p.thumbnail ? (
              <Image
                src={p.thumbnail}
                alt={p.title}
                fill
                className="object-cover"
                priority={i === 0}
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
              <h2 className="text-xl md:text-4xl font-bold mb-2 leading-tight drop-shadow-lg line-clamp-2">
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
              onClick={(e) => {
                e.preventDefault();
                prev();
              }}
              className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-black/30 hover:bg-black/50 backdrop-blur text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300"
              aria-label="Previous slide"
            >
              <span className="material-symbols-outlined text-[20px]">
                chevron_left
              </span>
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                next();
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-black/30 hover:bg-black/50 backdrop-blur text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300"
              aria-label="Next slide"
            >
              <span className="material-symbols-outlined text-[20px]">
                chevron_right
              </span>
            </button>
          </>
        )}

        {/* Indicators */}
        {total > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            {posts.map((p, i) => (
              <button
                key={p.id}
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  setCurrent(i);
                }}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === current
                    ? "w-8 bg-white"
                    : "w-4 bg-white/40 hover:bg-white/60"
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
