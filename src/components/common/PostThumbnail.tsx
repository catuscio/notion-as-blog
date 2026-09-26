import Image from "next/image";
import { cn } from "@/lib/utils";

const sizeMap = {
  sm: { width: 64, height: 64, className: "w-16 h-16" },
  md: { width: 192, height: 128, className: "w-full md:w-48 aspect-video md:aspect-auto md:h-32" },
  lg: { width: 192, height: 192, className: "w-full md:w-48 aspect-video md:aspect-square" },
} as const;

type Size = keyof typeof sizeMap;

interface PostThumbnailProps {
  src?: string;
  alt: string;
  size?: Size;
  className?: string;
  fill?: boolean;
  loading?: "eager" | "lazy";
  fetchPriority?: "high" | "low" | "auto";
  preload?: boolean;
  sizes?: string;
}

export function PostThumbnail({
  src, alt, size = "sm", className = "", fill = false,
  loading, fetchPriority, preload = false, sizes,
}: PostThumbnailProps) {
  if (!src) return null;
  const config = sizeMap[size];
  return (
    <div className={cn("rounded-lg overflow-hidden bg-muted shrink-0", fill && "relative", className || config.className)}>
      {fill ? (
        <Image src={src} alt={alt} fill sizes={sizes ?? "(max-width: 768px) 100vw, 192px"}
          loading={preload ? "eager" : loading} fetchPriority={preload ? "high" : fetchPriority} className="object-cover" />
      ) : (
        <Image src={src} alt={alt} width={config.width} height={config.height}
          loading={preload ? "eager" : loading} fetchPriority={preload ? "high" : fetchPriority} className="w-full h-full object-cover" />
      )}
    </div>
  );
}
