"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { PaginationNav } from "./PaginationNav";

interface QueryPaginationProps {
  totalItems: number;
  currentPage: number;
  itemsPerPage?: number;
}

export function QueryPagination(props: QueryPaginationProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function getPageHref(page: number) {
    const params = new URLSearchParams(searchParams.toString());
    if (page <= 1) {
      params.delete("page");
    } else {
      params.set("page", String(page));
    }
    const query = params.toString();
    return query ? `${pathname}?${query}` : pathname;
  }

  return (
    <PaginationNav
      {...props}
      getPageHref={getPageHref}
      onNavigate={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      scroll={false}
    />
  );
}
