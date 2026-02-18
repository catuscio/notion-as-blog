import { ImageResponse } from "next/og";
import { brand } from "@/config/brand";

export const alt = `${brand.name} — ${brand.title}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const primary = `hsl(${brand.colors.light.primary})`;
const primaryDark = `hsl(${brand.colors.dark.primary})`;

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          background: `linear-gradient(135deg, ${primary} 0%, ${primaryDark} 100%)`,
          color: "white",
          padding: 60,
        }}
      >
        <div
          style={{
            fontSize: 72,
            fontWeight: 800,
            marginBottom: 24,
          }}
        >
          {brand.name}
        </div>
        <div
          style={{
            fontSize: 36,
            fontWeight: 500,
            opacity: 0.9,
            marginBottom: 16,
          }}
        >
          {brand.title}
        </div>
        <div
          style={{
            fontSize: 24,
            opacity: 0.75,
            maxWidth: 800,
            textAlign: "center",
          }}
        >
          {brand.description}
        </div>
      </div>
    ),
    { ...size }
  );
}
