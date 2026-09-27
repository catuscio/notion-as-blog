"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

function QueryStringSync({ onChange }: { onChange: (query: string) => void }) {
  const searchParams = useSearchParams();
  const query = searchParams.toString();
  useEffect(() => onChange(query), [query, onChange]);
  return null;
}

/** Keep the cached first page renderable while URL controls hydrate separately. */
export function useQueryString() {
  const [query, setQuery] = useState("");
  const searchParams = useMemo(() => new URLSearchParams(query), [query]);
  const querySync = (
    <Suspense fallback={null}>
      <QueryStringSync onChange={setQuery} />
    </Suspense>
  );
  return { searchParams, querySync };
}
