"use client";

import { useEffect, useState, useId } from "react";
import { useTheme } from "next-themes";

interface MermaidRendererProps {
  code: string;
}

export function MermaidRenderer({ code }: MermaidRendererProps) {
  const [svg, setSvg] = useState<string | null>(null);
  const [error, setError] = useState(false);
  const { resolvedTheme } = useTheme();
  const uniqueId = useId().replace(/:/g, "_");

  useEffect(() => {
    let cancelled = false;

    import("mermaid").then(({ default: mermaid }) => {
      if (cancelled) return;

      mermaid.initialize({
        startOnLoad: false,
        securityLevel: "strict",
        theme: resolvedTheme === "dark" ? "dark" : "default",
        fontFamily: "inherit",
      });

      mermaid
        .render(`mermaid${uniqueId}`, code)
        .then(({ svg: rendered }) => {
          if (!cancelled) setSvg(rendered);
        })
        .catch(() => {
          if (!cancelled) setError(true);
        });
    });

    return () => {
      cancelled = true;
    };
  }, [code, resolvedTheme, uniqueId]);

  if (error) {
    return (
      <div className="my-4 rounded-xl border border-border overflow-hidden max-w-[calc(100vw-3rem)]">
        <div className="flex items-center justify-between px-4 py-2 bg-muted border-b border-border">
          <span className="text-xs font-mono text-muted-foreground">
            mermaid
          </span>
        </div>
        <pre className="p-4 overflow-x-auto bg-muted/50">
          <code className="text-sm font-mono leading-relaxed whitespace-pre">
            {code}
          </code>
        </pre>
      </div>
    );
  }

  return (
    <div
      className="my-4 flex justify-center overflow-x-auto max-w-[calc(100vw-3rem)] [&_svg]:max-w-full"
      dangerouslySetInnerHTML={svg ? { __html: svg } : undefined}
    />
  );
}
