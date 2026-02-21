import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { brand } from "@/config/brand";
import { brandIcon } from "@/lib/brandIcon";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default async function Icon() {
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
  return new ImageResponse(brandIcon({ borderRadius: 6, fontSize: 20 }), { ...size });
}
