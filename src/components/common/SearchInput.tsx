"use client";

import { useState, useEffect, useRef, useCallback, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Search, Loader2, SearchX, FileText } from "lucide-react";
import { copy } from "@/config/copy";
import { useSearch } from "./useSearch";
import { useSearchKeyboard } from "./useSearchKeyboard";
import type { Post } from "@/types";

const noop = () => () => {};
const getIsMac = () => navigator.platform.toUpperCase().includes("MAC");
const getServerIsMac = () => false;

export function SearchInput() {
  const router = useRouter();
  const { query, setQuery, results, loading, activeIndex, setActiveIndex } =
    useSearch();
  const [open, setOpen] = useState(false);
  const isMac = useSyncExternalStore(noop, getIsMac, getServerIsMac);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const onOpen = useCallback(() => setOpen(true), []);
  const onClose = useCallback(() => setOpen(false), []);
  const onSelect = useCallback(
    (post: Post) => router.push(`/${post.slug}`),
    [router]
  );

  const { handleInputKeyDown } = useSearchKeyboard({
    inputRef,
    results,
    activeIndex,
    setActiveIndex,
    onOpen,
    onClose,
    onSelect,
  });

  const showDropdown = open && query.trim().length >= 2;

  return (
    <div ref={containerRef} className="relative">
      <div className="flex items-center bg-muted rounded-full px-4 py-2 w-full focus-within:ring-2 focus-within:ring-primary/20 transition-all">
        <Search size={20} className="text-muted-foreground" />
        <input
          ref={inputRef}
          className="bg-transparent border-none text-sm w-full focus:ring-0 placeholder:text-muted-foreground text-foreground ml-2 h-5 p-0 outline-none"
          aria-label={copy.search.placeholder}
          placeholder={copy.search.placeholder}
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
        <div className="absolute top-12 left-0 right-0 md:left-auto md:right-0 md:w-96 max-w-[calc(100vw-3rem)] bg-background border border-border rounded-xl shadow-xl z-50 overflow-hidden">
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
  results: Post[];
  loading: boolean;
  activeIndex: number;
  onClose: () => void;
}) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-8 text-muted-foreground text-sm">
        <Loader2 size={20} className="animate-spin mr-2" />
        {copy.search.searching}
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-muted-foreground text-sm">
        <SearchX size={28} className="mb-2 opacity-50" />
        {copy.search.noResultsShort}
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
            {post.thumbnail ? (
              <Image
                src={post.thumbnail}
                alt={post.title}
                width={40}
                height={40}
                className="w-10 h-10 rounded-lg object-cover shrink-0"
              />
            ) : (
              <FileText size={20} className="mt-0.5 shrink-0 text-muted-foreground" />
            )}
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
                {(post.tags ?? []).slice(0, 2).map((tag) => (
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
