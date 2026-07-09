import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { getAuthUser, requireAdmin } from "@/lib/auth";
import Announcement from "@/models/Announcement";

// DELETE /api/announcements/[id]
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const authUser = await getAuthUser(req);
    requireAdmin(authUser);

    const { id } = await params;
    const announcement = await Announcement.findByIdAndDelete(id);
    if (!announcement) {
      return NextResponse.json({ success: false, error: "Announcement not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Announcement deleted" });
  } catch (error) {
    console.error("[DELETE ANNOUNCEMENT]", error);
    if (error instanceof Error && error.message.includes("Forbidden")) {
      return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
    }
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
