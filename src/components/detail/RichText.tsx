import Link from "next/link";
import { brand } from "@/config/brand";
import { notionColorClass } from "@/lib/notion/colorMap";
import type { NotionRichText } from "@/lib/notion/types";
import { InlineEquation } from "./EquationRenderer";

function toInternalPath(href: string): string | null {
  if (href.startsWith("/")) return href;
  try {
    const url = new URL(href);
    if (url.origin === brand.url) return url.pathname + url.search + url.hash;
  } catch {
    // invalid URL, treat as external
  }
  return null;
}

export function RichText({ richText }: { richText: NotionRichText[] }) {
  if (!richText || richText.length === 0) return null;

  return (
    <>
      {richText.map((t, i) => {
        // Inline equation
        if (t.type === "equation") {
          return <InlineEquation key={i} expression={t.equation.expression} />;
        }

        let node: React.ReactNode = t.plain_text.includes("\n")
          ? t.plain_text.split("\n").map((line, j, arr) => (
              <span key={j}>
                {line}
                {j < arr.length - 1 && <br />}
              </span>
            ))
          : t.plain_text;
        const { bold, italic, strikethrough, underline, code, color } =
          t.annotations ?? {};

        if (code) {
          node = (
            <code className="bg-muted text-primary font-mono px-1.5 py-0.5 rounded text-[0.875em]">
              {node}
            </code>
          );
        }
        if (bold) node = <strong>{node}</strong>;
        if (italic) node = <em>{node}</em>;
        if (strikethrough) node = <s>{node}</s>;
        if (underline) node = <u>{node}</u>;

        const colorCls = notionColorClass(color ?? "default");
        if (colorCls) {
          node = <span className={colorCls}>{node}</span>;
        }

        if (t.href) {
          const internalPath = toInternalPath(t.href);
          if (internalPath) {
            node = (
              <Link
                href={internalPath}
                className="text-primary underline underline-offset-2"
              >
                {node}
              </Link>
            );
          } else {
            node = (
              <a
                href={t.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline underline-offset-2"
              >
                {node}
              </a>
            );
          }
        }

        return <span key={i}>{node}</span>;
      })}
    </>
  );
}
