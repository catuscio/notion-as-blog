import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface StaticPaginationProps {
  totalItems: number;
  itemsPerPage?: number;
  currentPage: number;
  getPageHref?: (page: number) => string;
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

const defaultPageHref = (page: number) => (page <= 1 ? "/" : `/page/${page}`);

export function StaticPagination({
  totalItems,
  itemsPerPage = 10,
  currentPage,
  getPageHref = defaultPageHref,
}: StaticPaginationProps) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
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
          aria-hidden="true"
        >
          <ChevronLeft size={18} />
        </span>
      ) : (
        <Link
          href={getPageHref(currentPage - 1)}
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
            href={getPageHref(page)}
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
          aria-hidden="true"
        >
          <ChevronRight size={18} />
        </span>
      ) : (
        <Link
          href={getPageHref(currentPage + 1)}
          className={cn(buttonVariants({ variant: "ghost", size: "icon" }))}
          aria-label="Next page"
        >
          <ChevronRight size={18} />
        </Link>
      )}
    </nav>
  );
}
