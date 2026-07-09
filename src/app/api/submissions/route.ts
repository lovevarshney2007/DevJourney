import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { getAuthUser } from "@/lib/auth";
import { createSubmissionSchema } from "@/lib/validations";
import Submission from "@/models/Submission";
import Task from "@/models/Task";

// GET /api/submissions
export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const authUser = await getAuthUser(req);
    if (!authUser) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const taskId = searchParams.get("taskId");
    const status = searchParams.get("status");
    const isLate = searchParams.get("isLate");
    const domain = searchParams.get("domain");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    const query: Record<string, unknown> = {};

    // Students only see their own submissions
    if (authUser.role === "student") {
      query.studentId = authUser.userId;
    }

    if (taskId) query.taskId = taskId;
    if (status) query.status = status;
    if (isLate !== null && isLate !== undefined) query.isLate = isLate === "true";

    let filteredSubs = await Submission.find(query)
      .populate("taskId", "title domains deadline points")
      .populate("studentId", "name email studentNumber avatar")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    // Filter by domain (task's domain) — post-fetch filter
    if (domain && authUser.role === "admin") {
      filteredSubs = filteredSubs.filter((s) => {
        const task = s.taskId as { domains?: string[] };
        return task?.domains?.includes(domain);
      });
    }

    const total = await Submission.countDocuments(query);

    return NextResponse.json({
      success: true,
      data: filteredSubs,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("[GET SUBMISSIONS]", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}

// POST /api/submissions — create or resubmit
export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const authUser = await getAuthUser(req);
    if (!authUser || authUser.role !== "student") {
      return NextResponse.json({ success: false, error: "Students only" }, { status: 403 });
    }

    const body = await req.json();
    const parsed = createSubmissionSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.errors[0].message },
        { status: 400 }
      );
    }

    const { taskId, githubUrl, videoDriveUrl, deployUrl, description, notes } = parsed.data;
    const files: string[] = body.files || [];

    // Verify task exists and is published
    const task = await Task.findById(taskId);
    if (!task || task.status !== "published") {
      return NextResponse.json({ success: false, error: "Task not found" }, { status: 404 });
    }

    // Check if late
    const isLate = new Date() > new Date(task.deadline);

    // Check for existing submission
    const existing = await Submission.findOne({ taskId, studentId: authUser.userId });

    if (existing) {
      // Resubmit
      existing.githubUrl = githubUrl;
      existing.videoDriveUrl = videoDriveUrl || undefined;
      existing.deployUrl = deployUrl || undefined;
      existing.description = description;
      existing.notes = notes;
      existing.files = files;
      existing.status = "pending"; // reset to pending on resubmit
      existing.isLate = isLate;
      existing.resubmittedAt = new Date();
      existing.version += 1;
      await existing.save();

      return NextResponse.json({
        success: true,
        data: existing,
        message: "Submission updated successfully",
      });
    }

    // Create new submission
    const submission = await Submission.create({
      taskId,
      studentId: authUser.userId,
      githubUrl,
      videoDriveUrl: videoDriveUrl || undefined,
      deployUrl: deployUrl || undefined,
      description,
      notes,
      files,
      isLate,
      submittedAt: new Date(),
    });

    return NextResponse.json(
      { success: true, data: submission, message: "Submission created successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("[CREATE SUBMISSION]", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
