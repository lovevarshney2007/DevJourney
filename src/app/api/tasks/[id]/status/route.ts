import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { getAuthUser, requireAdmin } from "@/lib/auth";
import Task from "@/models/Task";

// PATCH /api/tasks/[id]/status — change task status
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const authUser = await getAuthUser(req);
    requireAdmin(authUser);

    const { id } = await params;
    const { status } = await req.json();

    if (!["draft", "published", "archived"].includes(status)) {
      return NextResponse.json(
        { success: false, error: "Invalid status" },
        { status: 400 }
      );
    }

    const task = await Task.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!task) {
      return NextResponse.json(
        { success: false, error: "Task not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: task,
      message: `Task ${status}`,
    });
  } catch (error) {
    console.error("[TASK STATUS]", error);
    if (error instanceof Error && error.message.includes("Forbidden")) {
      return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
    }
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
