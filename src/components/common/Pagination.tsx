"use client";

import { useCallback } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";

interface PaginationProps {
  totalItems: number;
  itemsPerPage?: number;
  currentPage: number;
}

function getPageNumbers(current: number, total: number): (number | "...")[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const pages: (number | "...")[] = [1];

  if (current > 3) {
    pages.push("...");
  }

  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  if (current < total - 2) {
    pages.push("...");
  }

  pages.push(total);

  return pages;
}

export function Pagination({
  totalItems,
  itemsPerPage = 10,
  currentPage,
}: PaginationProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const navigate = useCallback(
    (page: number) => {
      const params = new URLSearchParams(searchParams.toString());
      if (page <= 1) {
        params.delete("page");
      } else {
        params.set("page", String(page));
      }
      const qs = params.toString();
      router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
      // scroll to top of the post list
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    [router, pathname, searchParams]
  );

  if (totalPages <= 1) return null;

  const pages = getPageNumbers(currentPage, totalPages);

  return (
    <nav
      aria-label="Pagination"
      className="flex items-center justify-center gap-1 mt-12"
    >
      <Button
        variant="ghost"
        size="icon"
        onClick={() => navigate(currentPage - 1)}
        disabled={currentPage <= 1}
        aria-label="Previous page"
      >
        <span className="material-symbols-outlined text-lg">chevron_left</span>
      </Button>

      {pages.map((page, i) =>
        page === "..." ? (
          <span
            key={`ellipsis-${i}`}
            className="w-9 h-9 flex items-center justify-center text-muted-foreground select-none"
          >
            ...
          </span>
        ) : (
          <Button
            key={page}
            variant={page === currentPage ? "default" : "ghost"}
            size="icon"
            onClick={() => navigate(page)}
            aria-label={`Page ${page}`}
            aria-current={page === currentPage ? "page" : undefined}
          >
            {page}
          </Button>
        )
      )}

      <Button
        variant="ghost"
        size="icon"
        onClick={() => navigate(currentPage + 1)}
        disabled={currentPage >= totalPages}
        aria-label="Next page"
      >
        <span className="material-symbols-outlined text-lg">
          chevron_right
        </span>
      </Button>
    </nav>
  );
}
