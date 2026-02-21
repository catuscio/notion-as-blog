import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { brand } from "@/config/brand";
import { brandIcon } from "@/lib/brandIcon";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default async function AppleIcon() {
  if (brand.logo.favicon) {
    const buf = await readFile(join(process.cwd(), "public", brand.logo.favicon));
    return new ImageResponse(
      (
        <img
          alt=""
          src={`data:image/png;base64,${buf.toString("base64")}`}
          width={size.width}
          height={size.height}
          style={{ width: "100%", height: "100%", objectFit: "contain" }}
        />
      ),
      { ...size },
    );
  }
  return new ImageResponse(brandIcon({ borderRadius: 36, fontSize: 120 }), { ...size });
}
