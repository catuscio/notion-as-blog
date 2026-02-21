import Image from "next/image";
import type { NotionBlockWithChildren, NotionRichText } from "@/lib/notion/types";
import { slugifyHeading } from "@/lib/format";
import { notionColorClass } from "@/lib/notion/colorMap";
import { brand } from "@/config/brand";
import { copy } from "@/config/copy";
import { RichText } from "./RichText";
import { groupListItems } from "./groupListItems";
import { EquationBlock } from "./EquationRenderer";
import { BookmarkCard } from "./BookmarkCard";

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
  const text = richText.map((t) => t.plain_text).join("");
  return slugifyHeading(text, blockId);
}

/* ------------------------------------------------------------------ */
/*  Helper: extract file URL from Notion file object                   */
/* ------------------------------------------------------------------ */

function getFileUrl(file: { type: string; file?: { url: string }; external?: { url: string } }): string | undefined {
  return file.type === "file" ? file.file?.url : file.external?.url;
}

/* ------------------------------------------------------------------ */
/*  Block components                                                   */
/* ------------------------------------------------------------------ */

function ParagraphBlock({ block }: { block: NotionBlockWithChildren }) {
  if (block.type !== "paragraph") return null;
  return (
    <p className="my-5 leading-relaxed">
      <RichText richText={block.paragraph.rich_text} />
      <BlockChildren blocks={block.children} />
    </p>
  );
}

const HEADING_CONFIG: Record<string, { tag: "h2" | "h3" | "h4"; className: string }> = {
  heading_1: { tag: "h2", className: "text-3xl font-bold mt-12 mb-5" },
  heading_2: { tag: "h3", className: "text-2xl font-semibold mt-10 mb-4" },
  heading_3: { tag: "h4", className: "text-xl font-semibold mt-8 mb-3" },
};

function getHeadingData(block: NotionBlockWithChildren): { richText: NotionRichText[]; isToggleable: boolean } {
  switch (block.type) {
    case "heading_1": return { richText: block.heading_1.rich_text, isToggleable: block.heading_1.is_toggleable };
    case "heading_2": return { richText: block.heading_2.rich_text, isToggleable: block.heading_2.is_toggleable };
    case "heading_3": return { richText: block.heading_3.rich_text, isToggleable: block.heading_3.is_toggleable };
    default: return { richText: [], isToggleable: false };
  }
}

function HeadingBlock({ block }: { block: NotionBlockWithChildren }) {
  const config = HEADING_CONFIG[block.type];
  if (!config) return null;

  const { richText, isToggleable } = getHeadingData(block);
  const Tag = config.tag;
  const id = headingId(richText, block.id);

  if (isToggleable) {
    return (
      <details className="my-2">
        <summary className="cursor-pointer list-none [&::-webkit-details-marker]:hidden">
          <Tag id={id} className={`${config.className} inline-flex items-center gap-2`}>
            <span className="text-muted-foreground transition-transform [[open]>summary_&]:rotate-90">&#9654;</span>
            <RichText richText={richText} />
          </Tag>
        </summary>
        <div className="pl-6 mt-2">
          <BlockChildren blocks={block.children} />
        </div>
      </details>
    );
  }

  return (
    <Tag id={id} className={config.className}>
      <RichText richText={richText} />
    </Tag>
  );
}

