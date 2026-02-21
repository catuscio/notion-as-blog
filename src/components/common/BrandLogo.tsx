"use client";

import { useState } from "react";
import Image from "next/image";
import { brand } from "@/config/brand";

type BrandLogoProps = {
  size: number;
};

export function BrandLogo({ size }: BrandLogoProps) {
  const src = brand.logo.image;
  const [error, setError] = useState(false);

  if (!src || error) return null;

  return (
    <Image
      src={src}
      alt={brand.name}
      width={size}
      height={size}
      className="object-contain"
      onError={() => setError(true)}
    />
  );
}
