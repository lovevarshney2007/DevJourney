import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { getAuthUser, requireAdmin } from "@/lib/auth";
import User from "@/models/User";

// GET /api/leaderboard — admin only
export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const authUser = await getAuthUser(req);
    requireAdmin(authUser);

    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get("limit") || "50");

    const students = await User.find({ role: "student" })
      .select("name email studentNumber avatar totalPoints completedTasks skills github")
      .sort({ totalPoints: -1, completedTasks: -1, createdAt: 1 })
      .limit(limit)
      .lean();

    // Add rank
    const ranked = students.map((s, i) => ({ ...s, rank: i + 1 }));

    return NextResponse.json({ success: true, data: ranked });
  } catch (error) {
    console.error("[LEADERBOARD]", error);
    if (error instanceof Error && error.message.includes("Forbidden")) {
      return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
    }
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
