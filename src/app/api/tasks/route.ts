import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { getAuthUser, requireAdmin } from "@/lib/auth";
import { createTaskSchema } from "@/lib/validations";
import Task from "@/models/Task";

// GET /api/tasks — list tasks
export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const authUser = await getAuthUser(req);
    if (!authUser) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const domain = searchParams.get("domain");
    const status = searchParams.get("status");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    const query: Record<string, unknown> = {};

    // Students only see published tasks
    if (authUser.role === "student") {
      query.status = "published";
    } else if (status) {
      query.status = status;
    }

    if (domain) {
      query.domains = domain;
    }

    const [tasks, total] = await Promise.all([
      Task.find(query)
        .populate("createdBy", "name email")
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      Task.countDocuments(query),
    ]);

    return NextResponse.json({
      success: true,
      data: tasks,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("[GET TASKS]", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}

// POST /api/tasks — create task (admin only)
export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const authUser = await getAuthUser(req);
    requireAdmin(authUser);

    const body = await req.json();
    const parsed = createTaskSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.errors[0].message },
        { status: 400 }
      );
    }

    const task = await Task.create({
      ...parsed.data,
      createdBy: authUser!.userId,
      importedFrom: "manual",
    });

    return NextResponse.json({ success: true, data: task, message: "Task created" }, { status: 201 });
  } catch (error) {
    console.error("[CREATE TASK]", error);
    if (error instanceof Error && error.message === "Forbidden: Admin access required") {
      return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
    }
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
