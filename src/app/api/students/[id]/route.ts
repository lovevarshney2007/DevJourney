import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { getAuthUser, requireAdmin } from "@/lib/auth";
import User from "@/models/User";
import Submission from "@/models/Submission";
import "@/models/Task"; // Ensure Task schema is loaded for population

// GET /api/students/[id]
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const authUser = await getAuthUser(req);
    requireAdmin(authUser);

    const { id } = await params;
    
    // Fetch user details
    const student = await User.findById(id).select("-password").lean();
    if (!student || (student as any).role !== "student") {
      return NextResponse.json({ success: false, error: "Student not found" }, { status: 404 });
    }

    // Fetch all submissions by this student, populate the task info
    const submissions = await Submission.find({ studentId: id })
      .populate("taskId", "title domains points deadline")
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ 
      success: true, 
      data: { student, submissions } 
    });
  } catch (error) {
    console.error("[GET STUDENT DETAILS]", error);
    if (error instanceof Error && error.message.includes("Forbidden")) {
      return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
    }
  }
}

// DELETE /api/students/[id]
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const authUser = await getAuthUser(req);
    requireAdmin(authUser);

    const { id } = await params;
    
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
    }

    // Optionally delete related submissions/reviews here, but leaving them might be good for history, or we can just delete.
    await Submission.deleteMany({ studentId: id });

    return NextResponse.json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    console.error("[DELETE STUDENT]", error);
    if (error instanceof Error && error.message.includes("Forbidden")) {
      return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
    }
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
