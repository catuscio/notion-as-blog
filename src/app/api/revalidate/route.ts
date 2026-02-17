import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const token = request.headers.get("authorization")?.replace("Bearer ", "");

  const expected = process.env.TOKEN_FOR_REVALIDATE;
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
