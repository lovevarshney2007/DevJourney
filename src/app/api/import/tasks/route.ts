import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { getAuthUser, requireAdmin } from "@/lib/auth";
import { ALL_DOMAINS, Domain, ImportedTask } from "@/types";
import Task from "@/models/Task";

// POST /api/import/tasks — bulk import from Excel/Doc/PDF
export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const authUser = await getAuthUser(req);
    requireAdmin(authUser);

    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const action = (formData.get("action") as string) || "preview"; // preview | confirm
    const previewDataRaw = formData.get("previewData") as string | null;

    if (action === "confirm" && previewDataRaw) {
      // Bulk insert pre-parsed tasks
      const tasks: ImportedTask[] = JSON.parse(previewDataRaw);
      const source = (formData.get("source") as string) || "excel";

      const created = await Task.insertMany(
        tasks.map((t) => ({
          ...t,
          createdBy: authUser!.userId,
          importedFrom: source,
          status: "draft",
        }))
      );

      return NextResponse.json({
        success: true,
        data: created,
        message: `${created.length} tasks imported successfully`,
      });
    }

    if (!file) {
      return NextResponse.json({ success: false, error: "No file provided" }, { status: 400 });
    }

    const fileName = file.name.toLowerCase();
    const buffer = Buffer.from(await file.arrayBuffer());

    let tasks: ImportedTask[] = [];
    let errors: string[] = [];
    let source = "excel";

    if (fileName.endsWith(".xlsx") || fileName.endsWith(".xls")) {
      source = "excel";
      const result = await parseExcel(buffer);
      tasks = result.tasks;
      errors = result.errors;
    } else if (fileName.endsWith(".docx") || fileName.endsWith(".doc")) {
      source = "doc";
      const result = await parseDoc(buffer);
      tasks = result.tasks;
      errors = result.errors;
    } else if (fileName.endsWith(".pdf")) {
      source = "pdf";
      const result = await parsePdf(buffer);
      tasks = result.tasks;
      errors = result.errors;
    } else {
      return NextResponse.json(
        { success: false, error: "Unsupported file type. Use .xlsx, .docx, or .pdf" },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      data: { tasks, errors, source },
      message: `Parsed ${tasks.length} tasks with ${errors.length} errors`,
    });
  } catch (error) {
    console.error("[IMPORT TASKS]", error);
    if (error instanceof Error && error.message.includes("Forbidden")) {
      return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
    }
    return NextResponse.json({ success: false, error: "Import failed" }, { status: 500 });
  }
}

// ─── Excel Parser ──────────────────────────────────────────────────────────────
async function parseExcel(
  buffer: Buffer
): Promise<{ tasks: ImportedTask[]; errors: string[] }> {
  const XLSX = await import("xlsx");
  const workbook = XLSX.read(buffer, { type: "buffer" });
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet);

  const tasks: ImportedTask[] = [];
  const errors: string[] = [];

  rows.forEach((row, idx) => {
    const rowNum = idx + 2;
    try {
      const title = String(row["title"] || row["Title"] || "").trim();
      const description = String(row["description"] || row["Description"] || "").trim();
      const domainsRaw = String(row["domains"] || row["Domains"] || row["domain"] || "").trim();
      const deadlineRaw = String(row["deadline"] || row["Deadline"] || "").trim();
      const pointsRaw = Number(row["points"] || row["Points"] || 0);
      const resourceTitle = String(row["resourceTitle"] || row["Resource Title"] || "").trim();
      const resourceUrl = String(row["resourceUrl"] || row["Resource URL"] || "").trim();

      if (!title) { errors.push(`Row ${rowNum}: Title is required`); return; }
      if (!description) { errors.push(`Row ${rowNum}: Description is required`); return; }
      if (!deadlineRaw) { errors.push(`Row ${rowNum}: Deadline is required`); return; }
      if (!pointsRaw || pointsRaw < 1) { errors.push(`Row ${rowNum}: Valid points required`); return; }

      const domains = domainsRaw
        .split(",")
        .map((d) => d.trim())
        .filter((d) => ALL_DOMAINS.includes(d as Domain)) as Domain[];

      if (domains.length === 0) {
        errors.push(`Row ${rowNum}: No valid domains found. Use: ${ALL_DOMAINS.join(", ")}`);
        return;
      }

      const deadline = new Date(deadlineRaw);
      if (isNaN(deadline.getTime())) {
        errors.push(`Row ${rowNum}: Invalid deadline date`);
        return;
      }

      const resources = [];
      if (resourceTitle && resourceUrl) {
        resources.push({ title: resourceTitle, url: resourceUrl });
      }

      tasks.push({ title, description, domains, deadline: deadline.toISOString(), points: pointsRaw, resources });
    } catch (e) {
      errors.push(`Row ${rowNum}: Parse error — ${String(e)}`);
    }
  });

  return { tasks, errors };
}

// ─── Doc Parser ────────────────────────────────────────────────────────────────
async function parseDoc(
  buffer: Buffer
): Promise<{ tasks: ImportedTask[]; errors: string[] }> {
  const mammoth = await import("mammoth");
  const result = await mammoth.extractRawText({ buffer });
  return parseTextToTasks(result.value);
}

// ─── PDF Parser ────────────────────────────────────────────────────────────────
async function parsePdf(
  buffer: Buffer
): Promise<{ tasks: ImportedTask[]; errors: string[] }> {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const pdfParse = require("pdf-parse");
  const result = await pdfParse(buffer);
  return parseTextToTasks(result.text);
}

// ─── Text Parser (Doc/PDF fallback) ───────────────────────────────────────────
// Expects format:
// TASK START
// Title: ...
// Description: ...
// Domains: Backend, Frontend
// Deadline: 2025-12-31
// Points: 100
// TASK END
function parseTextToTasks(
  text: string
): { tasks: ImportedTask[]; errors: string[] } {
  const tasks: ImportedTask[] = [];
  const errors: string[] = [];

  const taskBlocks = text.split(/TASK\s*START/i).slice(1);

  if (taskBlocks.length === 0) {
    errors.push(
      "No task blocks found. Format each task between 'TASK START' and 'TASK END' markers"
    );
    return { tasks, errors };
  }

  taskBlocks.forEach((block, idx) => {
    const content = block.split(/TASK\s*END/i)[0];
    const get = (key: string) => {
      const match = content.match(new RegExp(`^${key}:\\s*(.+)$`, "mi"));
      return match ? match[1].trim() : "";
    };

    const title = get("title") || get("Title");
    const description = get("description") || get("Description");
    const domainsRaw = get("domains") || get("Domains") || get("domain");
    const deadlineRaw = get("deadline") || get("Deadline");
    const pointsRaw = get("points") || get("Points");

    if (!title || !description || !deadlineRaw || !pointsRaw) {
      errors.push(`Task ${idx + 1}: Missing required fields (title, description, deadline, points)`);
      return;
    }

    const domains = domainsRaw
      .split(",")
      .map((d) => d.trim())
      .filter((d) => ALL_DOMAINS.includes(d as Domain)) as Domain[];

    if (domains.length === 0) {
      errors.push(`Task ${idx + 1}: No valid domains. Use: ${ALL_DOMAINS.join(", ")}`);
      return;
    }

    const deadline = new Date(deadlineRaw);
    const points = parseInt(pointsRaw);

    if (isNaN(deadline.getTime()) || isNaN(points)) {
      errors.push(`Task ${idx + 1}: Invalid deadline or points`);
      return;
    }

    tasks.push({ title, description, domains, deadline: deadline.toISOString(), points, resources: [] });
  });

  return { tasks, errors };
}
