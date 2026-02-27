import Image from "next/image";
import { User } from "lucide-react";
import { cn } from "@/lib/utils";
import type { AuthorSummary } from "@/types";

const sizeConfig = {
  sm: { px: 32, icon: 18, overlap: "-ml-3", ring: "ring-2", text: "text-xs" },
  md: { px: 48, icon: 24, overlap: "-ml-3.5", ring: "ring-2", text: "text-sm" },
} as const;

export function AvatarStack({
  authors,
  size = "md",
  max,
  showNames = true,
}: {
  authors: AuthorSummary[];
  size?: "sm" | "md";
  max?: number;
  showNames?: boolean;
}) {
  if (authors.length === 0) return null;

  const cfg = sizeConfig[size];
  const visible = max && authors.length > max ? authors.slice(0, max) : authors;
  const overflow = max ? authors.length - (max ?? authors.length) : 0;

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center">
        {visible.map((author, i) => (
          <div
            key={author.name}
            className={cn(
              "rounded-full bg-muted flex items-center justify-center overflow-hidden shrink-0",
              cfg.ring, "ring-background",
              i > 0 && cfg.overlap
            )}
            style={{ width: cfg.px, height: cfg.px, zIndex: visible.length - i }}
          >
            {author.avatar ? (
              <Image
                src={author.avatar}
                alt={author.name}
                width={cfg.px}
                height={cfg.px}
                className="object-cover w-full h-full"
                {...(author.blurDataURL ? { placeholder: "blur" as const, blurDataURL: author.blurDataURL } : {})}
              />
            ) : (
              <User size={cfg.icon} className="text-muted-foreground" />
            )}
          </div>
        ))}
        {overflow > 0 && (
          <div
            className={cn(
              "rounded-full bg-muted flex items-center justify-center shrink-0 text-muted-foreground font-medium",
              cfg.ring, "ring-background", cfg.overlap, cfg.text
            )}
            style={{ width: cfg.px, height: cfg.px, zIndex: 0 }}
          >
            +{overflow}
          </div>
        )}
      </div>
      {showNames && (
        <span className={cn("font-semibold truncate", cfg.text)}>
          {authors.map((a) => a.name).join(", ")}
        </span>
      )}
    </div>
  );
}
