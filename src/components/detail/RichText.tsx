import Link from "next/link";
import type { NotionRichText } from "@/lib/notion/types";

export function RichText({ richText }: { richText: NotionRichText[] }) {
  if (!richText || richText.length === 0) return null;

  return (
    <>
      {richText.map((t, i) => {
        let node: React.ReactNode = t.plain_text;
        const { bold, italic, strikethrough, underline, code, color } =
          t.annotations;

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

        const colorClass =
          color !== "default"
            ? color.endsWith("_background")
              ? `notion-bg-${color.replace("_background", "")}`
              : `notion-color-${color}`
            : undefined;

        if (colorClass) {
          node = <span className={colorClass}>{node}</span>;
        }

        if (t.href) {
          const isInternal =
            t.href.startsWith("/") ||
            (typeof window !== "undefined" && t.href.startsWith(window.location.origin));

          if (isInternal) {
            const href = t.href.startsWith("/")
              ? t.href
              : new URL(t.href).pathname;
            node = (
              <Link
                href={href}
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
