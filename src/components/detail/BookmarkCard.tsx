import Image from "next/image";
import { RichText } from "./RichText";
import type { NotionRichText } from "@/lib/notion/types";
import type { OgMetadata } from "@/lib/notion/ogMetadata";

function getDomain(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

export function BookmarkCard({
  url,
  caption,
  og,
}: {
  url: string;
  caption?: NotionRichText[];
  og?: OgMetadata;
}) {
  const domain = getDomain(url);
  const hasOg = !!og?.title;

  return (
    <div className="my-4">
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="group block rounded-xl border border-border overflow-hidden hover:bg-muted/50 transition-colors"
      >
        <div className="flex">
          <div className="flex-1 min-w-0 p-4 flex flex-col justify-center gap-1.5">
            <span className="font-medium text-foreground line-clamp-1 group-hover:text-primary transition-colors">
              {hasOg ? og.title : domain}
            </span>
            {og?.description && (
              <span className="text-sm text-muted-foreground line-clamp-2">
                {og.description}
              </span>
            )}
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5">
              {og?.favicon && (
                <Image
                  src={og.favicon}
                  alt=""
                  width={14}
                  height={14}
                  unoptimized
                  className="shrink-0 rounded-sm"
                />
              )}
              <span className="truncate">{domain}</span>
            </span>
          </div>
          {og?.image && (
            <div className="hidden sm:relative sm:block shrink-0 w-[200px] border-l border-border">
              <Image
                src={og.image}
                alt=""
                fill
                unoptimized
                className="object-cover"
                loading="lazy"
              />
            </div>
          )}
        </div>
      </a>
      {caption && caption.length > 0 && (
        <div className="mt-1.5 text-sm text-muted-foreground">
          <RichText richText={caption} />
        </div>
      )}
    </div>
  );
}
