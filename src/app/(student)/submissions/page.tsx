"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Link from "next/link";
import { motion } from "framer-motion";
import { Send, ChevronRight, Github, ExternalLink } from "lucide-react";
import { StatusBadge, DomainBadge } from "@/components/ui/Badges";
import { EmptyState, PageHeader, Skeleton } from "@/components/ui/Common";
import { formatRelative } from "@/lib/utils";
import { ISubmission, ITask } from "@/types";

export default function MySubmissionsPage() {
  const { data: submissions, isLoading } = useQuery({
    queryKey: ["my-submissions"],
    queryFn: () => axios.get("/api/submissions?limit=50").then((r) => (r.data.data as ISubmission[]) || []),
  });

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <PageHeader
        title="My Submissions"
        description="Track the status of all your submitted work"
      />

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => <Skeleton key={i} className="h-24 w-full rounded-xl" />)}
        </div>
      ) : !submissions?.length ? (
        <EmptyState
          icon={<Send className="h-8 w-8" />}
          title="No submissions yet"
          description="Browse tasks and submit your first project!"
          action={<Link href="/tasks" className="btn-primary">Browse Tasks</Link>}
        />
      ) : (
        <div className="space-y-4">
          {submissions.map((sub, i) => {
            const task = sub.taskId as ITask;
            return (
              <motion.div
                key={sub._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Link href={`/submissions/${sub._id}`}>
                  <div className="card group cursor-pointer">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <StatusBadge status={sub.status} isLate={sub.isLate} />
                          {sub.version > 1 && (
                            <span className="text-[10px] text-text-muted border border-border-hairline rounded px-1.5 py-0.5">
                              v{sub.version}
                            </span>
                          )}
                        </div>
                        <h3 className="font-medium text-text-primary group-hover:text-accent transition-colors mb-1">
                          {task && typeof task === "object" ? task.title : "Deleted Task"}
                        </h3>
                        {task && typeof task === "object" && (
                          <div className="flex gap-1.5 mb-2">
                            {task.domains?.slice(0, 2).map((d) => (
                              <DomainBadge key={d} domain={d} size="sm" />
                            ))}
                          </div>
                        )}
                        <div className="flex items-center gap-3 text-xs text-text-muted">
                          <span className="flex items-center gap-1">
                            <Github className="h-3.5 w-3.5" />
                            GitHub
                          </span>
                          {sub.deployUrl && (
                            <span className="flex items-center gap-1">
                              <ExternalLink className="h-3.5 w-3.5" />
                              Live
                            </span>
                          )}
                          <span>{formatRelative(sub.submittedAt)}</span>
                        </div>
                      </div>
                      <ChevronRight className="h-5 w-5 text-text-muted group-hover:text-accent transition-colors flex-shrink-0" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
