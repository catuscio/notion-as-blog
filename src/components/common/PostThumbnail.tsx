import Image from "next/image";
import { FileText } from "lucide-react";
import { cn } from "@/lib/utils";

const sizeMap = {
  sm: { width: 64, height: 64, icon: 20, className: "w-16 h-16" },
  md: { width: 192, height: 128, icon: 60, className: "w-full md:w-48 aspect-video md:aspect-auto md:h-32" },
  lg: { width: 192, height: 192, icon: 48, className: "w-full md:w-48 aspect-video md:aspect-square" },
} as const;

type Size = keyof typeof sizeMap;

interface PostThumbnailProps {
  src?: string;
  alt: string;
  size?: Size;
  className?: string;
  hoverScale?: boolean;
  fill?: boolean;
  blurDataURL?: string;
}

export function PostThumbnail({
  src,
  alt,
  size = "sm",
  className = "",
  hoverScale = false,
  fill = false,
  blurDataURL,
}: PostThumbnailProps) {
  const config = sizeMap[size];
  const roundedClass = size === "sm" ? "rounded-lg" : "rounded-xl";

  return (
    <div
      className={cn(
        roundedClass,
        "overflow-hidden bg-muted shrink-0",
        fill && "relative",
        className || config.className,
      )}
    >
      {src ? (
        fill ? (
          <Image
            src={src}
            alt={alt}
            fill
            sizes="(max-width: 768px) 100vw, 192px"
            className={`object-cover ${
              hoverScale
                ? "transition-transform duration-700 group-hover:scale-110"
                : ""
            }`}
            {...(blurDataURL ? { placeholder: "blur" as const, blurDataURL } : {})}
          />
        ) : (
          <Image
            src={src}
            alt={alt}
            width={config.width}
            height={config.height}
            className={`w-full h-full object-cover ${
              hoverScale
                ? "transition-transform group-hover:scale-110"
                : ""
            }`}
            {...(blurDataURL ? { placeholder: "blur" as const, blurDataURL } : {})}
          />
        )
      ) : (
        <div className="w-full h-full bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center text-primary/30">
          <FileText size={config.icon} className="opacity-50" />
        </div>
      )}
    </div>
  );
}
