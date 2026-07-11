import type { Metadata } from "next";
import { brand } from "@/config/brand";

interface ListingMetadataOptions {
  title: string;
  socialTitle: string;
  description: string;
  url: string;
  openGraphType?: "website" | "profile";
  robots?: Metadata["robots"];
}

export function createListingMetadata({
  title,
  socialTitle,
  description,
  url,
  openGraphType = "website",
  robots,
}: ListingMetadataOptions): Metadata {
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: socialTitle,
      description,
      url,
      siteName: brand.name,
      type: openGraphType,
      images: [{
        url: brand.assets.ogImage,
        width: brand.assets.ogWidth,
        height: brand.assets.ogHeight,
      }],
    },
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description,
      images: [brand.assets.ogImage],
    },
    ...(robots && { robots }),
  };
}
