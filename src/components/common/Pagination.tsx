"use client";

import Link from "next/link";
import { useSearchParams, usePathname } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  function buildPageHref(page: number) {
    const params = new URLSearchParams(searchParams.toString());
    if (page <= 1) {
      params.delete("page");
    } else {
      params.set("page", String(page));
    }
    const qs = params.toString();
    return qs ? `${pathname}?${qs}` : pathname;
  }

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  if (totalPages <= 1) return null;

  const pages = getPageNumbers(currentPage, totalPages);

  return (
    <nav
      aria-label="Pagination"
      className="flex items-center justify-center gap-1 mt-12"
    >
      {currentPage <= 1 ? (
        <span
          className={cn(
            buttonVariants({ variant: "ghost", size: "icon" }),
            "pointer-events-none opacity-50"
          )}
          aria-label="Previous page"
        >
          <ChevronLeft size={18} />
        </span>
      ) : (
        <Link
          href={buildPageHref(currentPage - 1)}
          scroll={false}
          onClick={scrollToTop}
          className={cn(buttonVariants({ variant: "ghost", size: "icon" }))}
          aria-label="Previous page"
        >
          <ChevronLeft size={18} />
        </Link>
      )}

      {pages.map((page, i) =>
        page === "..." ? (
          <span
            key={`ellipsis-${i}`}
            className="w-9 h-9 flex items-center justify-center text-muted-foreground select-none"
          >
            ...
          </span>
        ) : (
          <Link
            key={page}
            href={buildPageHref(page)}
            scroll={false}
            onClick={scrollToTop}
            className={cn(
              buttonVariants({
                variant: page === currentPage ? "default" : "ghost",
                size: "icon",
              })
            )}
            aria-label={`Page ${page}`}
            aria-current={page === currentPage ? "page" : undefined}
          >
            {page}
          </Link>
        )
      )}

      {currentPage >= totalPages ? (
        <span
          className={cn(
            buttonVariants({ variant: "ghost", size: "icon" }),
            "pointer-events-none opacity-50"
          )}
          aria-label="Next page"
        >
          <ChevronRight size={18} />
        </span>
      ) : (
        <Link
          href={buildPageHref(currentPage + 1)}
          scroll={false}
          onClick={scrollToTop}
          className={cn(buttonVariants({ variant: "ghost", size: "icon" }))}
          aria-label="Next page"
        >
          <ChevronRight size={18} />
        </Link>
      )}
    </nav>
  );
}
