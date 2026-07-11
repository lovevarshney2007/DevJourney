import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { getAuthUser, requireAdmin } from "@/lib/auth";
import User from "@/models/User";
import Submission from "@/models/Submission";
import Task from "@/models/Task";
import { redis } from "@/lib/redis";

// GET /api/students — all students (admin)
export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const authUser = await getAuthUser(req);
    requireAdmin(authUser);

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const search = searchParams.get("search") || "";
    const sortBy = searchParams.get("sortBy") || "points";
    const domain = searchParams.get("domain") || "";

    const cacheKey = `admin:students:${search || "all"}:${sortBy}:${domain || "all"}:${page}:${limit}`;
    const cachedData = await redis.get(cacheKey);

    if (cachedData) {
      return NextResponse.json(typeof cachedData === 'string' ? JSON.parse(cachedData) : cachedData);
    }

    let sortOption: Record<string, 1 | -1> = { totalPoints: -1, createdAt: -1 };
    if (sortBy === "tasks") sortOption = { completedTasks: -1, totalPoints: -1 };
    if (sortBy === "latest") sortOption = { createdAt: -1 };
    if (sortBy === "name") sortOption = { name: 1 };

    let query: any = { role: "student" };
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { studentNumber: { $regex: search, $options: "i" } },
      ];
    }

    let responseData;

    if (domain) {
      // Step 1: Find tasks in this domain
      const tasksInDomain = await Task.find({ domains: domain }).select('_id').lean();
      const taskIds = tasksInDomain.map(t => t._id);

      // Step 2: Aggregate submissions for these tasks per student
      const userAgg = await Submission.aggregate([
        { $match: { taskId: { $in: taskIds }, status: "approved" } },
        {
          $group: {
            _id: "$studentId",
            domainPoints: { $sum: "$pointsAwarded" },
            domainTasks: { $sum: 1 }
          }
        }
      ]);

      const userMap = new Map();
      userAgg.forEach(u => userMap.set(u._id.toString(), { p: u.domainPoints, t: u.domainTasks }));

      if (userMap.size === 0) {
        responseData = { success: true, data: [], total: 0, page, limit, totalPages: 0 };
      } else {
        // Step 3: Fetch matching users and append scores manually, then sort
        query._id = { $in: Array.from(userMap.keys()) };
        const rawUsers = await User.find(query).select("-password").lean();
        
        let processedUsers = rawUsers.map(u => ({
          ...u,
          totalPoints: userMap.get(u._id.toString())?.p || 0,
          completedTasks: userMap.get(u._id.toString())?.t || 0,
        }));

        // In-memory sort since we override the points
        processedUsers.sort((a, b) => {
          if (sortBy === "tasks") return b.completedTasks - a.completedTasks;
          if (sortBy === "latest") return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          if (sortBy === "name") return (a.name as string).localeCompare(b.name as string);
          return b.totalPoints - a.totalPoints;
        });

        const total = processedUsers.length;
        const pagedData = processedUsers.slice((page - 1) * limit, page * limit);

        responseData = { success: true, data: pagedData, total, page, limit, totalPages: Math.ceil(total / limit) };
      }
    } else {
      // Normal logic
      const [students, total] = await Promise.all([
        User.find(query)
          .select("-password")
          .sort(sortOption)
          .skip((page - 1) * limit)
          .limit(limit)
          .lean(),
        User.countDocuments(query),
      ]);

      responseData = {
        success: true,
        data: students,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      };
    }

    // Cache for 60 seconds
    await redis.setex(cacheKey, 60, JSON.stringify(responseData));

    return NextResponse.json(responseData);
  } catch (error) {
    console.error("[GET STUDENTS]", error);
    if (error instanceof Error && error.message.includes("Forbidden")) {
      return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
    }
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
