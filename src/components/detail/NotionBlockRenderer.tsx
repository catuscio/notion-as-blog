import Image from "next/image";
import type { NotionBlockWithChildren, NotionRichText } from "@/lib/notion/types";

/* ------------------------------------------------------------------ */
/*  Rich Text                                                          */
/* ------------------------------------------------------------------ */

function RichText({ richText }: { richText: NotionRichText[] }) {
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

        return <span key={i}>{node}</span>;
      })}
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Block Children                                                     */
/* ------------------------------------------------------------------ */

function BlockChildren({
  blocks,
}: {
  blocks?: NotionBlockWithChildren[];
}) {
  if (!blocks || blocks.length === 0) return null;
  return <NotionBlockRenderer blocks={blocks} />;
}

/* ------------------------------------------------------------------ */
/*  Heading ID helper                                                  */
/* ------------------------------------------------------------------ */

function headingId(richText: NotionRichText[], blockId: string): string {
  const slug = richText
    .map((t) => t.plain_text)
    .join("")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\p{L}\p{N}_-]/gu, "")
    .replace(/^-+|-+$/g, "");
  return slug || `heading-${blockId}`;
}

/* ------------------------------------------------------------------ */
/*  List grouping                                                      */
/* ------------------------------------------------------------------ */

type GroupedItem =
  | { kind: "block"; block: NotionBlockWithChildren }
  | {
      kind: "list";
      listType: "bulleted_list_item" | "numbered_list_item";
      items: NotionBlockWithChildren[];
    };

function groupListItems(blocks: NotionBlockWithChildren[]): GroupedItem[] {
  const groups: GroupedItem[] = [];

  for (const block of blocks) {
    const type = block.type;
    if (type === "bulleted_list_item" || type === "numbered_list_item") {
      const last = groups[groups.length - 1];
      if (last && last.kind === "list" && last.listType === type) {
        last.items.push(block);
      } else {
        groups.push({ kind: "list", listType: type, items: [block] });
      }
    } else {
      groups.push({ kind: "block", block });
    }
  }

  return groups;
}

/* ------------------------------------------------------------------ */
/*  Block components                                                   */
/* ------------------------------------------------------------------ */

function ParagraphBlock({ block }: { block: NotionBlockWithChildren }) {
  if (block.type !== "paragraph") return null;
  return (
    <p className="my-2 leading-relaxed">
      <RichText richText={block.paragraph.rich_text} />
      <BlockChildren blocks={block.children} />
    </p>
  );
}

function HeadingBlock({ block }: { block: NotionBlockWithChildren }) {
  if (block.type === "heading_1") {
    const id = headingId(block.heading_1.rich_text, block.id);
    return (
      <h1 id={id} className="text-3xl font-bold mt-10 mb-4">
        <RichText richText={block.heading_1.rich_text} />
      </h1>
    );
  }
  if (block.type === "heading_2") {
    const id = headingId(block.heading_2.rich_text, block.id);
    return (
      <h2 id={id} className="text-2xl font-bold mt-8 mb-3">
        <RichText richText={block.heading_2.rich_text} />
      </h2>
    );
  }
  if (block.type === "heading_3") {
    const id = headingId(block.heading_3.rich_text, block.id);
    return (
      <h3 id={id} className="text-xl font-semibold mt-6 mb-2">
        <RichText richText={block.heading_3.rich_text} />
      </h3>
    );
  }
  return null;
}

function CodeBlock({ block }: { block: NotionBlockWithChildren }) {
  if (block.type !== "code") return null;
  const language = block.code.language || "plain text";
  const text = block.code.rich_text.map((t) => t.plain_text).join("");
  const caption = block.code.caption;

  return (
    <div className="my-4 rounded-xl border border-border overflow-hidden max-w-[calc(100vw-3rem)]">
      <div className="flex items-center justify-between px-4 py-2 bg-muted border-b border-border">
        <span className="text-xs font-mono text-muted-foreground">
          {language}
        </span>
      </div>
      <pre className="p-4 overflow-x-auto bg-muted/50">
        <code className="text-sm font-mono leading-relaxed whitespace-pre">{text}</code>
      </pre>
      {caption && caption.length > 0 && (
        <div className="px-4 py-2 text-xs text-muted-foreground border-t border-border">
          <RichText richText={caption} />
        </div>
      )}
    </div>
  );
}

