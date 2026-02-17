"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";

interface TocItem {
  id: string;
  text: string;
  level: number;
}

const TAG_LEVEL: Record<string, number> = { H1: 1, H2: 2, H3: 3 };
const INDENT: Record<number, string> = { 1: "pl-4", 2: "pl-4", 3: "pl-8" };

function collectHeadings(prose: Element): TocItem[] {
  const elements = prose.querySelectorAll("h1, h2, h3");
  const items: TocItem[] = [];
  const usedIds = new Set<string>();

  elements.forEach((el, idx) => {
    let id = el.id;
    if (!id) {
      id =
        el.textContent
          ?.trim()
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^\p{L}\p{N}_-]/gu, "") || "";
    }
    if (!id) id = `heading-${idx}`;
    let uniqueId = id;
    let counter = 1;
    while (usedIds.has(uniqueId)) {
      uniqueId = `${id}-${counter++}`;
    }
    usedIds.add(uniqueId);
    el.id = uniqueId;

    const level = TAG_LEVEL[el.tagName] ?? 3;
    items.push({ id: uniqueId, text: el.textContent || "", level });
  });

  return items;
}

const emptyHeadings: TocItem[] = [];

function useHeadings() {
  const listenersRef = useRef(new Set<() => void>());
  const headingsRef = useRef<TocItem[]>(emptyHeadings);

  const subscribe = useCallback((callback: () => void) => {
    listenersRef.current.add(callback);

    const prose = document.querySelector("article .prose");
    if (prose) {
      headingsRef.current = collectHeadings(prose);

      const observer = new MutationObserver(() => {
        headingsRef.current = collectHeadings(prose);
        listenersRef.current.forEach((cb) => cb());
      });
      observer.observe(prose, { childList: true, subtree: true });

      return () => {
        listenersRef.current.delete(callback);
        observer.disconnect();
      };
    }

    return () => {
      listenersRef.current.delete(callback);
    };
  }, []);

  const getSnapshot = () => headingsRef.current;
  const getServerSnapshot = () => emptyHeadings;

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export function TableOfContents() {
  const headings = useHeadings();
  const [activeId, setActiveId] = useState("");

  useEffect(() => {
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        }
      },
      { rootMargin: "-80px 0px -80% 0px" }
    );

    headings.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [headings]);

  if (headings.length === 0) return null;

  return (
    <div className="flex flex-col">
      <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-4">
        On this page
      </h4>
      <nav className="flex flex-col gap-3 relative border-l border-border">
        {headings.map((h) => (
          <a
            key={h.id}
            href={`#${h.id}`}
            className={`${INDENT[h.level] ?? "pl-4"} text-sm font-medium transition-colors block ${
              activeId === h.id
                ? "text-primary border-l-2 border-primary -ml-px"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {h.text}
          </a>
        ))}
      </nav>
    </div>
  );
}
