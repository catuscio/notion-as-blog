import { ImageResponse } from "next/og";
import { brandIcon } from "@/lib/brandIcon";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(brandIcon({ borderRadius: 36, fontSize: 120 }), { ...size });
}
