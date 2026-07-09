import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export default cloudinary;

export async function uploadToCloudinary(
  buffer: Buffer,
  options: {
    folder?: string;
    resource_type?: "auto" | "image" | "video" | "raw";
    filename?: string;
  } = {}
): Promise<{ url: string; public_id: string }> {
  return new Promise((resolve, reject) => {
    const uploadOptions = {
      folder: options.folder || "devjourney",
      resource_type: options.resource_type || ("auto" as const),
      use_filename: !!options.filename,
      unique_filename: true,
      ...(options.filename ? { public_id: options.filename } : {}),
    };

    cloudinary.uploader
      .upload_stream(uploadOptions, (error, result) => {
        if (error || !result) {
          reject(error || new Error("Upload failed"));
          return;
        }
        resolve({ url: result.secure_url, public_id: result.public_id });
      })
      .end(buffer);
  });
}

export async function deleteFromCloudinary(publicId: string): Promise<void> {
  await cloudinary.uploader.destroy(publicId);
}
