"use client";

import dynamic from "next/dynamic";

const SearchInput = dynamic(
  () => import("@/components/common/SearchInput").then((mod) => mod.SearchInput),
  {
    ssr: false,
    loading: () => (
      <div
        aria-hidden="true"
        className="h-9 w-full rounded-full bg-muted"
      />
    ),
  },
);

export function SearchInputLoader() {
  return <SearchInput />;
}
