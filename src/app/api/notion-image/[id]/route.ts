import { NextRequest, NextResponse } from "next/server";
import { getImageFromCache } from "@/lib/notion/imageCache";

type Props = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: NextRequest, { params }: Props) {
  const { id } = await params;
  const cached = getImageFromCache(id);

  if (!cached) {
    return new NextResponse("Not found", { status: 404 });
  }

  return new NextResponse(new Uint8Array(cached.buffer), {
    headers: {
      "Content-Type": cached.contentType,
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
