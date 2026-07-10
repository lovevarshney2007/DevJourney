import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { getAuthUser } from "@/lib/auth";
import { uploadToCloudinary } from "@/lib/cloudinary";

// Allow up to 60s for large file uploads (Vercel Pro: 300s, Hobby: 60s)
export const maxDuration = 60;

// Allowed MIME types for security
const ALLOWED_TYPES = new Set([
  // Documents
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  // Images
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/gif",
  "image/webp",
  "image/svg+xml",
  // Archives & text
  "application/zip",
  "text/plain",
  "text/csv",
]);

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

    // Max 50MB
    const maxSize = 50 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { success: false, error: `File too large. Maximum size is 50MB (got ${(file.size / 1024 / 1024).toFixed(1)}MB)` },
        { status: 400 }
      );
    }

    // Validate file type
    const fileType = file.type.toLowerCase();
    if (fileType && !ALLOWED_TYPES.has(fileType)) {
      return NextResponse.json(
        { success: false, error: `File type '${fileType}' is not allowed` },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    const result = await uploadToCloudinary(buffer, {
      folder,
      resource_type: "auto",
      filename: file.name,
    });

    return NextResponse.json({
      success: true,
      data: { url: result.url, public_id: result.public_id, name: file.name, size: file.size },
    });
  } catch (error: any) {
    console.error("[UPLOAD]", error);
    
    // Provide detailed error message back to the client for debugging
    const errorMessage = error?.message || "Unknown error occurred during upload";
    const httpCode = error?.http_code || 500;
    
    return NextResponse.json(
      { 
        success: false, 
        error: `Cloudinary Upload Error: ${errorMessage}`,
        details: error
      }, 
      { status: httpCode === 403 ? 403 : 500 }
    );
  }
}
