import { ImageResponse } from "next/og";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { brand } from "@/config/brand";
import { getContentCatalog } from "@/lib/notion/contentCatalog";
import { readNotionImageResizedAsBase64 } from "@/lib/notion/imageProxy";

let logoSrc: string | null = null;
try {
  const logoPng = readFileSync(
    join(process.cwd(), "public", brand.logo.ogWhite.replace(/^\//, "")),
  );
  logoSrc = `data:image/png;base64,${logoPng.toString("base64")}`;
} catch {
  // logo-white.png not found — skip logo overlay
}

export const revalidate = 1800;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const dynamicParams = true;

const primary = `hsl(${brand.colors.light.primary})`;
const primaryDark = `hsl(${brand.colors.dark.primary})`;

const fontPromise = fetch(brand.fonts.og.url).then((res) => res.arrayBuffer());

export async function generateStaticParams() {
  const catalog = await getContentCatalog();
  return [...catalog.listedPosts, ...catalog.listedPages].map((item) => ({
    slug: item.slug,
  }));
}

async function fetchThumbnail(url: string): Promise<string | null> {
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(brand.assets.ogFetchTimeoutMs) });
    if (!res.ok) return null;
    const buf = Buffer.from(await res.arrayBuffer());
    const sharp = (await import("sharp")).default;
    const resized = await sharp(buf)
      .resize(size.width, size.height, { fit: "cover" })
      .toFormat("png")
      .toBuffer();
    return `data:image/png;base64,${resized.toString("base64")}`;
  } catch {
    return null;
  }
}

export default async function OgImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const catalog = await getContentCatalog();
  const post = catalog.detailAccessiblePosts.find((item) => item.slug === slug)
    ?? catalog.detailAccessiblePages.find((item) => item.slug === slug);

  if (!post) {
    return new Response(null, { status: 404 });
  }

  const thumbnailSrc = post.thumbnail
    ? (await readNotionImageResizedAsBase64(post.thumbnail, size.width, size.height)) ??
      (await fetchThumbnail(post.thumbnail))
    : null;

  // If thumbnailSrc is null, generate a dynamic OG image with a gradient background

  const formattedDate = post.date
    ? new Date(post.date).toLocaleDateString(brand.lang, {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "";

  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          color: "white",
          position: "relative",
        }}
      >
        {/* Background: thumbnail or brand gradient */}
        {thumbnailSrc ? (
          <img
            alt=""
            src={thumbnailSrc}
            width={1200}
            height={630}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: 1200,
              height: 630,
              objectFit: "cover",
            }}
          />
        ) : null}

        {/* Gradient overlay */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: 1200,
            height: 630,
            background: thumbnailSrc
              ? "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.1) 100%)"
              : `linear-gradient(135deg, ${primary} 0%, ${primaryDark} 100%)`,
          }}
        />

        {/* Content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            position: "relative",
            padding: 60,
          }}
        >
          {/* Category badge */}
          {post.category ? (
            <div
              style={{
                display: "flex",
                marginBottom: 20,
              }}
            >
              <div
                style={{
                  fontSize: 22,
                  fontWeight: 700,
                  background: "rgba(255,255,255,0.2)",
                  padding: "6px 18px",
                  borderRadius: 999,
                }}
              >
                {post.category}
              </div>
            </div>
          ) : null}

          {/* Title */}
          <div
            style={{
              fontSize: 48,
              fontWeight: 700,
              lineHeight: 1.3,
              marginBottom: 24,
              maxWidth: 1000,
              wordBreak: "keep-all",
            }}
          >
            {post.title.length > 60
              ? post.title.slice(0, 60) + "…"
              : post.title}
          </div>

          {/* Date + Brand */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              fontSize: 24,
              opacity: 0.8,
              width: 1080,
            }}
          >
            <span>{formattedDate}</span>
            {logoSrc ? (
              <img
                alt={brand.name}
                src={logoSrc}
                style={{ height: 30, objectFit: "contain", opacity: 0.9 }}
              />
            ) : (
              <span style={{ fontWeight: 700 }}>{brand.name}</span>
            )}
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      ...(post.status === "PublicOnDetail" && {
        headers: { "X-Robots-Tag": "noindex, noimageindex, noarchive" },
      }),
      fonts: [
        {
          name: brand.fonts.og.family,
          data: await fontPromise,
          style: "normal" as const,
          weight: 700 as const,
        },
      ],
    },
  );
}
