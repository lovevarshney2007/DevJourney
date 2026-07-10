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
    if (!student || student.role !== "student") {
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
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
