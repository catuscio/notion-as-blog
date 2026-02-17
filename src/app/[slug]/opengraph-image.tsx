import { ImageResponse } from "next/og";
import { brand } from "@/config/brand";
import { getAllPosts } from "@/lib/notion/getPosts";

export const runtime = "edge";
export const alt = "Post thumbnail";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const primary = `hsl(${brand.colors.light.primary})`;
const primaryDark = `hsl(${brand.colors.dark.primary})`;

export default async function OgImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const posts = await getAllPosts();
  const post = posts.find((p) => p.slug === slug);

  if (!post) {
    return new ImageResponse(
      (
        <div
          style={{
            width: 1200,
            height: 630,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            background: primary,
            color: "white",
            fontSize: 48,
          }}
        >
          Not Found
        </div>
      ),
      { ...size }
    );
  }

  const formattedDate = new Date(post.date).toLocaleDateString(brand.lang, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

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
        {post.thumbnail ? (
          <img
            src={post.thumbnail}
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
            background: post.thumbnail
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
            <span style={{ fontWeight: 700 }}>{brand.name}</span>
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
