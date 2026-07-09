import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { getAuthUser } from "@/lib/auth";
import { uploadToCloudinary } from "@/lib/cloudinary";

export const config = {
  api: { bodyParser: false },
};

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const authUser = await getAuthUser(req);
    if (!authUser) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const folder = (formData.get("folder") as string) || "devjourney/uploads";

    if (!file) {
      return NextResponse.json({ success: false, error: "No file provided" }, { status: 400 });
    }

    const maxSize = 50 * 1024 * 1024; // 50MB
    if (file.size > maxSize) {
      return NextResponse.json({ success: false, error: "File too large (max 50MB)" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const result = await uploadToCloudinary(buffer, {
      folder,
      resource_type: "auto",
      filename: file.name,
    });

    return NextResponse.json({
      success: true,
      data: { url: result.url, public_id: result.public_id, name: file.name },
    });
  } catch (error) {
    console.error("[UPLOAD]", error);
    return NextResponse.json({ success: false, error: "Upload failed" }, { status: 500 });
  }
}
