import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { getAuthUser } from "@/lib/auth";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { fileTypeFromBuffer } from "file-type";
import { logger } from "@/lib/logger";

// Allow up to 60s for large file uploads (Vercel Pro: 300s, Hobby: 60s)
export const maxDuration = 60;

// Allowed MIME types for security
const ALLOWED_TYPES = new Set([
  // Documents
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  // Images
  "image/jpeg",
  "image/jpg",
  "image/png",
]);

const ALLOWED_EXTS = new Set(["pdf", "doc", "docx", "jpg", "jpeg", "png"]);
// file-type might return these for doc/docx
const ALLOWED_MAGIC = new Set(["pdf", "png", "jpg", "jpeg", "docx", "doc", "zip", "cfb"]);

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

    // Max 2MB for all uploads
    const maxSize = 2 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { success: false, error: `File too large. Maximum size is 2MB (got ${(file.size / 1024 / 1024).toFixed(1)}MB)` },
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

    // Validate extension
    const ext = file.name.split('.').pop()?.toLowerCase() || '';
    if (!ALLOWED_EXTS.has(ext)) {
      return NextResponse.json(
        { success: false, error: `File extension '.${ext}' is not allowed` },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    // Validate magic bytes (file signature)
    const type = await fileTypeFromBuffer(buffer);
    if (!type || !ALLOWED_MAGIC.has(type.ext)) {
      return NextResponse.json(
        { success: false, error: "Invalid file signature (magic bytes)" },
        { status: 400 }
      );
    }

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
    logger.error({ err: error }, "Upload error");
    
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