function CodeBlock({ block }: { block: NotionBlockWithChildren }) {
  if (block.type !== "code") return null;
  const language = block.code.language || "plain text";
  const text = (block.code.rich_text ?? []).map((t) => t.plain_text).join("");
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
  const colorCls = notionColorClass(color);
  const isBackground = color.endsWith("_background");

  return (
    <div
      className={`my-4 flex gap-3 p-4 rounded-xl border border-border ${
        colorCls ? (isBackground ? colorCls : `${colorCls} bg-muted`) : "bg-muted"
      }`}
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
  const colorCls = notionColorClass(block.quote.color) ?? "";

  return (
    <blockquote className={`my-4 border-l-4 border-primary pl-4 italic text-muted-foreground ${colorCls}`}>
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

function deriveImageAlt(src: string, caption?: NotionRichText[]): string {
  const captionText = caption?.map((t) => t.plain_text).join("") || "";
  if (captionText) return captionText;
  try {
    const filename = decodeURIComponent(src.split("/").pop()?.split("?")[0] || "").replace(/[-_]/g, " ");
    const isUuidLike = /^[0-9a-f]{8}[ ][0-9a-f]{4}[ ]/i.test(filename);
    return isUuidLike ? "" : filename;
  } catch {
    return "";
  }
}

function ImageBlock({ block }: { block: NotionBlockWithChildren }) {
  if (block.type !== "image") return null;
  const src = getFileUrl(block.image);
  if (!src) return null;
  const caption = block.image.caption;
  const alt = deriveImageAlt(src, caption);

  return (
    <figure className="my-6">
      <Image
        src={src}
        alt={alt}
        width={800}
        height={450}
        className="rounded-xl max-w-full mx-auto h-auto"
        sizes="(max-width: 768px) 100vw, 800px"
        unoptimized={src.includes(brand.notion.staticDomain)}
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
  const url = getFileUrl(block.video);
  if (!url) return null;

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
          title={copy.aria.youtubeVideo}
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

function AudioBlock({ block }: { block: NotionBlockWithChildren }) {
  if (block.type !== "audio") return null;
  const url = getFileUrl(block.audio);
  if (!url) return null;
  const caption = block.audio.caption;

  return (
    <figure className="my-4">
      <audio src={url} controls className="w-full" />
      {caption && caption.length > 0 && (
        <figcaption className="text-center text-sm text-muted-foreground mt-2">
          <RichText richText={caption} />
        </figcaption>
      )}
    </figure>
  );
}

function FileBlock({ block }: { block: NotionBlockWithChildren }) {
  if (block.type !== "file") return null;
  const url = getFileUrl(block.file);
  if (!url) return null;
  const caption = block.file.caption;
  const filename = caption && caption.length > 0
    ? caption.map((t) => t.plain_text).join("")
    : decodeURIComponent(url.split("/").pop()?.split("?")[0] || url);

  return (
    <div className="my-4 rounded-xl border border-border p-4 hover:bg-muted/50 transition-colors">
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 text-primary underline underline-offset-2"
      >
        <span className="shrink-0">📎</span>
        <span className="break-all">{filename}</span>
      </a>
    </div>
  );
}

function PdfBlock({ block }: { block: NotionBlockWithChildren }) {
  if (block.type !== "pdf") return null;
  const url = getFileUrl(block.pdf);
  if (!url) return null;
  const caption = block.pdf.caption;

  return (
    <figure className="my-6">
      <iframe
        src={url}
        className="w-full h-[600px] rounded-xl border border-border"
        title="PDF"
        loading="lazy"
      />
      {caption && caption.length > 0 && (
        <figcaption className="text-center text-sm text-muted-foreground mt-2">
          <RichText richText={caption} />
        </figcaption>
      )}
    </figure>
  );
}

function DividerBlock() {
  return <hr className="my-8 border-border" />;
}

function getOgFromBlock(block: NotionBlockWithChildren) {
  return (block as Record<string, unknown>)._ogMetadata as
    | import("@/lib/notion/ogMetadata").OgMetadata
    | undefined;
}

function BookmarkBlock({ block }: { block: NotionBlockWithChildren }) {
  if (block.type !== "bookmark") return null;
  return <BookmarkCard url={block.bookmark.url} caption={block.bookmark.caption} og={getOgFromBlock(block)} />;
}

function LinkPreviewBlock({ block }: { block: NotionBlockWithChildren }) {
  if (block.type !== "link_preview") return null;
  return <BookmarkCard url={block.link_preview.url} og={getOgFromBlock(block)} />;
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
        title={copy.aria.embeddedContent}
      />
    </div>
  );
}

function TableBlock({ block }: { block: NotionBlockWithChildren }) {
  if (block.type !== "table") return null;
  const hasColumnHeader = block.table.has_column_header;
  const hasRowHeader = block.table.has_row_header;
  const rows = block.children ?? [];

  const headerRow = hasColumnHeader ? rows[0] : null;
  const bodyRows = hasColumnHeader ? rows.slice(1) : rows;

  return (
    <div className="my-4 overflow-x-auto rounded-xl border border-border">
      <table className="w-full text-sm">
        {headerRow && headerRow.type === "table_row" && (
          <thead>
            <tr className="bg-muted font-semibold">
              {(headerRow.table_row?.cells ?? []).map((cell, cellIdx) => (
                <th key={cellIdx} className="px-4 py-2 text-left">
                  <RichText richText={cell} />
                </th>
              ))}
            </tr>
          </thead>
        )}
        <tbody>
          {bodyRows.map((row) => {
            if (row.type !== "table_row") return null;
            const cells = row.table_row?.cells ?? [];

            return (
              <tr key={row.id} className="border-t border-border">
                {cells.map((cell, cellIdx) => {
                  const isHeaderCell = hasRowHeader && cellIdx === 0;
                  const Tag = isHeaderCell ? "th" : "td";
                  return (
                    <Tag key={cellIdx} className="px-4 py-2 text-left">
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

function SyncedBlock({ block }: { block: NotionBlockWithChildren }) {
  if (block.type !== "synced_block") return null;
  return <BlockChildren blocks={block.children} />;
}

function LinkToPageBlock({ block }: { block: NotionBlockWithChildren }) {
  if (block.type !== "link_to_page") return null;
  const pageId =
    block.link_to_page.type === "page_id" ? block.link_to_page.page_id : "";
  if (!pageId) return null;

  return (
    <div className="my-2 text-muted-foreground text-sm italic">
      {copy.blocks.linkedPage}
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
    case "audio":
      return <AudioBlock key={block.id} block={block} />;
    case "file":
      return <FileBlock key={block.id} block={block} />;
    case "pdf":
      return <PdfBlock key={block.id} block={block} />;
    case "divider":
      return <DividerBlock key={block.id} />;
    case "bookmark":
      return <BookmarkBlock key={block.id} block={block} />;
    case "link_preview":
      return <LinkPreviewBlock key={block.id} block={block} />;
    case "link_to_page":
      return <LinkToPageBlock key={block.id} block={block} />;
    case "embed":
      return <EmbedBlock key={block.id} block={block} />;
    case "table":
      return <TableBlock key={block.id} block={block} />;
    case "column_list":
      return <ColumnListBlock key={block.id} block={block} />;
    case "synced_block":
      return <SyncedBlock key={block.id} block={block} />;
    case "equation":
      return <EquationBlock key={block.id} expression={block.equation.expression} />;
    // table_of_contents, breadcrumb, child_page, child_database — intentionally ignored
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
            ? "list-disc pl-6 my-4 space-y-2"
            : "list-decimal pl-6 my-4 space-y-2";

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
