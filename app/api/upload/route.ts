import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth-guard";
import { isRateLimited } from "@/lib/rate-limit";
import { uploadBufferToCloudinary } from "@/lib/cloudinary";

const MAX_UPLOAD_SIZE = 50 * 1024 * 1024; // 50 Mo
// Dossiers Cloudinary autorisés (les logos de clubs sont rangés à part)
const FOLDERS = ["articles", "clubs"];

export async function POST(request: NextRequest) {
  const currentUser = await getSessionUser();
  if (!currentUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (await isRateLimited("upload", currentUser.id)) {
    return NextResponse.json({ error: "Too many uploads" }, { status: 429 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (!file.type.startsWith("image/") && !file.type.startsWith("video/")) {
      return NextResponse.json({ error: "Unsupported file type" }, { status: 415 });
    }

    if (file.size > MAX_UPLOAD_SIZE) {
      return NextResponse.json({ error: "File too large" }, { status: 413 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const folder = String(formData.get("folder") ?? "articles");

    // Upload vers Cloudinary
    const result = await uploadBufferToCloudinary(buffer, {
      folder: FOLDERS.includes(folder) ? folder : "articles",
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
