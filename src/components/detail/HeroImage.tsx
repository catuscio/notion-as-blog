import Image from "next/image";

export function HeroImage({
  src,
  alt,
}: {
  src: string;
  alt: string;
}) {
  if (!src) return null;

  return (
    <figure className="mb-12 relative overflow-hidden rounded-2xl shadow-sm">
      <div className="aspect-[16/9] w-full bg-muted overflow-hidden relative">
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover"
          priority
        />
      </div>
    </figure>
  );
}
