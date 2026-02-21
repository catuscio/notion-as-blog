import { NextResponse } from "next/server";
import fs from "fs/promises";
import { brand } from "@/config/brand";
import { getCachedImage } from "@/lib/notion/imageCache";

type Props = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, { params }: Props) {
  try {
    const { id } = await params;
    const cached = await getCachedImage(id);

    if (!cached) {
      return new NextResponse(null, { status: 404 });
    }

    const buffer = await fs.readFile(cached.filepath);

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": cached.contentType,
        "Cache-Control": `public, max-age=${brand.cache.imageTtl}, immutable`,
      },
    });
  } catch (error) {
    console.error("[api/notion-image] Error:", error);
    return new NextResponse(null, { status: 500 });
  }
}
