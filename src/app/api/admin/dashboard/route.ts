import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import { getAuthUser, requireAdmin } from "@/lib/auth";
import User from "@/models/User";
import Task from "@/models/Task";
import Submission from "@/models/Submission";
import { redis } from "@/lib/redis";

// GET /api/admin/dashboard
export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const authUser = await getAuthUser(req);
    requireAdmin(authUser);

    const cacheKey = "admin:dashboard:data";
    const cachedData = await redis.get(cacheKey);

    if (cachedData) {
      return NextResponse.json(typeof cachedData === 'string' ? JSON.parse(cachedData) : cachedData);
    }

    const [
      totalStudents,
      totalTasks,
      publishedTasks,
      pendingReviews,
      totalSubmissions,
      totalAnnouncements,
      totalReviews,
      totalAdmins,
      recentSubmissions,
      topStudents,
    ] = await Promise.all([
      User.countDocuments({ role: "student" }),
      Task.countDocuments(),
      Task.countDocuments({ status: "published" }),
      Submission.countDocuments({ status: "pending" }),
      Submission.countDocuments(),
      mongoose.model("Announcement").countDocuments(),
      mongoose.model("Review").countDocuments(),
      User.countDocuments({ role: "admin" }),
      Submission.find()
        .populate("taskId", "title domains")
        .populate("studentId", "name email studentNumber avatar")
        .sort({ createdAt: -1 })
        .limit(10)
        .lean(),
      User.find({ role: "student" })
        .select("name email studentNumber avatar totalPoints completedTasks")
        .sort({ totalPoints: -1 })
        .limit(5)
        .lean(),
    ]);

    const responseData = {
      success: true,
      data: {
        totalStudents,
        totalTasks,
        publishedTasks,
        pendingReviews,
        totalSubmissions,
        totalAnnouncements,
        totalReviews,
        totalAdmins,
        recentSubmissions,
        topStudents,
      },
    };

    // Cache for 60 seconds
    await redis.setex(cacheKey, 60, JSON.stringify(responseData));

    return NextResponse.json(responseData);
  } catch (error) {
    console.error("[ADMIN DASHBOARD]", error);
    if (error instanceof Error && error.message.includes("Forbidden")) {
      return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
    }
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
