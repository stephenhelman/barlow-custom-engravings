import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getUploadUrl, getPublicUrl } from "@/lib/r2";
import { randomUUID } from "crypto";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

export async function POST(req: Request) {
  // Public upload is allowed for order reference images
  // Admin-only for item images (folder = "items")
  const body = await req.json();
  const { filename, contentType, folder = "orders" } = body;

  if (!ALLOWED_TYPES.includes(contentType)) {
    return NextResponse.json({ error: "Invalid file type" }, { status: 400 });
  }

  if (folder === "items") {
    const session = await auth();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const ext = filename.split(".").pop()?.toLowerCase() ?? "jpg";
  const key = `${folder}/${randomUUID()}.${ext}`;

  const url = await getUploadUrl(key, contentType);
  const publicUrl = getPublicUrl(key);

  return NextResponse.json({ url, publicUrl, key });
}
