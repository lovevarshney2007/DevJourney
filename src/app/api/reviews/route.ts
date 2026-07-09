import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { getAuthUser, requireAdmin } from "@/lib/auth";
import { createReviewSchema } from "@/lib/validations";
import Review from "@/models/Review";
import Submission from "@/models/Submission";
import User from "@/models/User";

// POST /api/reviews — create or update review (admin)
export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const authUser = await getAuthUser(req);
    requireAdmin(authUser);

    const body = await req.json();
    const parsed = createReviewSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.errors[0].message },
        { status: 400 }
      );
    }

    const { submissionId, status, feedback, pointsAwarded } = parsed.data;

    // Check submission exists
    const submission = await Submission.findById(submissionId);
    if (!submission) {
      return NextResponse.json({ success: false, error: "Submission not found" }, { status: 404 });
    }

    // Upsert review
    const existingReview = await Review.findOne({ submissionId });

    let review;
    let previousPoints = 0;

    if (existingReview) {
      previousPoints = existingReview.pointsAwarded;
      existingReview.status = status;
      existingReview.feedback = feedback;
      existingReview.pointsAwarded = pointsAwarded;
      existingReview.reviewedBy = authUser!.userId as unknown as import("mongoose").Types.ObjectId;
      existingReview.reviewedAt = new Date();
      review = await existingReview.save();
    } else {
      review = await Review.create({
        submissionId,
        reviewedBy: authUser!.userId,
        status,
        feedback,
        pointsAwarded,
        reviewedAt: new Date(),
      });
    }

    // Update submission status
    submission.status = status;
    await submission.save();

    // Update student points if approved
    if (status === "approved") {
      const pointsDiff = pointsAwarded - previousPoints;
      await User.findByIdAndUpdate(submission.studentId, {
        $inc: {
          totalPoints: pointsDiff,
          ...(existingReview ? {} : { completedTasks: 1 }),
        },
      });
    } else if (existingReview && existingReview.status === "approved") {
      // Was previously approved, now changed — reverse points
      await User.findByIdAndUpdate(submission.studentId, {
        $inc: { totalPoints: -previousPoints, completedTasks: -1 },
      });
    }

    return NextResponse.json({
      success: true,
      data: review,
      message: "Review submitted",
    });
  } catch (error) {
    console.error("[CREATE REVIEW]", error);
    if (error instanceof Error && error.message.includes("Forbidden")) {
      return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
    }
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}

// GET /api/reviews?submissionId=xxx
export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const authUser = await getAuthUser(req);
    if (!authUser) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const submissionId = searchParams.get("submissionId");
    if (!submissionId) {
      return NextResponse.json({ success: false, error: "submissionId required" }, { status: 400 });
    }

    const review = await Review.findOne({ submissionId })
      .populate("reviewedBy", "name email")
      .lean();

    return NextResponse.json({ success: true, data: review });
  } catch (error) {
    console.error("[GET REVIEW]", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
