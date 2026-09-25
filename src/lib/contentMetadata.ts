import type { Metadata } from "next";
import type { ContentItem } from "@/types";

export function getContentRobots(
  status: ContentItem["status"]
): Metadata["robots"] | undefined {
  if (status !== "PublicOnDetail") return undefined;

  return {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
    },
  };
}
