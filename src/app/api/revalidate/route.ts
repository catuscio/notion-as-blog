import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { env } from "@/config/env";

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get("authorization") ?? "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : authHeader;

  const expected = env.revalidateToken;
  if (!expected || token !== expected) {
    return NextResponse.json({ message: "Invalid token" }, { status: 401 });
  }

  try {
    revalidatePath("/", "layout");
    return NextResponse.json({ revalidated: true, now: Date.now() });
  } catch (error) {
    return NextResponse.json(
      { message: "Error revalidating", error: String(error) },
      { status: 500 }
    );
  }
}
