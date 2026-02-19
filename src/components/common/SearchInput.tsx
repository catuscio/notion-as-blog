"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSearch } from "./useSearch";
import { useSearchKeyboard } from "./useSearchKeyboard";
import type { TPost } from "@/types";

export function SearchInput() {
  const router = useRouter();
  const { query, setQuery, results, loading, activeIndex, setActiveIndex } =
    useSearch();
  const { inputRef, containerRef, open, setOpen, isMac } =
    useSearchKeyboard();

  function handleInputKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) => Math.min(prev + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) => Math.max(prev - 1, -1));
    } else if (
      e.key === "Enter" &&
      activeIndex >= 0 &&
      results[activeIndex]
    ) {
      e.preventDefault();
      router.push(`/${results[activeIndex].slug}`);
    }
  }

  const showDropdown = open && query.trim().length >= 2;

  return (
    <div ref={containerRef} className="relative">
      <div className="flex items-center bg-muted rounded-full px-4 py-2 w-full focus-within:ring-2 focus-within:ring-primary/20 transition-all">
        <span className="material-symbols-outlined text-muted-foreground text-[20px]">
          search
        </span>
        <input
          ref={inputRef}
          className="bg-transparent border-none text-sm w-full focus:ring-0 placeholder:text-muted-foreground text-foreground ml-2 h-5 p-0 outline-none"
          placeholder="Search articles..."
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={handleInputKeyDown}
        />
        <kbd className="hidden lg:inline-flex text-[10px] text-muted-foreground/60 border border-border rounded px-1.5 py-0.5 ml-1 shrink-0">
          {isMac ? "⌘K" : "Ctrl K"}
        </kbd>
      </div>

      {/* Dropdown results */}
      {showDropdown && (
        <div className="absolute top-12 left-0 right-0 md:right-auto md:w-96 bg-background border border-border rounded-xl shadow-xl z-50 overflow-hidden">
          <div className="max-h-96 overflow-y-auto p-2">
            <SearchResults
              results={results}
              loading={loading}
              activeIndex={activeIndex}
              onClose={() => setOpen(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}

function SearchResults({
  results,
  loading,
  activeIndex,
  onClose,
}: {
  results: TPost[];
  loading: boolean;
  activeIndex: number;
  onClose: () => void;
}) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-8 text-muted-foreground text-sm">
        <span className="material-symbols-outlined animate-spin text-[20px] mr-2">
          progress_activity
        </span>
        Searching...
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-muted-foreground text-sm">
        <span className="material-symbols-outlined text-[28px] mb-2 opacity-50">
          search_off
        </span>
        No results found
      </div>
    );
  }

  return (
    <ul>
      {results.map((post, i) => (
        <li key={post.id}>
          <Link
            href={`/${post.slug}`}
            onClick={onClose}
            className={`flex items-start gap-3 px-3 py-3 rounded-lg transition-colors ${
              i === activeIndex
                ? "bg-primary/10 text-primary"
                : "hover:bg-muted"
            }`}
          >
            <span className="material-symbols-outlined text-[20px] mt-0.5 shrink-0 text-muted-foreground">
              article
            </span>
            <div className="min-w-0">
              <p className="font-semibold text-sm truncate">{post.title}</p>
              {post.summary && (
                <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                  {post.summary}
                </p>
              )}
              <div className="flex items-center gap-2 mt-1">
                {post.category && (
                  <span className="text-[11px] text-muted-foreground/70">
                    {post.category}
                  </span>
                )}
                {post.tags.slice(0, 2).map((tag) => (
                  <span
                    key={tag}
                    className="text-[11px] bg-muted px-1.5 py-0.5 rounded"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
