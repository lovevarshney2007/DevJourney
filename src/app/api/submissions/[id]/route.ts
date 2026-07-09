import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { getAuthUser } from "@/lib/auth";
import Submission from "@/models/Submission";
import Review from "@/models/Review";

// GET /api/submissions/[id]
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const authUser = await getAuthUser(req);
    if (!authUser) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const submission = await Submission.findById(id)
      .populate("taskId", "title domains deadline points description pdfUrl")
      .populate("studentId", "name email studentNumber avatar")
      .lean();

    if (!submission) {
      return NextResponse.json({ success: false, error: "Submission not found" }, { status: 404 });
    }

    // Cast lean result to a workable type
    const sub = submission as typeof submission & { studentId: unknown };

    // Students can only see their own
    if (authUser.role === "student") {
      const studentIdStr =
        typeof sub.studentId === "object" && sub.studentId !== null && "_id" in (sub.studentId as object)
          ? (sub.studentId as { _id: { toString(): string } })._id.toString()
          : String(sub.studentId);
      if (studentIdStr !== authUser.userId) {
        return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
      }
    }

    // Get review if exists
    const review = await Review.findOne({ submissionId: id })
      .populate("reviewedBy", "name email")
      .lean();

    return NextResponse.json({ success: true, data: { submission, review } });
  } catch (error) {
    console.error("[GET SUBMISSION]", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
