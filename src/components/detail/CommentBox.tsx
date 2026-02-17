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
    script.src = "https://giscus.app/client.js";
    script.setAttribute("data-repo", repo);
    script.setAttribute("data-repo-id", repoId);
    script.setAttribute("data-category", category);
    script.setAttribute("data-category-id", categoryId);
    script.setAttribute("data-mapping", "pathname");
    script.setAttribute("data-strict", "0");
    script.setAttribute("data-reactions-enabled", "1");
    script.setAttribute("data-emit-metadata", "0");
    script.setAttribute("data-input-position", "bottom");
    script.setAttribute("data-theme", theme === "dark" ? "dark" : "light");
    script.setAttribute("data-lang", "en");
    script.setAttribute("crossorigin", "anonymous");
    script.async = true;

    ref.current.innerHTML = "";
    ref.current.appendChild(script);
  }, [repo, repoId, category, categoryId, theme]);

  if (!repo || !repoId) return null;

  return <div ref={ref} className="mt-12" />;
}