function CalloutBlock({ block }: { block: NotionBlockWithChildren }) {
  if (block.type !== "callout") return null;
  const icon =
    block.callout.icon?.type === "emoji" ? block.callout.icon.emoji : "💡";
  const color = block.callout.color;
  const bgClass = color.endsWith("_background")
    ? `notion-bg-${color.replace("_background", "")}`
    : "";

  return (
    <div
      className={`my-4 flex gap-3 p-4 rounded-xl border border-border ${bgClass || "bg-muted"}`}
    >
      <span className="text-xl shrink-0">{icon}</span>
      <div className="flex-1 min-w-0">
        <RichText richText={block.callout.rich_text} />
        <BlockChildren blocks={block.children} />
      </div>
    </div>
  );
}

function QuoteBlock({ block }: { block: NotionBlockWithChildren }) {
  if (block.type !== "quote") return null;
  return (
    <blockquote className="my-4 border-l-4 border-primary pl-4 italic text-muted-foreground">
      <RichText richText={block.quote.rich_text} />
      <BlockChildren blocks={block.children} />
    </blockquote>
  );
}

function ToggleBlock({ block }: { block: NotionBlockWithChildren }) {
  if (block.type !== "toggle") return null;
  return (
    <details className="my-2">
      <summary className="cursor-pointer font-medium">
        <RichText richText={block.toggle.rich_text} />
      </summary>
      <div className="pl-4 mt-2">
        <BlockChildren blocks={block.children} />
      </div>
    </details>
  );
}

function TodoBlock({ block }: { block: NotionBlockWithChildren }) {
  if (block.type !== "to_do") return null;
  return (
    <div className="flex gap-2 my-1">
      <input
        type="checkbox"
        checked={block.to_do.checked}
        readOnly
        className="mt-1.5 shrink-0"
      />
      <span className={block.to_do.checked ? "line-through text-muted-foreground" : ""}>
        <RichText richText={block.to_do.rich_text} />
        <BlockChildren blocks={block.children} />
      </span>
    </div>
  );
}

function ImageBlock({ block }: { block: NotionBlockWithChildren }) {
  if (block.type !== "image") return null;
  const src =
    block.image.type === "file"
      ? block.image.file.url
      : block.image.external.url;
  const caption = block.image.caption;

  const alt = caption?.map((t) => t.plain_text).join("") || "";

  return (
    <figure className="my-6">
      <Image
        src={src}
        alt={alt}
        width={800}
        height={450}
        className="rounded-xl max-w-full mx-auto h-auto"
        sizes="(max-width: 768px) 100vw, 800px"
        unoptimized={src.includes("secure.notion-static.com")}
      />
      {caption && caption.length > 0 && (
        <figcaption className="text-center text-sm text-muted-foreground mt-2">
          <RichText richText={caption} />
        </figcaption>
      )}
    </figure>
  );
}

function VideoBlock({ block }: { block: NotionBlockWithChildren }) {
  if (block.type !== "video") return null;
  const url =
    block.video.type === "file"
      ? block.video.file.url
      : block.video.external.url;

  // YouTube embed detection
  const ytMatch = url.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([\w-]+)/
  );
  if (ytMatch) {
    return (
      <div className="my-6 aspect-video rounded-xl overflow-hidden">
        <iframe
          src={`https://www.youtube.com/embed/${ytMatch[1]}`}
          className="w-full h-full"
          allowFullScreen
          loading="lazy"
          title="YouTube video"
        />
      </div>
    );
  }

  return (
    <div className="my-6">
      <video src={url} controls className="rounded-xl max-w-full mx-auto" />
    </div>
  );
}

function DividerBlock() {
  return <hr className="my-8 border-border" />;
}

