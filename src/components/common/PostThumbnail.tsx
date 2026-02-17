import Image from "next/image";

const sizeMap = {
  sm: { width: 64, height: 64, icon: "text-xl", className: "w-16 h-16" },
  md: { width: 192, height: 128, icon: "text-6xl", className: "w-full md:w-48 aspect-video md:aspect-auto md:h-32" },
  lg: { width: 192, height: 192, icon: "text-5xl", className: "w-full md:w-48 aspect-video md:aspect-square" },
} as const;

type Size = keyof typeof sizeMap;

interface PostThumbnailProps {
  src?: string;
  alt: string;
  size?: Size;
  className?: string;
  hoverScale?: boolean;
  fill?: boolean;
}

export function PostThumbnail({
  src,
  alt,
  size = "sm",
  className = "",
  hoverScale = false,
  fill = false,
}: PostThumbnailProps) {
  const config = sizeMap[size];

  return (
    <div
      className={`rounded-${size === "sm" ? "lg" : "xl"} overflow-hidden bg-muted shrink-0 ${
        fill ? "relative" : ""
      } ${className || config.className}`}
    >
      {src ? (
        fill ? (
          <Image
            src={src}
            alt={alt}
            fill
            className={`object-cover ${
              hoverScale
                ? "transition-transform duration-700 group-hover:scale-110"
                : ""
            }`}
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
          />
        )
      ) : (
        <div className="w-full h-full bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center text-primary/30">
          <span className={`material-symbols-outlined ${config.icon} opacity-50`}>
            article
          </span>
        </div>
      )}
    </div>
  );
}
