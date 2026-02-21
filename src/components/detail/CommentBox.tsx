"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "next-themes";
import { brand } from "@/config/brand";

export function CommentBox() {
  const ref = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();

  const { repo, repoId, category, categoryId } = brand.giscus;

  useEffect(() => {
    if (!repo || !repoId || !category || !categoryId) return;
    if (!ref.current) return;

    const script = document.createElement("script");
    script.src = brand.giscus.scriptUrl;
    script.async = true;

    const attrs: Record<string, string> = {
      "data-repo": repo,
      "data-repo-id": repoId,
      "data-category": category,
      "data-category-id": categoryId,
      "data-mapping": brand.giscus.mapping,
      "data-strict": brand.giscus.strict,
      "data-reactions-enabled": brand.giscus.reactionsEnabled,
      "data-emit-metadata": brand.giscus.emitMetadata,
      "data-input-position": brand.giscus.inputPosition,
      "data-theme": theme === "dark" ? "dark" : "light",
      "data-lang": brand.lang,
      crossorigin: "anonymous",
    };
    for (const [key, value] of Object.entries(attrs)) {
      script.setAttribute(key, value);
    }

    ref.current.innerHTML = "";
    ref.current.appendChild(script);
  }, [repo, repoId, category, categoryId, theme]);

  if (!repo || !repoId) return null;

  return <div ref={ref} className="mt-12" />;
}
