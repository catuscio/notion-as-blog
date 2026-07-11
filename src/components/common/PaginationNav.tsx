import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getPaginationItems } from "@/lib/pagination";

interface PaginationNavProps {
  totalItems: number;
  currentPage: number;
  itemsPerPage?: number;
  getPageHref?: (page: number) => string;
  onNavigate?: () => void;
  scroll?: boolean;
}

const defaultPageHref = (page: number) => (page <= 1 ? "/" : `/page/${page}`);

export function PaginationNav({
  totalItems,
  currentPage,
  itemsPerPage = 10,
  getPageHref = defaultPageHref,
  onNavigate,
  scroll,
}: PaginationNavProps) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  if (totalPages <= 1) return null;

  const items = getPaginationItems(currentPage, totalPages);
  const iconButtonClass = cn(buttonVariants({ variant: "ghost", size: "icon" }));
  const disabledButtonClass = cn(iconButtonClass, "pointer-events-none opacity-50");

  return (
    <nav aria-label="Pagination" className="flex items-center justify-center gap-1 mt-12">
      {currentPage <= 1 ? (
        <span className={disabledButtonClass} aria-label="Previous page" aria-disabled="true">
          <ChevronLeft size={18} />
        </span>
      ) : (
        <Link
          href={getPageHref(currentPage - 1)}
          scroll={scroll}
          onClick={onNavigate}
          className={iconButtonClass}
          aria-label="Previous page"
        >
          <ChevronLeft size={18} />
        </Link>
      )}

      {items.map((item, index) =>
        item === "ellipsis" ? (
          <span
            key={`ellipsis-${index}`}
            className="w-9 h-9 flex items-center justify-center text-muted-foreground select-none"
            aria-hidden="true"
          >
            …
          </span>
        ) : (
          <Link
            key={item}
            href={getPageHref(item)}
            scroll={scroll}
            onClick={onNavigate}
            className={cn(
              buttonVariants({
                variant: item === currentPage ? "default" : "ghost",
                size: "icon",
              }),
            )}
            aria-label={`Page ${item}`}
            aria-current={item === currentPage ? "page" : undefined}
          >
            {item}
          </Link>
        ),
      )}

      {currentPage >= totalPages ? (
        <span className={disabledButtonClass} aria-label="Next page" aria-disabled="true">
          <ChevronRight size={18} />
        </span>
      ) : (
        <Link
          href={getPageHref(currentPage + 1)}
          scroll={scroll}
          onClick={onNavigate}
          className={iconButtonClass}
          aria-label="Next page"
        >
          <ChevronRight size={18} />
        </Link>
      )}
    </nav>
  );
}