function BookmarkBlock({ block }: { block: NotionBlockWithChildren }) {
  if (block.type !== "bookmark") return null;
  const caption = block.bookmark.caption;
  return (
    <div className="my-4 rounded-xl border border-border p-4 hover:bg-muted/50 transition-colors">
      <a
        href={block.bookmark.url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-primary underline underline-offset-2 break-all"
      >
        {caption && caption.length > 0 ? (
          <RichText richText={caption} />
        ) : (
          block.bookmark.url
        )}
      </a>
    </div>
  );
}

function EmbedBlock({ block }: { block: NotionBlockWithChildren }) {
  if (block.type !== "embed") return null;
  return (
    <div className="my-6 aspect-video rounded-xl overflow-hidden">
      <iframe
        src={block.embed.url}
        className="w-full h-full"
        allowFullScreen
        loading="lazy"
        title="Embedded content"
      />
    </div>
  );
}

function TableBlock({ block }: { block: NotionBlockWithChildren }) {
  if (block.type !== "table") return null;
  const hasColumnHeader = block.table.has_column_header;
  const hasRowHeader = block.table.has_row_header;
  const rows = block.children ?? [];

  return (
    <div className="my-4 overflow-x-auto rounded-xl border border-border">
      <table className="w-full text-sm">
        <tbody>
          {rows.map((row, rowIdx) => {
            if (row.type !== "table_row") return null;
            const cells = row.table_row.cells;
            const isHeaderRow = hasColumnHeader && rowIdx === 0;

            return (
              <tr
                key={row.id}
                className={isHeaderRow ? "bg-muted font-semibold" : "border-t border-border"}
              >
                {cells.map((cell, cellIdx) => {
                  const isHeaderCell = hasRowHeader && cellIdx === 0;
                  const Tag = isHeaderRow || isHeaderCell ? "th" : "td";
                  return (
                    <Tag
                      key={cellIdx}
                      className="px-4 py-2 text-left"
                    >
                      <RichText richText={cell} />
                    </Tag>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function ColumnListBlock({ block }: { block: NotionBlockWithChildren }) {
  if (block.type !== "column_list") return null;
  const columns = block.children ?? [];

  return (
    <div className="my-4 flex flex-col md:flex-row gap-4">
      {columns.map((col) => (
        <div key={col.id} className="flex-1 min-w-0">
          <BlockChildren blocks={col.children} />
        </div>
      ))}
    </div>
  );
}

function ListItemContent({ block }: { block: NotionBlockWithChildren }) {
  if (block.type === "bulleted_list_item") {
    return (
      <li className="leading-relaxed">
        <RichText richText={block.bulleted_list_item.rich_text} />
        <BlockChildren blocks={block.children} />
      </li>
    );
  }
  if (block.type === "numbered_list_item") {
    return (
      <li className="leading-relaxed">
        <RichText richText={block.numbered_list_item.rich_text} />
        <BlockChildren blocks={block.children} />
      </li>
    );
  }
  return null;
}

/* ------------------------------------------------------------------ */
/*  Single block router                                                */
/* ------------------------------------------------------------------ */

function renderBlock(block: NotionBlockWithChildren) {
  switch (block.type) {
    case "paragraph":
      return <ParagraphBlock key={block.id} block={block} />;
    case "heading_1":
    case "heading_2":
    case "heading_3":
      return <HeadingBlock key={block.id} block={block} />;
    case "code":
      return <CodeBlock key={block.id} block={block} />;
    case "callout":
      return <CalloutBlock key={block.id} block={block} />;
    case "quote":
      return <QuoteBlock key={block.id} block={block} />;
    case "toggle":
      return <ToggleBlock key={block.id} block={block} />;
    case "to_do":
      return <TodoBlock key={block.id} block={block} />;
    case "image":
      return <ImageBlock key={block.id} block={block} />;
    case "video":
      return <VideoBlock key={block.id} block={block} />;
    case "divider":
      return <DividerBlock key={block.id} />;
    case "bookmark":
      return <BookmarkBlock key={block.id} block={block} />;
    case "embed":
      return <EmbedBlock key={block.id} block={block} />;
    case "table":
      return <TableBlock key={block.id} block={block} />;
    case "column_list":
      return <ColumnListBlock key={block.id} block={block} />;
    default:
      return null;
  }
}

/* ------------------------------------------------------------------ */
/*  Exported renderer                                                  */
/* ------------------------------------------------------------------ */

export function NotionBlockRenderer({
  blocks,
}: {
  blocks: NotionBlockWithChildren[];
}) {
  const grouped = groupListItems(blocks);

  return (
    <>
      {grouped.map((group, idx) => {
        if (group.kind === "block") {
          return renderBlock(group.block);
        }

        const Tag =
          group.listType === "bulleted_list_item" ? "ul" : "ol";
        const listClass =
          group.listType === "bulleted_list_item"
            ? "list-disc pl-6 my-2 space-y-1"
            : "list-decimal pl-6 my-2 space-y-1";

        return (
          <Tag key={`list-${idx}`} className={listClass}>
            {group.items.map((item) => (
              <ListItemContent key={item.id} block={item} />
            ))}
          </Tag>
        );
      })}
    </>
  );
}
