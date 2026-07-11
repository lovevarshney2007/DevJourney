import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import mongoose from "mongoose";
import Task from "@/models/Task";
import Submission from "@/models/Submission";
import Announcement from "@/models/Announcement";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();

        const sendEvent = (event: string, data: any) => {
          try {
            controller.enqueue(
              encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`)
            );
          } catch (e) {
            // Stream closed
          }
        };

        sendEvent("connected", { message: "SSE connected" });

        // Keep-alive ping to prevent connection timeout
        const pingInterval = setInterval(() => {
          sendEvent("ping", { time: Date.now() });
        }, 15000);

        try {
          // MongoDB Change Streams (requires Replica Set)
          const taskStream = Task.watch();
          const submissionStream = Submission.watch();
          const announcementStream = Announcement.watch();

          taskStream.on("change", (change) => sendEvent("task_update", change));
          submissionStream.on("change", (change) => sendEvent("submission_update", change));
          announcementStream.on("change", (change) => sendEvent("announcement_update", change));

          req.signal.addEventListener("abort", () => {
            clearInterval(pingInterval);
            taskStream.close();
            submissionStream.close();
            announcementStream.close();
            controller.close();
          });
        } catch (err) {
          // Fallback if MongoDB is not a replica set (Local dev sometimes)
          // We can fallback to an internal emitter if needed, but for now just send an error.
          sendEvent("error", { message: "Change streams not supported" });
          req.signal.addEventListener("abort", () => {
            clearInterval(pingInterval);
            controller.close();
          });
        }
      },
    });

    return new NextResponse(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache, no-transform",
        "Connection": "keep-alive",
        // CORS if needed
      },
    });
  } catch (error) {
    return NextResponse.json({ error: "SSE Error" }, { status: 500 });
  }
}
